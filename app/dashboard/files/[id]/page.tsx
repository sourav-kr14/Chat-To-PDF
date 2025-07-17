import Chat from "@/components/Chat";
import PdfViewerWrapper from "@/components/PdfViewerWrapper"; // ✅ use wrapper
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface ChatToFilePageProps {
  params: {
    id: string;
  };
}

async function ChatToFilePage({ params }: ChatToFilePageProps) {
  const { id } = params;

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      {/* Right */}
      <div className="col-span-5 overflow-y-auto lg:col-span-2">
        <Chat id={id} />
      </div>

      {/* Left */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto ">
        {/* ✅ Use client wrapper here */}
        <PdfViewerWrapper url={url} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
