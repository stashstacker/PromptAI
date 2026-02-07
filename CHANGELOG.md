# Changelog

All notable changes to this application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **"Inspire Me" AI Creativity**: Corrected a flawed implementation where over-aggressive token limits (`maxOutputTokens`) and negative prompting (`FAILURE_AVOIDANCE` rule) were causing the AI to produce low-quality, overly concise outputs. The token limits have been significantly increased and the restrictive prompts removed to restore the AI's creative freedom.

### Removed
- **Redundant Documentation**: Permanently deleted `MASTERPROMPT.md` and `RANDOM_NOTES.md` from the codebase to streamline documentation and rely solely on the `README.md` and `CONTRIBUTING_GUIDELINES.md` as the source of truth.

### Added
- **Refinement Parameters Toggle**: Added an on/off switch to the "Temper & Refine" panel. When disabled, the parameter sliders are deactivated, and the AI performs a refinement based solely on the user's text input. This allows for more direct, unparameterized edits.

### Changed
- **Collaborative "Inspire Me"**: The "Inspire Me" AI has been enhanced to act as a more collaborative partner. Instead of strictly preserving user-filled fields, it can now subtly improve or rephrase the user's input for clarity and impact, while always maintaining the original core meaning. This allows the AI to help refine initial ideas, not just fill in the blanks.
- **Decoupled Refinement Engine**: Rearchitected the AI logic to strictly enforce the `Raw Materials -> Forge -> Refine` workflow. The "Temper & Refine" engine now uses a dedicated "Editor" persona that is completely independent of the initial creation prompt. This ensures the AI's refinement actions are based solely on the text in the Forge, not the original form data, leading to more accurate and contextually appropriate edits.
- **Improved Refinement Controls**: Renamed the "Constraint Adherence" slider to "Rule Strictness" for better clarity. Updated its tooltip and labels to explain that lower strictness allows for more creative flexibility (preventing failures from overly rigid rules), while higher strictness ensures precise adherence to instructions.

### Removed
- **Redundant Documentation**: Removed outdated and redundant `MASTERPROMPT.md` and `RANDOM_NOTES.md` files to streamline the project repository and rely on the `README.md` and codebase as the primary sources of truth.

### Fixed
- **JSON Parsing Error in "Inspire Me"**: Resolved a recurring issue where the "Inspire Me" feature would fail due to truncated JSON responses from the AI being overly verbose. The fix includes stricter prompt instructions for conciseness and reduced API token limits to enforce brevity.

### Changed
- **Enhanced Final Deliverable Instructions**: Overhauled the final deliverable instructions for "Project & Technical" blueprints based on user feedback. The new prompt now includes a dedicated "Quality Standards" section, mandating well-commented code, error handling, and detailed setup instructions. The `Readme.md` requirement was also enhanced to include a rationale for the tech stack and setup instructions.

### Added
- **Granular Refinement Controls**: Replaced the "Vibe" and "Logic" engines in the "Temper & Refine" panel with four distinct control sliders: Creativity, Formality, Verbosity, and Constraint Adherence. This provides users with much finer-grained, explicit control over the AI's rewriting process.
- **"Inspire Me" Context Toggle**: Added a toggle button that allows the "Inspire Me" feature to either use existing form content as context or ignore it to generate a completely new concept.

### Changed
- **UI Clarity**: Renamed the "Forge" action to "Refine" in the "Temper & Refine" panel to more accurately describe the iterative improvement process. The associated checkbox for using analysis feedback was also updated.

### Changed
- **Comprehensive UI/UX Overhaul**: Conducted a full-codebase audit to improve user interface and experience.
  - **Enhanced Visuals**: Centralized all SVG icons into a single `components/icons.tsx` module for consistency and maintainability, replacing inline SVGs throughout the application.
  - **Improved Layouts**: Refined component layouts on all pages, especially the Project Library and History Panel, for better spacing, readability, and a more modern aesthetic.
  - **Polished Interactivity**: Implemented a visual drag-and-drop overlay for file imports on the Projects page. Added a temporary highlight effect when restoring a history entry to provide clear visual feedback.
  - **Better Feedback**: Replaced generic loading spinners with more descriptive text (e.g., "Forging...", "Analyzing...") to better manage user expectations during API calls.

