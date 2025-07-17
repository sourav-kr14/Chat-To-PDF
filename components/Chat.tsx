"use client";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import {askQuestion,Message} from "@/actions/askQuestion"

import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import React from "react";
import ChatMessage from "./ChatMessage";
//import { ChatMessage } from "@langchain/core/messages";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};
function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [message, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [snapshot,loading,error] =useCollection(
    user&& query (
        collection (db,"users",user?.id,"files",id,"chat"),
        orderBy("createdAt","asc")
    )
  );
  useEffect (() =>
  {
    bottomOfChatRef.current?.scrollIntoView({behavior:"smooth"})

  },[message])
  useEffect(() =>
{
    if(!snapshot) return;
    console.log("Updated Snapshot",snapshot.docs);
    const lastmessage=message.pop();

    if(lastmessage?.role === "ai" && lastmessage.message === "Thinking...")
    {
        return;
    }
 const newMessages = snapshot.docs.map(doc => {
  const { role, message, createdAt } = doc.data();
  return {
    id: doc.id,
    role,
    message,
    createdAt: createdAt.toDate(),
  };
});

setMessages(newMessages);




},[snapshot])
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q=input;
    setInput("");
    setMessages((prev)=>
    [
    ...prev,
    {
        role:"ai",
        message:q,
        createdAt:new Date(),
    },
    {
        role:"ai",
        message:"Thinking",
        createdAt:new Date(),
    },
])
startTransition(async() =>
{
    const {success,message} = await askQuestion(id,q);

    if(!success)
    {
        setMessages((prev) =>
        prev.slice(0,prev.length-1).concat([
            {
                role:"ai",
                message:`Whoops... ${message}`,
                createdAt: new Date(),
            }
        ]))
    }


})

  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* CHat COntent */}
     <div className="flex-1 w-full">
  {/* Chat Message */}
  {loading ? (
    <div className="flex items-center justify-center">
      <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
    </div>
  ) : (
    <div className="p-5">
      {message.length === 0 && (
        <ChatMessage
          key={"placeholder"}
          message={{
            role: "ai",
            message: "Ask me anything about the document",
            createdAt: new Date(),
          }}
        />
      )}

      {message.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} />
      ))}

      <div ref={bottomOfChatRef} />
    </div>
  )}
</div>

      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-200 "
      >
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
function newDate() {
    throw new Error("Function not implemented.");
}

