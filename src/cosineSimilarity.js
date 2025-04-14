//import { createClient } from '@supabase/supabase-js';
//import dotenv from "dotenv";
//dotenv.config();

//console.log("✅ ENV Loaded FOR COSINE SIMILARITY");

//const supabase = createClient(
//  process.env.SUPABASE_URL,
//  process.env.SUPABASE_API_KEY
//);
import { supabase } from "./index.js";

console.log("✅ Supabase Client Created FOR COSINE SIMILARITY");

export async function cosineSimilarity(userQueryEmbedding) {
    try {
        const { data: book, error } = await supabase.rpc('match_bookslist', {
            query_embedding: userQueryEmbedding,
            match_threshold: 0.2,
            match_count: 1
        });
       
        if (error) throw error;
    
        return book;

    } catch (error) {
        console.error('Error finding similar book:', error);
        throw error;
    }
    
}
