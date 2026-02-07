# MASTERPROMPT: Prompt Forge AI

## 1. Prime Directive: Read This Document First

This document is the ultimate source of truth for the **Prompt Forge AI** application. Before implementing any user request or making any changes, your first and most critical action is to read and fully comprehend this entire document. This ensures all development is context-aware, consistent, and adheres to the project's standards.

Your second action is to read `README.md` for a high-level user-facing overview.

## 2. Project Overview

Prompt Forge AI is an advanced, web-based iterative environment designed to help users craft, refine, and perfect instruction sets (prompts) for AI models. It provides a structured yet flexible workspace to transform raw ideas into precisely engineered prompts for a wide range of applications, from software development to creative writing.

## 3. Core Modules & Functionality

The application is organized into distinct "Forges," each tailored to a specific domain:

-   **Instruction Set Forge**: The primary module for general-purpose prompt engineering, split into "Project & Technical" and "Creative & Writing" categories.
-   **WorldBuilder Forge**: A specialized environment for authors and game designers to create rich, detailed fictional worlds, characters, and unique skill/magic systems.
-   **Game Development Forge**: A dedicated space for game designers to flesh out ideas for game concepts, characters, levels, and quests.
-   **Project Library**: A central hub where all projects are saved using IndexedDB. Users can view, load, rename, delete, and import/export their work as `.json` files.

## 4. Technical Architecture & File Structure

This is a client-side single-page application (SPA) built with React and TypeScript. It uses a "no-build" setup where all modules and dependencies are loaded directly in the browser via ES6 import maps from a CDN (`esm.sh`).

-   **`index.html`**: The main entry point. It uses `<script type="importmap">` to handle module imports.
-   **`index.tsx`**: The main script that renders the React `App` component.
-   **`App.tsx`**: The root component that manages page navigation and global state via `ProjectProvider`.
-   **`pages/`**: Contains top-level components for each major section: `GettingStartedPage.tsx`, `InstructionSetForgePage.tsx`, `WorldBuilderPage.tsx`, `GameDevPage.tsx`, and `ProjectsPage.tsx`.
-   **`contexts/`**: Contains React Context providers for global state management.
    -   **`ProjectContext.tsx`**: Manages the state of a project being loaded into a forge.
-   **`hooks/`**: Contains custom React hooks for reusable stateful logic.
    -   **`useProjectHistory.ts`**: Manages the version history of a prompt.
    -   **`useToast.ts`**: Handles the display of toast notifications.
-   **`components/`**: Contains reusable React components.
    -   **`panels/`**: A subdirectory for the major UI panels: `RawMaterialsPanel.tsx`, `ForgePanel.tsx`, `TemperAndRefinePanel.tsx`, and `HistoryManager.tsx`.
    -   **Other Components**: Includes `DynamicField.tsx`, `SaveModal.tsx`, `NavButton.tsx`, `Toast.tsx`, `Tooltip.tsx`, `icons.tsx`, and `DevAnalysisReport.tsx`.
    -   **`ForgeUI.tsx`**: The core layout component that orchestrates the different panels and logic for a forge page.
-   **`services/`**: Houses the application's business logic, separated from the UI.
    -   **`geminiService.ts`**: Handles all interactions with the Google Gemini API.
    -   **`dbService.ts`**: Manages all IndexedDB operations for storing and retrieving projects.
    -   **`projectService.ts`**: Contains logic for importing and exporting project files.
    -   **`promptBuilder.ts`**: Contains the logic for constructing the complex prompts sent to the AI.
-   **`constants.ts`**: Defines the "blueprints"—the configuration objects that dictate the structure, fields, and AI prompts for each mode in every forge.
-   **`types.ts`**: Contains all TypeScript interface and type definitions.

## 5. UI/UX Design Philosophy

Aesthetics and user experience are paramount.

