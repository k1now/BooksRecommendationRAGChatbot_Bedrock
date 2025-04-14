import fs from 'fs/promises';
import { splitBookList } from './textSplitter.js';

// Main function to process the books
export async function chunkBooks(filePath) {
    const booksList = await fs.readFile(filePath, 'utf-8');
    const bookChunks = splitBookList(booksList);
    console.log(`✅ Found ${bookChunks.length} book entries`);
    console.log(bookChunks[0]);
    return bookChunks;
}