import { Pinecone } from '@pinecone-database/pinecone';

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '', // no underscore

});

export { pineconeClient };
