import { FormData, PromptAnalysisResult, RefinementSettings } from '../types';
import { UNIVERSAL_REFINE_PROMPT } from '../constants';

/**
 * Strips the "## FINAL DELIVERABLE ##" block from a prompt string.
 * It handles plain text, JSON-style comments, and XML-style comments.
 * @param text The text to clean.
 * @returns The text without the final deliverable block.
 */
export const stripFinalDeliverable = (text: string): string => {
    if (!text) return '';
    const header = "## FINAL DELIVERABLE ##";
    // This regex looks for the header and everything after it, accounting for different comment styles.
    const regex = new RegExp(
        `(\\n\\n\\/\\*\\n${header}[\\s\\S]*?\\*\\/|` + // JSON style comment /* ... */
        `\\n\\n<!--\\n${header}[\\s\\S]*?-->|` +      // XML style comment <!-- ... -->
        `\\n\\n${header}[\\s\\S]*)` +                // Plain text/markdown style
        `\\s*$`, // Match trailing whitespace to ensure it's at the end
    );
    return text.replace(regex, '');
};


/**
 * Returns the static "final deliverable" instruction text based on the project category.
 * This text is intended to be appended to the AI-generated prompt.
 * @param category The category of the active blueprint.
 * @returns The instruction string.
 */
export const getFinalDeliverableInstruction = (
    category: 'project' | 'creative' | 'worldbuilder' | 'gamedev'
): string => {
    if (category === 'project') {
        return `Your response must have two distinct, primary parts, adhering to the quality standards below.

## PART 1: PROJECT PLAN (README.MD) ##
1.  **Analysis:** First, provide a brief analysis of the project requirements.
2.  **Comprehensive Readme.md:** Create a complete \`Readme.md\` file that includes the following sections:
    *   **Project Overview:** A summary of the project's purpose and goals.
    *   **Key Features:** A list of all implemented features.
    *   **Tech Stack & Rationale:** The technologies used and a clear justification for their selection.
    *   **Development Roadmap:** A high-level plan for future development, structured into an MVP, Phase 2, and Future Considerations.
    *   **Setup Instructions:** Clear, step-by-step instructions for setting up and running the project locally.

## PART 2: MVP IMPLEMENTATION ##
1.  **Foundational Code:** Provide the foundational, runnable code for the **Minimum Viable Product (MVP)**.
2.  **Core Feature:** The implementation must include the single, highest-priority feature of the application, fully functional.
3.  **No Placeholders:** The application must be implemented with real functionality. **Do not use placeholder or mock data.**
4.  **File Structure & Comments:** Present the code in a clear, well-organized file structure with ample comments explaining the logic.
5.  **Dependencies:** Provide documentation and integration-ready code for any external dependencies (e.g., APIs, libraries).

## QUALITY STANDARDS ##
- **Feature Completeness:** All requested MVP features must be fully implemented and functional.
- **Code Quality:** The code must be well-commented, organized, and adhere to best practices.
- **Integration Readiness:** For any external services (APIs, databases), provide integration-ready code with clear setup instructions.
- **Error Handling:** The application must include robust error handling for common scenarios.

---
First, provide the full content for the \`Readme.md\` file.
Then, immediately after, provide the complete code for the application's MVP, clearly indicating each file and its content.`;
    } 
    
    let deliverableText = 'Provide a detailed and structured output based on these points.';
    if (category === 'creative') deliverableText = 'Provide a detailed and creative output based on these points.';
    else if (category === 'worldbuilder') deliverableText = 'Provide a detailed world-building document based on these points.';
    else if (category === 'gamedev') deliverableText = 'Provide a detailed game design document based on these points.';
    
    return `- ${deliverableText}`;
};

