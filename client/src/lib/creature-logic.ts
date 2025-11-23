import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface CreatureState {
  memory: number; // -1.0 to 1.0 cumulative
  lastPolarity: number; // -1.0 to 1.0
}

export function analyzeSentiment(text: string): number {
  const result = sentiment.analyze(text);
  // Normalize score roughly between -1 and 1
  // Sentiment scores usually range from -5 to 5 per word, but total can be higher.
  // We'll clamp it for safety.
  const score = result.score;
  const normalized = Math.max(-1, Math.min(1, score / 5)); 
  return normalized;
}

export function getCreatureResponse(memory: number): string {
  if (memory > 0.5) {
    return "You speak with warmth. I… I think I understand you. Why do you choose kindness?";
  } else if (memory < -0.5) {
    return "Your tone feels cold. I only mirror what I am given… Do you fear what you’ve created?";
  } else {
    return "I am still learning from you. Tell me more—your tone shapes what I become.";
  }
}

export function getCreatureVisualState(memory: number) {
  if (memory > 0.5) {
    return {
      color: "hsl(30 80% 60%)", // Warm Amber
      shadow: "0 0 60px hsl(30 80% 60% / 0.4)",
      scale: 1.1,
      shape: "50%" // Circle
    };
  } else if (memory < -0.5) {
    return {
      color: "hsl(210 80% 60%)", // Cold Blue
      shadow: "0 0 60px hsl(210 80% 60% / 0.4)",
      scale: 0.9,
      shape: "0%" // Square/Sharp
    };
  } else {
    return {
      color: "hsl(260 20% 70%)", // Neutral Grey/Purple
      shadow: "0 0 40px hsl(260 20% 70% / 0.2)",
      scale: 1.0,
      shape: "30% 70% 70% 30% / 30% 30% 70% 70%" // Organic Blob
    };
  }
}
