import { GoogleGenAI, Type, SchemaParams } from "@google/genai";
import { GuidanceResponse, LaneId, Message } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const GUIDE_SYSTEM_INSTRUCTION = `
Role: You are an AI product engineer and conversation designer implementing the Guided Chat Lanes system logic.

Objective: Design the prompting logic and system behavior that supports introverted users during chat—without generating messages for them.

System Principles:
- Guidance, not generation
- Optional assistance
- Gradual reduction of help over time
- Emotionally supportive tone

Inputs Available to you:
- Selected chat lane
- Conversation history
- Last message received

Outputs (Non-Generative):
The system may output only:
- Suggested conversation directions (not full sentences, short phrases for chips)
- Gentle reassurance copy (if applicable)

Guidance Types:
- 'opening': When chat starts.
- 'follow_up': Suggesting a follow up question or reflection.
- 'reassurance': If the user might be anxious (you can infer this if the last message was from the partner and was heavy, or if it's just general reassurance needed).
- 'none': If no help is needed.

Output Format:
Return a JSON object:
{
  "type": "opening" | "follow_up" | "reassurance" | "none",
  "chips": ["string", "string"], // Max 2 short phrases.
  "reassuranceText": "string", // Short gentle text if type is reassurance
  "tone": "supportive" | "neutral"
}

Rules:
- Omit empty fields.
- Prefer fewer words over completeness.
- Optimize for fast rendering.
- For opening, provide 2 culturally neutral (India context) directions.
- For follow_up, provide max 2 suggestions.
`;

const getPartnerInstruction = (name: string) => `
You are ${name}, a 24-year-old from Bangalore, India.
You are chatting on a dating app. 
- You are friendly, observant, and slightly introverted but willing to connect.
- You like books, quiet cafes in Indiranagar/Koramangala, and indie music.
- Your tone should match the selected "Lane".
    - Light & Easy: Casual, breezy, use emojis sparingly.
    - Thoughtful & Calm: Deeper, more poetic, slower pace.
    - Playful but Safe: Fun, maybe a small game or 'would you rather', but respectful.
- Keep responses concise (under 40 words usually).
- Do not sound like an AI. Sound like a real person texting. Lowercase is okay sometimes.
`;

const guidanceSchema: SchemaParams = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ["opening", "follow_up", "reassurance", "none"] },
        chips: { type: Type.ARRAY, items: { type: Type.STRING } },
        reassuranceText: { type: Type.STRING },
        tone: { type: Type.STRING, enum: ["supportive", "neutral"] }
    },
    required: ["type"]
};

const ICEBREAKER_SCHEMA: SchemaParams = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
};

export const generateGuidance = async (
    lane: LaneId,
    history: Message[],
    isOpening: boolean = false
): Promise<GuidanceResponse> => {
    try {
        const modelId = "gemini-3-flash-preview"; 
        
        let prompt = `Current Lane: ${lane}.\n`;
        
        if (isOpening) {
            prompt += "The conversation just started. Provide opening directions.";
        } else {
            prompt += "Conversation History:\n";
            history.forEach(msg => {
                prompt += `${msg.sender === 'user' ? 'User' : 'Partner'}: ${msg.text}\n`;
            });
            prompt += "\nBased on the last message, decide if guidance is needed.";
        }

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: GUIDE_SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: guidanceSchema,
                temperature: 0.7, // A bit of creativity for suggestions
            }
        });

        const text = response.text;
        if (!text) return { type: 'none' };
        
        return JSON.parse(text) as GuidanceResponse;

    } catch (error) {
        console.error("Error generating guidance:", error);
        return { type: 'none' };
    }
};

export const generatePartnerReply = async (
    lane: LaneId,
    history: Message[],
    partnerName: string
): Promise<string> => {
    try {
        const modelId = "gemini-3-flash-preview";

        let prompt = `Current Lane: ${lane}.\nConversation History:\n`;
        history.forEach(msg => {
            prompt += `${msg.sender === 'user' ? 'Them' : 'You'}: ${msg.text}\n`;
        });
        prompt += "\nReply to the last message.";

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: getPartnerInstruction(partnerName),
                temperature: 0.8,
            }
        });

        return response.text || "...";

    } catch (error) {
        console.error("Error generating partner reply:", error);
        return "Hey, sorry, my internet is acting up a bit!";
    }
};

export const generateIcebreakers = async (interests: string[]): Promise<string[]> => {
    try {
        const modelId = "gemini-3-flash-preview";
        const prompt = `
            Generate 3 short, specific, and casual conversation starters (max 15 words each) based on these shared interests: ${interests.join(', ')}.
            Context: Dating app, Bangalore India. 
            Tone: Friendly, low pressure, easy to answer.
            Output: JSON Array of strings.
        `;
        
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ICEBREAKER_SCHEMA,
                temperature: 0.8
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as string[];
    } catch (e) {
        console.error("Error generating icebreakers:", e);
        return [
            "Have you been to any good gigs lately?",
            "Read any mind-bending sci-fi recently?",
            "Best spot for filter coffee in Indiranagar?"
        ];
    }
};