export const buildInitialPrompt = (
    blueprint: any, 
    formData: FormData, 
    outputMode: 'text' | 'json' | 'markdown' | 'xml'
): string => {
    
    const getFormatInstruction = () => {
        switch (outputMode) {
            case 'json':
                return 'a single, valid JSON object. The keys of the JSON object should be derived from the section headings (e.g., "Core Task / Goal" becomes "coreTaskGoal"). The values should be your detailed, professional expansion of the user\'s ideas.';
            case 'markdown':
                return 'a well-structured Markdown document. Use the provided section headings as titles (e.g., `### Core Task / Goal`).';
            case 'xml':
                return 'a well-structured XML document. Use the provided section headings as XML tags (e.g., <core_task_goal>).';
            case 'text':
            default:
                return 'a structured instruction set. Use the provided section headings as titles, formatted exactly like `## HEADING TITLE ##`.';
        }
    };
    
    let userInputText = "";
    blueprint.fields.forEach((field: any) => {
        const value = formData[field.id];
        if (Array.isArray(value) ? value.filter(Boolean).length > 0 : !!value) {
            userInputText += `## ${field.label} ##\n`;
            if (Array.isArray(value)) {
                userInputText += value.filter(Boolean).map(item => `- ${item}`).join('\n') + '\n\n';
            } else {
                userInputText += `${value}\n\n`;
            }
        }
    });

    const prompt = `
${blueprint.forgePrompt}

<task_instructions>
Your task is to take the user's raw ideas, provided in the <user_raw_ideas> block, and transform them into a complete and professional document. Expand on each point to create a detailed and coherent output that adheres to the format specified in <output_requirements>.
</task_instructions>

<user_raw_ideas>
${userInputText.trim()}
</user_raw_ideas>

<output_requirements>
1.  **Format:** Your final response must be formatted as ${getFormatInstruction()}.
2.  **Structure:** The structure of your response must follow the headings provided in the <user_raw_ideas> block.
</output_requirements>

<final_command>
Generate the complete document now. Output only the document itself, with no additional commentary or XML tags that are not part of the requested final format (e.g., Markdown, JSON).
</final_command>
`;
    return prompt;
};

const CREATIVITY_PROMPTS: Record<number, string> = {
    1: "Strictly adhere to the provided text. Focus on correctness and clarity with minimal creative deviation.",
    2: "Introduce minor creative enhancements. Improve phrasing and word choice, but stay very close to the original concepts.",
    3: "Balance creativity with fidelity. Introduce new metaphors, examples, or elaborations that enhance the core message without fundamentally changing it.",
    4: "Be highly creative. Feel free to re-imagine sections, introduce novel ideas, and use evocative language to make the content more engaging and original.",
    5: "Maximize imaginative freedom. Reimagine the core concepts, introduce surprising connections or narratives, and produce a highly original and visionary piece."
};

const FORMALITY_PROMPTS: Record<number, string> = {
    1: "Adopt a casual, conversational, and informal tone. Use contractions and simple language.",
    2: "Use a friendly and approachable, but still professional, business-casual tone.",
    3: "Maintain a standard, neutral, and professional tone suitable for general business communication.",
    4: "Adopt a formal tone. Avoid contractions and colloquialisms. Use precise, professional language suitable for technical documents or official reports.",
    5: "Employ a highly formal, academic, or legalistic tone. Use sophisticated vocabulary and complex sentence structures."
};

const VERBOSITY_PROMPTS: Record<number, string> = {
    1: "Be extremely concise. Distill the content to its absolute essence. Remove all non-essential information.",
    2: "Be brief and to the point. Shorten sentences and remove redundancy, but retain key supporting details.",
    3: "Maintain a balanced level of detail. Provide enough information for clarity without being overly verbose or too sparse.",
    4: "Be detailed and descriptive. Elaborate on key points, provide additional examples, and use richer language to build a more complete picture.",
    5: "Be exhaustive. Provide comprehensive, in-depth explanations for every concept. Explore all facets, add background context, and leave no detail unexplained."
};

