import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { pineconeClient } from "./pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import fs from "fs/promises";
import path from "path";
import { CohereEmbeddings } from '@langchain/cohere';
import { Reply } from "lucide-react";

const model = new ChatOpenAI({
  apiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-4o-mini",
});

export const indexName = "chattopdf";


async function fetchMessageFromDB (docId:string)
{
  const {userId} = await auth();
  if(!userId)
  {
    throw new Error("User not found")
  }
  console.log("---Fetching chat history from the firestore database---")
  const chats=await adminDb
  .collection('users')
  .doc(userId)
  .collection("files")
  .doc(docId)
  .collection("chat")
  .orderBy("createdAt","desc")
  .get()

    const  chatHistory=chats.docs.map((doc) =>
  {  return  doc.data().role === "human"
    ? new HumanMessage(doc.data().message)
    : new AIMessage(doc.data().message)

}
    )
    console.log(`---fetched last ${chatHistory.length} message successfully`)
    console.log(chatHistory.map((msg) => msg.content.toString()));
    return chatHistory;


}
export async function generateDocs(userId: string, docId: string) {
  console.log("--- Fetching the download URL from Firebase ---");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  if (!firebaseRef.exists) {
    throw new Error(`Document with id ${docId} does not exist in Firestore`);
  }

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl || typeof downloadUrl !== "string") {
    console.error("❌ Download URL not found for docId:", docId);
    throw new Error("Download URL not found");
  }

  console.log(`✅ Download URL fetched successfully: ${downloadUrl}`);

  const response = await fetch(downloadUrl);
  const arrayBuffer = await response.arrayBuffer();
  const filePath = path.join(process.cwd(), "temp", `${docId}.pdf`);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  console.log("📄 Loading PDF Document...");
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  console.log("🔪 Splitting the document into smaller parts...");
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`✅ Split into ${splitDocs.length} parts`);

  return splitDocs;
}

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (!namespace) throw new Error("No namespace value provided");
  const { namespaces } = await index._describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(userId:string,docId: string) {
  //const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("🧠 Generating embeddings...");
  // const embeddings = new OpenAIEmbeddings();
  const embeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY,
   model: "embed-english-v3.0"
});
  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  let pineconeVectorStore;

  if (namespaceAlreadyExists) {
    console.log(`♻️ Namespace ${docId} already exists, reusing existing embeddings...`);
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
  } else {
    // ✅ FIXED: Pass userId explicitly to generateDocs
    const splitDocs = await generateDocs(userId, docId);

    console.log(`📦 Storing the embeddings in namespace "${docId}" in the "${indexName}" Pinecone Vector Store...`);
    pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
  }

  return pineconeVectorStore;
}
 
const generateLangChainCompletion = async (userId:string,docId:string,question:string)=>
{
  //let pineconeVectorStore;
  const pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(userId,docId);

  console.log("---Creating a retriever ---")

  if(!pineconeVectorStore)
  {
    throw new Error("Pinecone vector not found")
  }

  const retriever =pineconeVectorStore.asRetriever();
  
  const chatHistory=await fetchMessageFromDB(docId);

  console.log("---Defining a prompt template... --- ")
  const historyAwarePrompt =ChatPromptTemplate.fromMessages(
  [  ...chatHistory,
    ["user","{input}"],
    [
      "user",
      "Given the above conversation , generate a search query to look up in order to get information relevant to conversation,"
    ],
  ]);

console.log("---Creating a history aware retriver chain---");
const historyAwareRetriverChain = await createHistoryAwareRetriever({
  llm:model,
  retriever,
  rephrasePrompt:historyAwarePrompt,
});



console.log("--- Defining a prompt template for answering questions...---")
const historyAwareRetrievalPrompt =ChatPromptTemplate.fromMessages([
[
  "system",
  "Answer the user's questions based on below context :\n\n{context}"
],
...chatHistory,
["user" ,"{input}"]
])
console.log("---Creating a document combining chian ...---")
const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm:model,
  prompt:historyAwareRetrievalPrompt
})

console.log("--Create the main retrieval chain..")
const conversationRetrievalChian = await createRetrievalChain({
  retriever:historyAwareRetriverChain,
  combineDocsChain:historyAwareCombineDocsChain
});

console.log("---Running the chain with a sample conversation...---")
const reply= await conversationRetrievalChian.invoke({
  chat_history:chatHistory,
  input:question
})

console.log(reply.answer)
return  reply.answer;

}

export {model,generateLangChainCompletion}