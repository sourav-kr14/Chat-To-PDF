'use server'
import { adminDb } from "@/firebaseAdmin";
import { FREE_LIMIT, PRO_LIMIT } from "@/hooks/useSubscription";
import { generateLangChainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

//  

export async function askQuestion (id:string,question:string)
{
    const{userId} = await auth();
    if(!userId)
    {
         throw new Error("Invalid User")
    }

   const chatRef = adminDb
   .collection("users")
   .doc(userId)
   .collection("files")
   .doc(id)
   .collection("chat")

   const chatSnapshot = await chatRef.get();
   const userMessages= chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"

   ); 
const userRef= await adminDb.collection("users").doc(userId!).get();
if(!userRef.data()?.hasActiveMembership)
{
     if(userMessages.length >= FREE_LIMIT)
     {
          return{
               success:false,
               message:`You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions!`
          }

     }
}
if(!userRef.data()?.hasActiveMembership)
{
     if(userMessages.length >= PRO_LIMIT)
     {
          return{
               success:false,
               message:`You'll need to upgrade to PRO to ask more than ${PRO_LIMIT} questions!`
          }

     }
}
   const userMesage :Message ={
    role:'human',
    message:question,
    createdAt : new Date()
   }

   await chatRef.add(userMesage);

   const reply= await generateLangChainCompletion(userId,id,question);

   const aiMessage:Message={
    role:"ai",
    message:reply,
    createdAt: new Date(),
   }
   await chatRef.add(aiMessage);
   return {success:true,message:null}
}