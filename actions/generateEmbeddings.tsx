"use server";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(userId: string, docId: string) {
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  console.log(`Generating embeddings for docId: ${docId} by user: ${userId}`);

  await generateEmbeddingsInPineconeVectorStore(userId, docId);
  revalidatePath('/dashboard');

  return { completed: true };
}
