# Books Recommendation RAG Chatbot with AWS Bedrock

A Retrieval-Augmented Generation (RAG) chatbot that recommends books based on user queries using AWS Bedrock for embeddings and Claude for generating responses.

## Features

- Book recommendations based on semantic similarity
- Vector embeddings using AWS Bedrock's Titan model
- Conversational interface with Claude 3 Sonnet
- Supabase vector database for efficient similarity search
- Clean, responsive UI

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, React
- **Backend**: Node.js, Express
- **AI/ML**: AWS Bedrock (Titan embeddings, Claude 3 Sonnet)
- **Database**: Supabase with pgvector
- **Deployment**: Local development server

## Setup

1. Clone the repository
   ```
   git clone https://github.com/k1now/BooksRecommendationRAGChatbot_Bedrock.git
   cd BooksRecommendationRAGChatbot_Bedrock
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with your credentials
   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   SUPABASE_API_KEY=your_supabase_api_key
   SUPABASE_URL=your_supabase_url
   ```

4. Start the server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `public/` - Static files and frontend code
- `src/` - Backend code
  - `index.js` - Main application logic
  - `chunker.js` - Text chunking for books
  - `embedding.js` - AWS Bedrock embedding generation
  - `cosineSimilarity.js` - Vector similarity search
  - `chatCompletion.js` - Claude 3 Sonnet chat completion
  - `dbUpload.js` - Supabase database operations
- `server.js` - Express server setup
![image](https://github.com/user-attachments/assets/d6ca7c3b-aba2-4bba-86bf-5380273c59c6)
