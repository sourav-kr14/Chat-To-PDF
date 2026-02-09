"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebaseClient";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database",
  GENERATING = "Generating AI Embeddings, this will only take a few seconds",
}

export type Status = StatusText[keyof typeof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    const fileIdToUploadTo = uuidv4();

    const storageRef = ref(
      storage,
      `users/${user.id}/files/${fileIdToUploadTo}`,
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file", error);
      },
      async () => {
        try {
          setStatus(StatusText.UPLOADED);

          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          setStatus(StatusText.SAVING);

          await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: serverTimestamp(),
          });

          setStatus(StatusText.GENERATING);

          // ✅ Call API route (Node runtime)
          await fetch("/api/generate-embeddings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              docId: fileIdToUploadTo,
            }),
          });

          setFileId(fileIdToUploadTo);
          router.push(`/dashboard/files/${fileIdToUploadTo}`);
        } catch (err) {
          console.error("Error saving file to Firestore", err);
        }
      },
    );
  };

  return { progress, status, fileId, handleUpload };
}

export default useUpload;
