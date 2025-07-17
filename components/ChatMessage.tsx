"use client";
import React from "react";
import { Message } from "./Chat";
import { useUser } from "@clerk/nextjs";
import { BotIcon, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";
import Image from "next/image";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div
      className={`flex items-start mb-4 ${
        isHuman ? "justify-end" : "justify-start"
      }`}
    >
    

      {!isHuman && (
        <div className="w-10 h-10 mr-2">
          <div className="rounded-full bg-indigo-600 w-10 h-10 flex items-center justify-center">
            <BotIcon className="text-white w-6 h-6" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-relaxed ${
          isHuman
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {message.message === "Thinking" || message.message === "Thinking..." ? (
          <Loader2Icon className="animate-spin h-5 w-5" />
        ) : (
          <Markdown>{message.message}</Markdown>
        )}
      </div>

      {isHuman && (
        <div className="w-10 h-10 ml-2">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User"
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
