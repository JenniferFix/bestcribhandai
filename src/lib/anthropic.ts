import Anthropic from "@anthropic-ai/sdk";

export interface Message {
  role: "user" | "assistant";
  content: string | Array<{ type: "text"; text: string }>;
}

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
