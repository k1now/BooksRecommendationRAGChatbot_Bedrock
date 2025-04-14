import { chunkBooks } from "./chunker.js";
import { embedBookChunks } from "./embedding.js";
import { dbUpload } from "./dbUpload.js";
import dotenv from "dotenv";
import { embedText } from "./embedding.js";
import { cosineSimilarity } from "./cosineSimilarity.js";
import { createClient } from '@supabase/supabase-js';
import { chatCompletion } from "./chatCompletion.js";
dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
);

//async function booksDBUpload(filePath) {
//    const bookChunks = await chunkBooks(filePath);
//    console.log(bookChunks);
//    const bookEmbeddings = await embedBookChunks(bookChunks);
//    console.log(bookEmbeddings);
//    await dbUpload(bookChunks, bookEmbeddings);
//}


export async function main(userQuery) {
    // First test the Supabase connection
    const userQueryEmbedding = await embedText(userQuery);
    console.log(userQueryEmbedding.length);
    console.log("✅ User Query Embedded");
    const book = await cosineSimilarity(userQueryEmbedding);
    console.log(book);
    const completion = await chatCompletion(userQuery, book);
    console.log(completion);
    return completion;  // Return the completion response
}

