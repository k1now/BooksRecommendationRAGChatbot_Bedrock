import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
dotenv.config();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

export async function chatCompletion(userQuery, bestMatch) {
  const book = bestMatch[0]; // ✅ Use first match from array
  const content = book.content;

  const prompt = [
    {
      role: "user",
      content: `You are a helpful and enthusiastic book expert.

The user asked: "${userQuery}"

Based on their query, you are recommending this book:

Title: ${extractField("title", content)}
Author: ${extractField("author", content)}
Genre: ${extractField("genre", content)}
Description: ${extractField("description", content)}
Rating: ${extractField("rating", content)}
Year: ${extractField("year", content)}

Please provide a very concise recommendation (maximum 2-3 sentences) explaining why this book is a good match for their request. Focus only on the most relevant aspects that directly address their query. Do not suggest other books or add unnecessary details.

IMPORTANT: Your response MUST be extremely brief and complete within 150 tokens. Prioritize clarity and relevance over length.`,
    },
  ];

  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: prompt,
      max_tokens: 150,
      anthropic_version: "bedrock-2023-05-31",
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));

  // Extract just the text content from the response
  return result.content[0].text;
}

function extractField(field, content) {
  switch (field) {
    case "title":
      return content.split("\n")[0].replace(/^\d+\.\s*/, "");
    case "author":
      return content.match(/Author:\s*(.*)/i)?.[1] || "";
    case "genre":
      return content.match(/Genre:\s*(.*)/i)?.[1] || "";
    case "description":
      return content.match(/Description:\s*(.*)/i)?.[1] || "";
    case "rating":
      return content.match(/Rating:\s*(.*)/i)?.[1] || "";
    case "year":
      return content.match(/Year:\s*(.*)/i)?.[1] || "";
    default:
      return "";
  }
}