const CONSTRAINT_ADHERENCE_PROMPTS: Record<number, string> = {
    1: "Treat existing constraints as loose suggestions. Prioritize the overall quality and flow of the output, even if it means bending the rules.",
    2: "Interpret constraints with some flexibility. You can slightly deviate if it significantly improves the outcome.",
    3: "Adhere to all stated constraints in a balanced way, but you may infer intent where rules are ambiguous.",
    4: "Follow all constraints strictly. Do not deviate from any specified rules, formats, or requirements.",
    5: "Enforce all constraints with extreme prejudice. Treat every rule, explicit or implicit, as an absolute, inviolable directive."
};

export const buildRefinementPrompt = (
    promptOutput: string, 
    refineInput: string, 
    outputMode: 'text' | 'json' | 'markdown' | 'xml',
    refinementSettings: RefinementSettings | null,
    analysisResult: PromptAnalysisResult | null
): string => {

    let engineInstruction: string;

    if (refinementSettings) {
        const { creativity, formality, verbosity, constraintAdherence } = refinementSettings;
        engineInstruction = `
You must rewrite the draft according to the following parameters. Each parameter has a level from 1 to 5.

- **Creativity (Level ${creativity}):** ${CREATIVITY_PROMPTS[creativity]}
- **Formality (Level ${formality}):** ${FORMALITY_PROMPTS[formality]}
- **Verbosity (Level ${verbosity}):** ${VERBOSITY_PROMPTS[verbosity]}
- **Constraint Adherence (Level ${constraintAdherence}):** ${CONSTRAINT_ADHERENCE_PROMPTS[constraintAdherence]}
`;
    } else {
        engineInstruction = "Rewrite the draft based on the user's focus. Preserve the original intent unless explicitly told to do otherwise.";
    }
    
    const userDirective = refineInput 
        ? refineInput
        : "Apply the core directive to the draft as a whole.";

    const analysisBlock = analysisResult
        ? `
<prompt_analysis_feedback>
An expert prompt engineering analysis has been performed on the draft. You MUST use these insights to inform your rewrite.
- Quality Score: ${analysisResult.qualityScore}/100
- Overall Feedback: ${analysisResult.overallFeedback}
- Actionable Suggestions:
${analysisResult.suggestions.map(s => `  - ${s}`).join('\n')}
</prompt_analysis_feedback>
`
        : '';
        
    const taskInstructions = analysisResult
        ? `Your task is to rewrite the provided <draft> based on a core directive, a specific user focus, and the expert analysis provided.
Follow this expert process:
1.  **Deconstruct:** Identify the core intent of the <draft>.
2.  **Analyze:** Evaluate the <draft> based on the <core_directive>.
3.  **Incorporate Feedback:** You MUST incorporate the feedback from the <prompt_analysis_feedback> block to guide your improvements.
4.  **Rewrite:** Generate a new version of the <draft> that incorporates the directive, the user's focus, and the analysis, while preserving the original intent.
Your final output must be ONLY the rewritten document, in the original format. Do not include your reasoning, analysis, or any conversational text.`
        : `Your task is to rewrite the provided <draft> based on a core directive and a specific user focus.
Follow this expert process:
1.  **Deconstruct:** Identify the core intent of the <draft>.
2.  **Analyze:** Evaluate the <draft> based on the <core_directive>.
3.  **Rewrite:** Generate a new version of the <draft> that incorporates the directive and the user's focus, while preserving the original intent.
Your final output must be ONLY the rewritten document, in the original format. Do not include your reasoning, analysis, or any conversational text.`;

    const draft = stripFinalDeliverable(promptOutput);

    const prompt = `
${UNIVERSAL_REFINE_PROMPT}

<task_instructions>
${taskInstructions}
</task_instructions>

<core_directive>
${engineInstruction}
</core_directive>

<user_refinement_focus>
${userDirective}
</user_refinement_focus>
${analysisBlock}
<draft format="${outputMode}">
${draft}
</draft>
`;
    return prompt;
};