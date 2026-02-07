import { GoogleGenAI, Type } from "@google/genai";
import { Blueprint, FormData, PromptAnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleGeminiError = (error: unknown): string => {
    if (error instanceof Error) {
        // Check for specific error messages from the Gemini API
        if (error.message.includes('API_KEY_INVALID')) {
            return "The API key is invalid. Please check your environment configuration.";
        }
        if (error.message.includes('400')) {
            return `The request was malformed, which can be caused by an issue in the prompt. (400 Bad Request)`;
        }
        if (error.message.includes('500')) {
             return "The AI service encountered an internal error. Please try again later. (500 Server Error)";
        }
        // Fallback to the generic error message
        return error.message;
    }
    return "An unknown error occurred.";
};


/**
 * A generic function that takes a pre-constructed prompt and sends it to the Gemini API.
 * @param prompt The complete prompt string to send to the AI.
 * @param outputMode The desired output format, which determines the response MIME type.
 * @returns The text response from the AI.
 */
export const generateContent = async (
    prompt: string, 
    outputMode: 'text' | 'json' | 'markdown' | 'xml'
): Promise<string> => {
    try {
        const config: any = {
            maxOutputTokens: 8192,
            thinkingConfig: { thinkingBudget: 4096 },
        };
        if (outputMode === 'json') {
            config.responseMimeType = "application/json";
        } else if (outputMode === 'xml') {
            config.responseMineType = "application/xml";
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });
        
        let text = response.text;
        if (outputMode === 'json') {
            // Clean up potential markdown formatting and extract the JSON object
            text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            try {
                JSON.parse(text);
            } catch (e) {
                console.warn("AI returned non-valid JSON, attempting to fix...");
                const firstBrace = text.indexOf('{');
                const lastBrace = text.lastIndexOf('}');
                const firstBracket = text.indexOf('[');
                const lastBracket = text.lastIndexOf(']');

                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    text = text.substring(firstBrace, lastBrace + 1);
                } else if (firstBracket !== -1 && lastBracket > firstBracket) {
                    text = text.substring(firstBracket, lastBracket + 1);
                }
            }
        }
        return text;
    } catch(err) {
        console.error("Error in generateContent:", err);
        throw new Error(handleGeminiError(err));
    }
};


/**
 * Uses the AI to generate a complete set of ideas for a blueprint.
 * This function now uses a structured prompt for better consistency.
 * On JSON parsing failure, it returns the raw text string as a fallback.
 * @param blueprint The active blueprint definition.
 * @param formData The current user input to provide context.
 * @returns A FormData object with AI-generated ideas, or a raw string on parsing failure.
 */
export const inspireWithAI = async (blueprint: Blueprint, formData: FormData): Promise<FormData | string> => {
  try {
    // This schema is for the strict `responseSchema` enforcement by the API
    const responseSchemaProperties: Record<string, { type: Type; description?: string, items?: { type: Type } }> = {};
    // This schema is for the in-prompt `output_schema` which is a suggestion for the AI
    const simplePromptSchema: Record<string, string> = {};

    blueprint.fields.forEach(field => {
        if (field.type === 'list') {
            responseSchemaProperties[field.id] = { type: Type.ARRAY, items: { type: Type.STRING }, description: field.placeholder };
            simplePromptSchema[field.id] = 'ARRAY';
        } else {
            const description = field.type === 'textarea' ? `${field.placeholder} (Max 3 sentences)` : field.placeholder;
            responseSchemaProperties[field.id] = { type: Type.STRING, description };
            simplePromptSchema[field.id] = field.type === 'textarea' ? 'TEXTAREA (Max 3 sentences)' : 'STRING';
        }
    });

    const inputJson = {
        user_context: formData,
        output_schema: simplePromptSchema,
    };
    
    let exampleBlock = '';
    if (blueprint.inspireExample) {
        exampleBlock = `<output_example>
${JSON.stringify(blueprint.inspireExample, null, 2)}
</output_example>`;
    }
  
    const fullPrompt = `${blueprint.inspirePrompt}
${exampleBlock}
<user_input_json>
${JSON.stringify(inputJson, null, 2)}
</user_input_json>
`;
  
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: responseSchemaProperties
        },
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 4096 },
      }
    });
  
    let text = response.text.trim();
    
    if (text.startsWith('```json')) {
        text = text.substring(7);
        if (text.endsWith('```')) {
            text = text.substring(0, text.length - 3);
        }
    } else if (text.startsWith('```')) {
        text = text.substring(3);
        if (text.endsWith('```')) {
            text = text.substring(0, text.length - 3);
        }
    }
  
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        text = text.substring(firstBrace, lastBrace + 1);
    }
  
    try {
      const ideas = JSON.parse(text);
      return ideas as FormData;
    } catch (e) {
        console.error("Failed to parse JSON from AI response. Returning raw text as fallback.", text);
        return text; // Return the raw text on parsing failure
    }
  } catch(err) {
      console.error("Error in inspireWithAI:", err);
      throw new Error(handleGeminiError(err));
  }
};

