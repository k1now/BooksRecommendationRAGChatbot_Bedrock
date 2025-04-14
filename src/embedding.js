import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
dotenv.config();

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
});

export async function embedText(text) {
    const input = {
        modelId: "amazon.titan-embed-text-v1",
        contentType: "application/json",
        accept: "*/*",
        body: JSON.stringify ({ inputText: text}),
    }
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const { embedding } = JSON.parse(new TextDecoder().decode(response.body));
    return embedding;
}

export async function embedBookChunks(bookChunks) {
    const bookEmbeddings = await Promise.all(bookChunks.map(embedText));
    return bookEmbeddings;
}
