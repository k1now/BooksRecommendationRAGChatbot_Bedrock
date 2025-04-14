import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export async function dbUpload(bookChunks, bookEmbeddings) {
  try {
    const entries = bookChunks.map((chunk, index) => ({
      content: chunk,
      embedding: bookEmbeddings[index],
    }));

    // 👇 Print a sample before inserting
    console.log('Sample entry:', JSON.stringify(entries[0], null, 2));
    console.log('Embedding length:', entries[0].embedding.length);

    // 🚨 Check for incorrect data
    if (!Array.isArray(entries[0].embedding) || entries[0].embedding.length !== 1536) {
      throw new Error('Embedding must be an array of 1536 floats');
    }

    const { data, error } = await supabase.from('bookslist').insert(entries);
    console.log(data); 

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to insert data into bookslist');
    }

    console.log('✅ Upload successful!');
  } catch (err) {
    console.error('Caught error while storing books:', err.message || err);
    throw err;
  }
}



