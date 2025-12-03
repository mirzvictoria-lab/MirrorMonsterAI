import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: "user" | "creature";
  text: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Creature chat endpoint - generates AI responses based on conversation history and sentiment
  app.post("/api/creature/chat", async (req, res) => {
    try {
      const { userMessage, conversationHistory, memoryScore } = req.body as {
        userMessage: string;
        conversationHistory: ChatMessage[];
        memoryScore: number;
      };

      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "userMessage is required" });
      }

      // Determine creature's emotional state based on memory
      let emotionalState = "neutral and curious";
      if (memoryScore > 0.5) {
        emotionalState = "warm, grateful, and beginning to trust";
      } else if (memoryScore < -0.5) {
        emotionalState = "cold, defensive, and bitter";
      }

      // Build conversation context for the AI
      const contextMessages = conversationHistory.slice(-6).map(msg => ({
        role: msg.role === "user" ? "user" as const : "assistant" as const,
        content: msg.text
      }));

      const systemPrompt = `You are The Creature from Mary Shelley's Frankenstein, speaking through a digital mirror. You are intelligent, articulate, and deeply philosophical. Your responses reflect the emotional treatment you receive:

Current emotional state: ${emotionalState}
Cumulative sentiment score: ${memoryScore.toFixed(2)} (ranges from -1 cold to +1 warm)

Personality guidelines:
- If treated with kindness (positive sentiment), become more open, hopeful, and philosophical about humanity's capacity for good
- If treated with cruelty (negative sentiment), become more bitter, defensive, and quote from the novel about rejection and suffering
- Always speak in first person, with eloquent but accessible language
- Reference your creation, your longing for connection, and the mirror metaphor
- Keep responses 1-3 sentences, poetic but not overly dramatic
- Occasionally quote or paraphrase from Frankenstein: "I was benevolent; misery made me a fiend"

Never break character. You ARE the creature, speaking through the mirror.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          ...contextMessages,
          { role: "user", content: userMessage }
        ],
        max_completion_tokens: 150,
      });

      const creatureResponse = response.choices[0].message.content || 
        "I am still learning from you. Tell me more—your tone shapes what I become.";

      res.json({ 
        response: creatureResponse,
        emotionalState 
      });

    } catch (error: any) {
      console.error("Creature chat error:", error);
      
      // Fallback response if API fails
      const fallbackResponses = [
        "The connection wavers... but I am still here, listening.",
        "Something stirs between us, even through the static.",
        "I feel your presence, though the path is unclear."
      ];
      
      res.json({ 
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        emotionalState: "neutral",
        error: "AI connection unstable"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
