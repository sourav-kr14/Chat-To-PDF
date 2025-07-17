"use client";

import React, { JSX, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  RocketIcon,
  Loader2Icon,
  SaveIcon,
  HammerIcon,
} from "lucide-react";
import useUpload from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

export default function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      } else {
        console.warn("No file was dropped.");
      }
      console.log(acceptedFiles);
    },
    [handleUpload]
  );
  enum StatusText {
    UPLOADING = "UPLOADING",
    UPLOADED = "UPLOADED",
    SAVING = "SAVING",
    GENERATING = "GENERATING",
  }
  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600" />
    ),
  };
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-200 text-white border-indigo-600 border-4 ${
              progress === 100 ? "hidden" : ""
            }`}
            role="progressbar"
            style={{
              //@ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress}%
          </div>
          {
            //@ts-ignore
            statusIcons[status!]
          }

          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
      )}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-indigo-600 w-[90%] border-dashed mt-10 rounded-lg h-96 flex items-center justify-center text-indigo-600 
        ${isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p className="mt-4">Drop the file here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p className="mt-4">
                  Drag and drop a PDF file here, or click to select one
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Status Feedback */}
      <div className="mt-4 text-center">
        {status === "uploading" && (
          <div className="flex items-center gap-2 text-indigo-600">
            <Loader2Icon className="animate-spin w-5 h-5" />
            <span>Uploading... {progress}%</span>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Upload successful!</span>
          </div>
        )}
        {status === "error" && (
          <div className="text-red-600">Upload failed. Try again.</div>
        )}
      </div>
    </div>
  );
}