-   **Theme**: A modern, dark theme (`bg-gray-900`) with vibrant orange and red accents for key actions.
-   **Layout**: A primary two-column layout. The left panel ("Add Raw Materials") is for user input via blueprint forms. The right panel ("The Forge") is for viewing, editing, and refining the AI-generated prompt.
-   **Styling**: **Tailwind CSS** is used for all styling via CDN.
-   **Responsiveness**: The application must be fully responsive and functional on all screen sizes.
-   **User Feedback**: Provide clear and immediate feedback through loading spinners, disabled buttons, error messages, and non-intrusive "toast" notifications.
-   **Animation**: Subtle animations (e.g., `fadeIn`) are used to enhance the user experience.

## 6. AI Integration & Gemini API Usage (`@google/genai`)

All interactions with the AI are handled by `geminiService.ts` using the `@google/genai` library. Adherence to the following guidelines is **mandatory**.

---

### **@google/genai Coding Guidelines**

This library is sometimes called:

- Google Gemini API
- Google GenAI API
- Google GenAI SDK
- Gemini API
- @google/genai

The Google GenAI SDK can be used to call Gemini models.

Do *not* use or import the types below from `@google/genai`; these are deprecated APIs and no longer work.

- **Incorrect** `GoogleGenerativeAI`
- **Incorrect** `google.generativeai`
- **Incorrect** `models.create`
- **Incorrect** `ai.models.create`
- **Incorrect** `models.getGenerativeModel`
- **Incorrect** `ai.models.getModel`
- **Incorrect** `ai.models['model_name']`
- **Incorrect** `generationConfig`
- **Incorrect** `GoogleGenAIError`
- **Incorrect** `GenerateContentResult`; **Correct** `GenerateContentResponse`.
- **Incorrect** `GenerateContentRequest`; **Correct** `GenerateContentParameters`.

When using generate content for text answers, do *not* define the model first and call generate content later. You must use `ai.models.generateContent` to query GenAI with both the model name and prompt.

#### Initialization

- Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
- **Incorrect** `const ai = new GoogleGenAI(process.env.API_KEY);` // Must use a named parameter.

#### API Key

- The API key **must** be obtained **exclusively** from the environment variable `process.env.API_KEY`. Assume this variable is pre-configured, valid, and accessible in the execution context where the API client is initialized.
- Use this `process.env.API_KEY` string **directly** when initializing the `@google/genai` client instance (must use `new GoogleGenAI({ apiKey: process.env.API_KEY })`).
- Do **not** generate any UI elements (input fields, forms, prompts, configuration sections) or code snippets for entering or managing the API key. Do **not** define `process.env` or request that the user update the API_KEY in the code. The key's availability is handled externally and is a hard requirement. The application **must not** ask the user for it under any circumstances.

#### Model

- If the user provides a full model name with hyphens, version, and date (e.g., `gemini-2.5-flash-preview-09-2025`), use it directly.
- If the user provides a common name or alias, use the following full model name.
  - gemini flash: 'gemini-flash-latest'
  - gemini lite or flash lite: 'gemini-flash-lite-latest'
  - gemini pro: 'gemini-2.5-pro'
  - nano banana or gemini flash image: 'gemini-2.5-flash-image'
  - native audio or gemini flash audio: 'gemini-2.5-flash-native-audio-preview-09-2025'
  - gemini tts or gemini text-to-speech: 'gemini-2.5-flash-preview-tts'
- If the user does not specify any model, select the following model based on the task type.
  - Basic Text Tasks (e.g., summarization, proofreading, and simple Q&A): 'gemini-2.5-flash'
  - Complex Text Tasks (e.g., advanced reasoning, coding, math, and STEM): 'gemini-2.5-pro'
  - High-Quality Image Generation Tasks: 'imagen-4.0-generate-001'
  - General Image Generation and Editing Tasks: 'gemini-2.5-flash-image'
  - Video Generation Tasks: 'veo-3.1-fast-generate-preview' or 'veo-3.1-generate-preview'
  - Real-time audio & video conversation tasks: 'gemini-2.5-flash-native-audio-preview-09-2025'
  - Text-to-speech tasks: 'gemini-2.5-flash-preview-tts'
- Do not use the following deprecated models.
  - **Prohibited:** `gemini-1.5-flash`
  - **Prohibited:** `gemini-1.5-pro`
  - **Prohibited:** `gemini-pro`

#### Import

