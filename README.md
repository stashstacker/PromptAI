# Prompt Forge AI

Prompt Forge AI is an advanced, web-based iterative environment designed to help users craft, refine, and perfect instruction sets (prompts) for AI models. It provides a structured yet flexible workspace to transform raw ideas into precisely engineered prompts for a wide range of applications, from software development to creative writing.

## Core Modules

The application is organized into distinct "Forges," each tailored to a specific domain:

1.  **Instruction Set Forge**: The primary module for general-purpose prompt engineering. It's split into two categories:
    *   **Project & Technical**: For creating detailed software development plans, technical briefs, and innovation proposals.
    *   **Creative & Writing**: For crafting prompts for stories, songs, video scripts, and other creative endeavors.

2.  **WorldBuilder Forge**: A specialized environment for authors, game designers, and hobbyists to create rich, detailed fictional worlds. It includes blueprints for designing worlds, characters, and unique skill/magic systems.

3.  **Game Development Forge**: A dedicated space for game designers to flesh out their ideas. It provides structured templates for game concepts, character designs, level layouts, and quest narratives.

4.  **Project Library**: A central hub where all created projects are saved. Users can view, load, rename, delete, and import/export their work.

## Key Features

-   **Blueprint-Based Forms**: Each forge uses dynamic forms (blueprints) with predefined fields to guide the user in providing structured, relevant information.
-   **AI-Powered Inspiration ("Inspire Me")**: Users can ask the AI to generate a complete, cohesive idea based on their initial input, filling out the entire blueprint.
-   **The Forge (Iterative Refinement)**: The core of the application. An editor where the initial prompt is generated. Users can then provide refinement instructions (e.g., "make it more detailed," "add a database requirement") and use the "Forge" button to have the AI rewrite and improve the prompt.
-   **Multiple Output Formats**: Prompts can be generated and viewed as plain text, JSON, or Markdown.
-   **Persistent Storage**: Projects are saved locally in the browser using **IndexedDB**, ensuring data persistence and robust storage capacity.
-   **Project History & Versioning**: The application automatically saves a snapshot of the prompt every time it is "forged." Users can view this history, restore previous versions, or delete old entries.
-   **Import/Export Functionality**: Users can export their entire project (including form data, the final prompt, and its history) as a `.json` file and import projects to continue their work or share them. `.txt` files can also be imported directly into the forge.
