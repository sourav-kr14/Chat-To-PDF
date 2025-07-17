"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import { pineconeClient } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized User");
  }

  await adminStorage;
  const bucket = adminStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

  try {
    await bucket.file(`users/${userId}/files/${docId}`).delete();
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }

  const index = await pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();
  revalidatePath("/dashboard");
}