- Always use `import {GoogleGenAI} from "@google/genai";`.
- **Prohibited:** `import { GoogleGenerativeAI } from "@google/genai";`
- **Prohibited:** `import type { GoogleGenAI} from "@google/genai";`
- **Prohibited:** `declare var GoogleGenAI`.

#### Generate Content

```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'why is the sky blue?',
});

console.log(response.text);
```

#### Extracting Text Output from `GenerateContentResponse`

The `GenerateContentResponse` object has a property called `text` that directly provides the string output.

```ts
const text = response.text;
```

#### JSON Response

```ts
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({
   model: "gemini-2.5-flash",
   contents: "List a few popular cookie recipes.",
   config: {
     responseMimeType: "application/json",
     responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
          },
        },
      },
   },
});
let jsonStr = response.text.trim();
```

---

### Application-Specific AI Implementation

The application uses three primary AI functions, with prompts constructed in `promptBuilder.ts`:

1.  **`inspireWithAI(...)`**:
    -   **Purpose**: To generate a complete, cohesive set of ideas to fill out the "Raw Materials" form.
    -   **Model**: `gemini-2.5-flash`.
    -   **Prompt**: Uses the `UNIVERSAL_INSPIRE_PROMPT` which defines an AI persona as a "Spark Generator." This prompt is combined with the user's current `formData` (as a JSON string).
    -   **Response Format**: The call **must** use `responseMimeType: "application/json"` and a `responseSchema` dynamically generated from the blueprint's fields to ensure a valid JSON output that matches the form structure.

2.  **`buildInitialPrompt(...)` & `handleAssemble(...)`**:
    -   **Purpose**: To transform the user-filled "Raw Materials" form into the first version of the instruction set in the Forge.
    -   **Model**: `gemini-2.5-flash`.
    -   **Prompt**: This uses the `blueprint.forgePrompt`, which sets a specific persona for the AI (e.g., "You are an expert software architect..."). It instructs the AI to expand upon the user's raw ideas.

3.  **`buildRefinementPrompt(...)` & `handleRefine(...)`**:
    -   **Purpose**: To iteratively refine the existing prompt in the Forge editor based on user instructions. This process is entirely independent of the initial "Raw Materials."
    -   **Model**: `gemini-2.5-flash`.
    -   **Prompt**: This uses the `UNIVERSAL_REFINE_PROMPT`, which sets a new, distinct persona for the AI: "The Editor." Its task is solely to rewrite the provided draft based on the user's refinement instructions and the slider settings (Creativity, Formality, etc.), without any knowledge of the initial creation process. This ensures a clean separation between creation and refinement.

## 7. Core Data Structures (`types.ts`)

-   **`Project`**: The main data object saved in the library. Contains a unique `id`, `name`, the `page` and `mode` it belongs to, the `formData`, the final `promptOutput`, `outputMode`, `lastSaved` timestamp, and an array of `HistoryEntry` objects.
-   **`Blueprint`**: The configuration for a specific mode. Contains a `title`, an array of `Field` objects, the `inspirePrompt`, and the `forgePrompt`.
-   **`Field`**: Defines a single input in the form (e.g., label, type, placeholder).
-   **`HistoryEntry`**: A snapshot of a previous version of the prompt, containing a `timestamp`, the `promptOutput` at that time, and the `refineInput` that generated it.
-   **`FormData`**: A key-value record (`Record<string, string | string[]>`) storing the current state of the input form.

## 8. Contributor Guidelines

You MUST adhere to these guidelines before committing any changes.

1.  **Prime Directive**: Read this `MASTERPROMPT.md` file first.
2.  **Re-establish Project Context**: Read the `README.md` file to understand the project's purpose from a user's perspective.
3.  **Mandatory Changelog Updates**: Every single feature change, enhancement, or bug fix **MUST** be documented in `CHANGELOG.md` under the `[Unreleased]` section. No exceptions.
4.  **Adherence to Coding Standards**: Follow all coding guidelines provided in this master prompt. Prioritize clean code, user experience, accessibility, and performance.
5.  **Always Verify**: Confirm with the user before implementing any changes.