### Removed
- **Redundant Documentation**: Removed outdated and redundant `MASTERPROMPT.md` and `RANDOM_NOTES.md` files to streamline the project repository and rely on the `README.md` and codebase as the primary sources of truth.
- **Portable HTML Version**: Removed the standalone `masterprompt.html` file as it was a non-standard, parallel version of the application.
- **Auth Context**: Removed the unused and broken `AuthContext` related to the deprecated Google Drive integration.

### Fixed
- **Project Context**: Corrected an inconsistency in `ProjectContext` where the state setter was being aliased, improving code clarity.
- **JSON Parsing Error in "Inspire Me"**: Resolved a recurring issue where the "Inspire Me" feature would fail due to truncated JSON responses from the AI being overly verbose. The fix includes stricter prompt instructions for conciseness and reduced API token limits to enforce brevity.

### Added
- **Context-Aware "Inspire Me"**: The "Inspire Me" feature is now more collaborative. It treats any user-filled fields as primary constraints, generating ideas for the remaining empty fields that are highly relevant to the user's initial input.
- **AI-Powered Prompt Analysis**: Added a new "Analyze Prompt" feature in the "Temper & Refine" panel. This tool uses an AI model to provide real-time feedback on the current prompt's clarity, conciseness, and best practices. It includes a "Prompt Quality Score" and specific suggestions for improvement.

### Changed
- **Extensive AI Prompt Overhaul**: Conducted a complete analysis and rewrite of all AI prompts to eliminate "meta-confusion" and improve output reliability.
  - Replaced all markdown-based prompt structures with a robust, XML-based tagging system (e.g., `<persona>`, `<task_instructions>`, `<user_input>`). This creates unambiguous boundaries for the AI.
  - Heavily reinforced the meta-instructions for the "FINAL DELIVERABLE" section with keywords like "CRITICAL" and "VERBATIM" to ensure the AI copies the instructions perfectly.
  - Enhanced the "Temper & Refine" engine prompts to be more direct and technical, resulting in more predictable and powerful refinements.

### Added
- **Cloud Sync Simulation**: Integrated a mock backend service using localStorage to simulate cloud project storage. This enables cross-device synchronization and a backup mechanism for logged-in users.
- **User Authentication UI**: Added a mock login/logout flow to demonstrate how cloud features would be gated.
- **Project Sync Status**: The Project Library now displays the sync status (Local, Syncing, Synced, Error) for each project.
- **Developer Analysis Report**: Added an "Analyze Application" button on the Getting Started page. This developer-focused feature uses AI to generate a comprehensive analysis of the application's architecture, scalability, and potential enhancements based on a detailed project summary.

### Refactored
- **Codebase Audit & Refactoring**:
  - **Icon Management**: Created a centralized `components/icons.tsx` file to manage all application icons as reusable React components, improving maintainability.
  - **Component Separation**: Extracted the "Development Analysis Report" feature from `GettingStartedPage.tsx` into its own dedicated `components/DevAnalysisReport.tsx` component to improve separation of concerns.
  - **File Structure**: Organized panel components into the `components/panels` directory for better structural consistency.
  - **Error Handling**: Improved error handling in `geminiService.ts` to parse API errors and provide more specific, user-friendly feedback for common issues like invalid API keys or server errors.
- **Major Architectural Refactor**: Performed a comprehensive codebase refactor to improve modularity, maintainability, and separation of concerns based on a full code audit.
  - Deconstructed the monolithic `ForgeUI` component into smaller, focused panel components (`RawMaterialsPanel`, `ForgePanel`, `TemperAndRefinePanel`, `HistoryManager`).
  - Abstracted business logic out of UI components into dedicated services (`promptBuilder.ts` for prompt construction, `projectService.ts` for import/export).
  - Implemented React Context (`ProjectContext`) to eliminate prop drilling of project state.
  - Encapsulated reusable state logic into custom hooks (`useToast`, `useProjectHistory`).