/**
 * Analyzes a prompt and returns a quality score and suggestions.
 * @param prompt The prompt text to analyze.
 * @returns A structured analysis object.
 */
export const analyzePromptQuality = async (prompt: string): Promise<PromptAnalysisResult> => {
    try {
        const analysisPrompt = `
You are a world-class prompt engineering expert. Your task is to analyze the user's prompt based on the following criteria: clarity, conciseness, specificity, and adherence to best practices (e.g., establishing a clear persona, providing constraints).

Your analysis must include:
1.  A "qualityScore" from 0 to 100, where 100 is a perfect, production-ready prompt.
2.  "overallFeedback" summarizing the prompt's strengths and weaknesses.
3.  An array of "suggestions" with 2-3 concrete, actionable recommendations for improvement.

Analyze the following prompt:
---
${prompt}
---

Return your analysis as a single, valid JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: analysisPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        qualityScore: { type: Type.NUMBER },
                        overallFeedback: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                },
                maxOutputTokens: 1024,
                thinkingConfig: { thinkingBudget: 512 },
            }
        });
        
        const text = response.text.trim();
        return JSON.parse(text) as PromptAnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON from prompt analysis:", e);
        throw new Error(handleGeminiError(e));
    }
};

/**
 * Generates a development analysis report for the Prompt Forge AI application.
 * @returns A markdown string containing the analysis.
 */
export const generateDevAnalysis = async (): Promise<string> => {
    const analysisPrompt = `
You are a world-class senior software architect and AI systems design consultant. You have been asked to review a web application called "Prompt Forge AI".

Here is a detailed summary of the application:

**Application:** Prompt Forge AI

**Purpose:** An advanced, web-based iterative environment for crafting, refining, and perfecting instruction sets (prompts) for AI models. It provides a structured workspace to transform raw ideas into precisely engineered prompts.

**Core Modules:**
- **Instruction Set Forge:** For general-purpose prompt engineering (technical & creative).
- **WorldBuilder Forge:** For creating fictional worlds, characters, and skill systems.
- **Game Development Forge:** For designing game concepts, characters, levels, and quests.
- **Project Library:** A central hub to save, load, manage, and import/export projects.

**Key Features:**
- **Blueprint-Based Forms:** Dynamic forms guide the user to provide structured information.
- **AI-Powered Inspiration ("Inspire Me"):** An AI feature to generate a complete idea based on initial user input.
- **The Forge (Iterative Refinement):** A core editor where users can iteratively refine a generated prompt with AI assistance using "Vibe" and "Logic" engines with varying intensity.
- **Project History & Versioning:** Automatically tracks the evolution of a prompt, allowing users to restore previous versions.
- **Persistent Storage:** Uses IndexedDB for robust, client-side project storage.
- **Import/Export:** Projects can be exported as \`.json\` files (including history) and imported. \`.txt\` files can also be imported as a base prompt.

**Technical Architecture:**
- **Framework:** React with TypeScript.
- **Build System:** No build step. It is a single-page application that uses ES6 modules loaded directly in the browser via an import map from a CDN (esm.sh).
- **Styling:** Tailwind CSS via CDN.
- **API:** Google Gemini API (\`@google/genai\` library).

**Your Task:**

Based on this summary, provide a complete and professional analysis. Structure your report in Markdown with the following sections:

1.  **Overall Architecture Review:**
    -   Provide your assessment of the current architecture (no-build, CDN-based SPA).
    -   Discuss the pros and cons of this approach.

2.  **Scalability Analysis:**
    -   Evaluate the application's scalability in terms of features, user data (IndexedDB), and performance as the application grows.
    -   Identify potential bottlenecks.

3.  **Potential Enhancements & New Features:**
    -   Suggest 3-5 concrete, innovative features that would enhance the application's value proposition. 
    -   **CRITICAL:** For each suggestion, provide a clear rationale that is explicitly tied to one or more of the application's target user personas: **Software Developers, Creative Writers, and Game Designers.**
    -   Propose technical or UX improvements to the existing features.
`;
    return await generateContent(analysisPrompt, 'markdown');
};