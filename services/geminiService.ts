import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const expandMemoryWithAI = async (shortText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini");
    return "API Key missing. Cannot expand memory.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a poetic assistant in a "Memory Palace" app. 
      Take this short thought and expand it into a 50-word philosophical or descriptive reflection suitable for a digital void. 
      Thought: "${shortText}"`,
    });
    
    return response.text || "The void remains silent.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The connection to the ether is weak.";
  }
};

export const categorizeMemory = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) return "General";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Categorize this text into one single word (e.g., Work, Personal, Idea, Todo). Text: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    return "Unknown";
  }
};
