// Configure text splitter for book entries
export function splitBookList(booksList) {
    const entries = booksList.split(/\n(?=\d+\.\s)/); // Split when a new number starts on its own line
    const bookChunks = entries.map(entry => entry.trim()).filter(entry => entry.length > 0);
    return bookChunks;
}