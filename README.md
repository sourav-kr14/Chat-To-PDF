# 📘 Chat to PDF — AI-Powered PDF Question Answering

Upload a PDF → Extract content → Ask questions → Get accurate AI responses.  
This project is built using **Next.js App Router, Pinecone, LangChain, OpenAI, Clerk Authentication, Stripe Billing, and pdf.js**.

---

## 🚀 Overview

Chat to PDF enables users to:

- 📤 Upload PDF documents  
- 📄 Parse and extract content from each page  
- 💬 Ask questions related to the PDF  
- 🤖 Get accurate answers using semantic context retrieval  
- 🔐 Login/sign-up using Clerk  
- 💳 Upgrade to premium features via Stripe  
- 📁 Save and manage uploaded documents in a dashboard  

It uses **RAG (Retrieval Augmented Generation)** with **Pinecone + LangChain** to ensure answers are based strictly on PDF content.

---

## ✨ Features

### 🔐 Authentication (Clerk)
- Secure sign-in/sign-up  
- Role-based access (Free vs Premium)

### 📤 PDF Upload
- Upload through `/app/upload`  
- PDF parsed using `pdf.js`  
- Extracted text sent to backend for processing

### 🤖 AI Question Answering
- LangChain used to chunk text  
- Embeddings generated with OpenAI  
- Stored in Pinecone for vector search  
- Fetches top-k relevant chunks  
- LLM produces accurate, grounded answers

### 📂 Document Management (Dashboard)
- View uploaded documents  
- Open chat interface for each PDF  
- Delete documents  

### 💸 Payments (Stripe)
- Premium subscription using Stripe Checkout  
- Customer portal support  
- Webhooks for subscription status

---

## 🛠️ Tech Stack

### **Frontend & Backend**
- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS

### **AI & Vector Storage**
- OpenAI / Gemini
- LangChain
- Pinecone

### **Authentication**
- Clerk

### **Payments**
- Stripe Billing

### **Storage / Parsing**
- pdf.js

---

## 🧩 Core AI Components

### 🌲 Pinecone
Vector database used to store PDF embeddings for fast semantic search.  
Implementation → `lib/pinecone.ts`

### 🔗 LangChain
Used to:
- Load PDF content  
- Split data into chunks  
- Generate embeddings  
- Create retrievers  
- Run RAG pipelines  
Implementation → `lib/langchain.ts`

---

## 📂 Project Structure


chat-to-pdf/
│
├── actions/
│   ├── askQuestion.ts
│   ├── createCheckoutSession.ts
│   ├── generateEmbeddings.ts
│   ├── deleteDocument.ts
│   └── createStripePortal.ts
│
├── app/
│   ├── api/
│   │   ├── documents/[id]/delete/route.ts
│   │   └── webhook/route.ts
│   ├── dashboard/
│   │   ├── files/[id]/page.tsx
│   │   └── page.tsx
│   ├── pricing/page.tsx
│   ├── upload/page.tsx
│   ├── sign-in/[...sign-in]/page.tsx
│   ├── sign-up/[...sign-up]/page.tsx
│   └── layout.tsx
│
├── components/
│   ├── ui/ (Button, Input, etc.)
│   ├── Chat.tsx
│   ├── ChatMessage.tsx
│   ├── FileUploader.tsx
│   ├── Document.tsx
│   └── Header.tsx
│
├── hooks/
│   ├── useUpload.ts
│   └── useSubscription.ts
│
├── lib/
│   ├── pinecone.ts
│   ├── langchain.ts
│   ├── getBaseUrl.ts
│   ├── stripe.ts
│   ├── stripe-js.ts
│   └── utils.ts
│
├── public/
│   ├── homepage.png
│   └── images/*
│
├── pdfjs/
│   └── pdf.worker.min.js
│
└── README.md

## 🔧 Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/sourav-kr14/Chat-To-PDF
cd chat-to-pdf

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create .env.local:

OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=your_env
PINECONE_INDEX=your_index
CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

4️⃣ Run development server
npm run dev

## 🧠 How It Works (RAG Pipeline)
- User uploads a PDF
- PDF pages are extracted
- Text is chunked (LangChain)
- Embeddings generated
- Stored in Pinecone

When user asks a question →
- ✔ Retrieve top-k relevant chunks
- ✔ AI answers using only those chunks

This prevents hallucination and gives accurate document-based answers.

## 📄 License – MIT
- This project is licensed under the MIT License.


## 💬 Author
**Sourav Kumar**  
GitHub: https://github.com/sourav-kr14