### Added
- **Specialized Frontend Blueprints**: Added three new blueprints to the "Project & Technical" category: "SaaS Platform Frontend", "E-commerce Storefront", and "Game UI Development" to provide more focused starting points for frontend developers.
- **Token Counter**: Added an estimated token counter for the main prompt output in "The Forge" section, updating in real-time.
- **Refinement Engines**: Replaced the refinement option checkboxes with a new "Vibe Engine" and "Logic Engine" system. The "Vibe Engine" constructs prompts using natural, human-like language, while the "Logic Engine" constructs prompts as direct, structured instruction sets suitable for AI-to-AI communication. Includes a 5-level intensity slider.
- **Getting Started Page**: Introduced a new "Getting Started" page as the initial view to provide users with an overview of the application's core workflow and features.
- **Video Script Pacing**: Added 'Estimate Scene Durations' and 'Adjust for Video Lengths' refinement options to the Video Script blueprint.
- **Mode-Specific Refinements**: Replaced generic refinement options with context-aware suggestions tailored to each specific blueprint (e.g., 'Specify Tech Stack' for Software Dev, 'Intensify Conflict' for Creative Writing).
- **Refinement Options**: Added a 'Refinement Options' section with checkboxes for common actions like 'Add constraints' and 'Improve clarity', allowing for more targeted AI-powered prompt refinement.
- **Project README**: Created a comprehensive `README.md` file. This document serves as a persistent source of project context, outlining the application's purpose, core modules, and key features, enabling the AI to re-establish context at the start of each session.

### Changed
- **Game Concept Blueprint**: Enhanced the 'Flesh out Core Loop' refinement option to prompt for a more detailed breakdown, including player input, system feedback, and immediate goals for each step of the gameplay loop.
- **Video Script Blueprint**: Enhanced the 'Estimate Scene Durations' refinement to be more detailed, considering speaking rates and visual complexity. Also improved the 'Visuals & B-Roll' field to prompt for specific shot types and camera movements.
- **Software Dev Persona Enhancement**: Upgraded the AI persona for the 'Software Development' blueprint to a senior software architect and project manager. Both the 'Inspire Me' and 'Forge' functions now produce more professional outputs that incorporate considerations for scalability, maintainability, and deployment.
- **AI Prompt Tuning**: Refined the 'Inspire Me' AI personas and instructions across all blueprint categories to encourage more detailed, coherent, and higher-quality initial outputs.
- **List Field UX**: Enhanced 'list' type fields in the Forge with drag-and-drop reordering for list items, improving usability and workflow.
- **Contributor Guidelines**: Updated `CONTRIBUTING_GUIDELINES.md` to include a new mandatory rule. The AI must now read the `README.md` file at the beginning of every interaction to ensure all development work is context-aware.

## [1.4.0] - 2024-10-30

### Added
- **Contributor Guidelines**: Added a `CONTRIBUTING_GUIDELINES.md` file to establish and enforce core development rules, such as the mandatory updating of this changelog for all feature changes.

## [1.3.0] - 2024-10-29

### Changed
- **Enhanced Final Deliverable for Projects**: The "Project & Technical" blueprints now generate a much more powerful final deliverable instruction. The AI is now tasked with producing two distinct outputs:
    1. A comprehensive `Readme.md` file, including a chain-of-thought analysis and a full software development plan.
    2. The complete, functional application code with a strict requirement to avoid using mock data.

## [1.2.0] - 2024-10-28

### Added
- **Project History Panel**: In the Forge, a new collapsible "Project History" panel now automatically tracks the evolution of your prompt. A new version is saved every time you click "Forge," allowing you to view, restore, or delete previous versions. This history is saved and loaded with your exported projects.

## [1.1.0] - 2024-10-27

### Added
- **IndexedDB Storage**: Upgraded project storage from `localStorage` to `IndexedDB` for a more robust and scalable project library. This provides larger storage capacity and better performance.

### Changed
- Asynchronous save operations to accommodate IndexedDB.

## [1.0.0] - 2024-10-26

### Added
- Initial release of **Prompt Forge AI**.
- **Instruction Set Forge**: Core module for creating prompts for software development, innovation, creative writing, songwriting, and video scripts.
- **WorldBuilder Forge**: Dedicated module for creating worlds, characters, and skill systems.
- **Game Development Forge**: Dedicated module for designing game concepts, characters, levels, and quests.
- **AI Assistance**: "Inspire Me" to generate ideas and "Forge" to refine prompts using the Gemini API.
- **Project Library**: Save, load, rename, and delete projects using `localStorage`.
- **Import/Export Functionality**: Users can export their entire project (including form data, the final prompt, and its history) as a `.json` file and import projects to continue their work or share them. `.txt` files can also be imported directly into the forge.