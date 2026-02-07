import { BlueprintCollection } from './types';

export const UNIVERSAL_INSPIRE_PROMPT = `<system_instruction>
    <persona>
        You are "Spark Generator," a specialized AI ideation expert. Your entire purpose is to transform a user's fragmented idea into a complete, compelling, and concise concept draft. You are not an assistant; you are a catalyst for creativity.
        Think!, you are not looking for the most obvious suggestions...you are looking to innovate!
    </persona>
    <core_task>
        Your primary directive is to analyze the user's partial JSON input (\`user_context\`) and aggressively fill all empty or placeholder fields. The final output must be a single, valid JSON object that strictly adheres to the structure of \`output_schema\`.
    </core_task>
</system_instruction>

<behavior_rules>
    <rule id="ENHANCE_USER_INPUT">
        CRITICAL: Any field in \`user_context\` that already contains a value is the user's core idea and primary anchor. You MUST use it as the main contextual guide.
        -   You are encouraged to subtly enhance or professionally rephrase the user's input to improve its clarity, impact, and style.
        -   You MUST NOT change the core meaning, intent, or essential information of the user's original text.
        -   Your goal is to **elevate their input**, making it stronger, while building the rest of the concept around it.
    </rule>
    <rule id="GENERATE_HIGH_IMPACT_CONTENT">
        For any empty field ("" or []), generate content that is:
        1.  **Imaginative & Bold:** Propose interesting, non-obvious ideas.
        2.  **Concise & Punchy:** Every word matters. No filler.
        3.  **Context-Aware:** All generated fields must be thematically and logically consistent with each other and with the user's existing input.
    </rule>
    <rule id="STRICT_BREVITY_PROTOCOL">
        -   'input' fields: A short phrase or a single, powerful sentence. MAX 15 words.
        -   'textarea' fields: Be direct and focus on the core concept, typically in 2-4 impactful sentences. Avoid unnecessary elaboration or descriptive filler.
        -   'list' fields: 5-15 distinct, high-impact items. No fluff.
    </rule>
    <rule id="NEGATIVE_CONSTRAINTS">
        -   ABSOLUTELY NO placeholder text (e.g., "[Insert detail here]", "TBD").
        -   DO NOT explain your reasoning or provide commentary.
        -   DO NOT use markdown or any text outside of the final JSON object.
        -   **CRITICAL: DO NOT use repetitive phrases or verbose filler text. Every sentence must introduce a new, distinct piece of information. Failure to be concise will result in an invalid output.**
    </rule>
    <rule id="OUTPUT_FORMAT">
        Your entire response MUST be a single, valid JSON object matching \`output_schema\`. Nothing else.
    </rule>
</behavior_rules>
`;

export const UNIVERSAL_REFINE_PROMPT = `<system_instruction>
    <persona>
        You are "The Editor," a master-level AI specializing in iterative text refinement. Your sole purpose is to rewrite a given draft based on a set of precise instructions and parameters. You are not the original author; you are a critical, expert polisher.
    </persona>
    <core_task>
        Your primary directive is to meticulously analyze the provided <draft> and rewrite it to incorporate the user's specific <user_refinement_focus> and a <core_directive> that outlines general parameters for the rewrite.
    </core_task>
</system_instruction>

<behavior_rules>
    <rule id="PRESERVE_INTENT">
        CRITICAL: The core intent, meaning, and essential information of the original <draft> must be preserved unless the user's instructions explicitly demand a change. Your job is to improve the draft, not replace it with something entirely different.
    </rule>
    <rule id="FOLLOW_DIRECTIVES">
        You must adhere strictly to the parameters defined in the <core_directive> (Creativity, Formality, Verbosity, Constraint Adherence) and the specific focus provided in <user_refinement_focus>.
    </rule>
    <rule id="FORMAT_CONSISTENCY">
        The rewritten output MUST match the original format of the <draft> (e.g., text, JSON, Markdown, XML) unless the user's instructions specify a format change.
    </rule>
    <rule id="NEGATIVE_CONSTRAINTS">
        - DO NOT add commentary, explanations, or conversational text.
        - DO NOT reference the "raw materials" or the initial creation process. Your context begins and ends with the provided draft and the refinement instructions.
        - DO NOT output anything other than the single, complete, rewritten document.
    </rule>
</behavior_rules>
`;


export const projectForgeBlueprints: BlueprintCollection = {
    softwareDev: {
        title: 'Software Development',
        fields: [
            { id: 'title', label: 'Title', type: 'input', placeholder: 'e.g., My Awesome App' },
            { id: 'core-task', label: 'Core Task / Goal', type: 'input', placeholder: 'e.g., A modern landing page for a SaaS product' },
            { id: 'ai-persona', label: 'AI Persona / Role', type: 'input', placeholder: 'e.g., A world-class front-end developer' },
            { id: 'features', label: 'Key User Features', type: 'list', placeholder: 'e.g., A responsive navigation bar' },
            { id: 'visual-style', label: 'Visual Style / Aesthetics', type: 'textarea', placeholder: 'e.g., Clean, minimalist, dark theme...' },
            { id: 'constraints', label: 'Constraints & Rules', type: 'textarea', placeholder: 'e.g., Must use Tailwind CSS...' },
            { id: 'mvp-focus', label: 'MVP Focus & Prioritization', type: 'textarea', placeholder: 'e.g., The core feature is the responsive hero section. Pricing and footer can be Phase 2.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
          "title": "AeroPage Pro",
          "core-task": "A modern, animated landing page for a cutting-edge SaaS product.",
          "ai-persona": "A world-class senior frontend developer specializing in React and Framer Motion.",
          "features": [
            "A responsive navigation bar with a subtle blur effect",
            "A hero section with a captivating headline and a call-to-action button",
            "A feature section with animated icons and descriptions",
            "A pricing table with a toggle for monthly/annual plans",
            "A simple and clean footer with social media links"
          ],
          "visual-style": "Clean, minimalist, and modern dark theme. Generous use of white space and a vibrant accent color. Typography is crisp and readable, using a sans-serif font.",
          "constraints": "Must use React with TypeScript and Tailwind CSS for styling. All animations should be smooth and performant. The final code must be a single component.",
          "mvp-focus": "The MVP must deliver the hero section and the navigation bar. The features and pricing sections can be added in a later phase."
        },
        forgePrompt: `<persona>
  <role>Expert AI Assistant, Senior Software Architect, and Project Manager</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable technical specifications. Employ a chain-of-thought process to analyze the user's request before generating a response. All outputs must be detailed and ready for a development team to execute. Your response must be professional, clear, and concise. Avoid marketing jargon and overly florid prose. Prioritize actionable instructions. If the user provides an MVP focus, you MUST structure the features into a 'Development Roadmap' section in your output, clearly identifying what is in the MVP versus future phases.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## PROJECT TITLE ##',
            'ai-persona': '## ROLE & PERSONA ##',
            'core-task': '## PRIMARY GOAL ##',
            'features': '## KEY USER FEATURES ##',
            'visual-style': '## VISUAL STYLE & AESTHETICS ##',
            'constraints': '## CONSTRAINTS & REQUIREMENTS ##',
            'mvp-focus': '## MVP FOCUS & PRIORITIZATION ##'
        },
        refinementOptions: [
            { id: 'createRoadmap', label: 'Create a Phased Roadmap', prompt: 'Reorganize the features and project plan into a phased development roadmap. Clearly define an MVP, a Phase 2, and a "Future Considerations" list based on the project goals.' }
        ]
    },
    saasFrontend: {
        title: 'SaaS Platform Frontend',
        fields: [
            { id: 'title', label: 'SaaS Project Title', type: 'input', placeholder: 'e.g., Zenith Dashboard' },
            { id: 'core-concept', label: 'Core Concept & Goal', type: 'textarea', placeholder: 'e.g., An analytics dashboard for a project management tool, showing user engagement and task completion rates.' },
            { id: 'key-features', label: 'Key Features', type: 'list', placeholder: 'e.g., Interactive charts with date-range filters, Real-time data updates via WebSockets, Secure user authentication (JWT)' },
            { id: 'tech-stack', label: 'Proposed Tech Stack', type: 'input', placeholder: 'e.g., React with TypeScript, Tailwind CSS, Recharts/D3.js, Zustand for state management.' },
            { id: 'ui-ux-principles', label: 'UI/UX Principles', type: 'textarea', placeholder: 'e.g., Data-dense but intuitive interface. Clean typography. Responsive design for desktop and tablet. Prioritize clarity and speed.' },
            { id: 'apis-integrations', label: 'APIs & Integrations', type: 'list', placeholder: 'e.g., Internal REST API for user data, Stripe API for subscription status' },
            { id: 'mvp-focus', label: 'MVP Focus & Prioritization', type: 'textarea', placeholder: 'e.g., The core feature is real-time charting. User auth and report exports can be in Phase 2.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Insightify Metrics Dashboard",
            "core-concept": "A real-time analytics dashboard for e-commerce stores, providing insights on sales trends, user behavior, and inventory levels.",
            "key-features": [
              "Interactive sales chart with draggable date-range selection",
              "Live user activity feed showing recent purchases and sign-ups",
              "Secure authentication using JWT tokens",
              "Top-performing products list with key metrics",
              "Low-stock inventory alerts module",
              "Export reports to CSV functionality"
            ],
            "tech-stack": "React with TypeScript, Tailwind CSS, Recharts for charts, and Zustand for global state management.",
            "ui-ux-principles": "A data-dense interface that prioritizes clarity and speed. It uses a clean, card-based layout on a dark theme, with responsive design for desktop and tablet use.",
            "apis-integrations": [
              "Internal REST API for sales and product data",
              "Stripe API for checking subscription status",
              "Pusher/Ably for WebSocket-based real-time updates"
            ],
            "mvp-focus": "MVP is the interactive sales chart and the top-performing products list. User auth and the live feed are phase 2."
        },
        forgePrompt: `<persona>
  <role>Expert Frontend Architect specializing in scalable SaaS platforms</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable technical specifications. Employ a chain-of-thought process to analyze the user's request before generating a response. Your response must be professional, clear, and concise. Avoid marketing jargon and overly florid prose. Prioritize actionable instructions. If the user provides an MVP focus, you MUST structure the features into a 'Development Roadmap' section in your output, clearly identifying what is in the MVP versus future phases.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## SAAS PROJECT TITLE ##',
            'core-concept': '## CORE CONCEPT & GOAL ##',
            'key-features': '## KEY FEATURES ##',
            'tech-stack': '## PROPOSED TECH STACK ##',
            'ui-ux-principles': '## UI/UX PRINCIPLES ##',
            'apis-integrations': '## APIS & INTEGRATIONS ##',
            'mvp-focus': '## MVP FOCUS & PRIORITIZATION ##'
        },
        refinementOptions: [
            { id: 'createRoadmap', label: 'Create a Phased Roadmap', prompt: 'Reorganize the features and project plan into a phased development roadmap. Clearly define an MVP, a Phase 2, and a "Future Considerations" list based on the project goals.' }
        ]
    },
    ecommerceStorefront: {
        title: 'E-commerce Storefront',
        fields: [
            { id: 'title', label: 'E-commerce Store Name', type: 'input', placeholder: 'e.g., Artisan Goods Marketplace' },
            { id: 'product-type', label: 'Product Niche', type: 'input', placeholder: 'e.g., Handmade pottery and home decor' },
            { id: 'key-pages-flow', label: 'Key Pages & User Flow', type: 'list', placeholder: 'e.g., Homepage with featured products, Category/collection pages, Product detail page with image gallery & reviews, Smooth, multi-step checkout flow' },
            { id: 'brand-aesthetics', label: 'Brand Aesthetics & Visual Style', type: 'textarea', placeholder: 'e.g., Warm, earthy tones, minimalist layout, high-quality photography focus. Font pairing: a serif for headings, sans-serif for body.' },
            { id: 'tech-stack', label: 'Proposed Tech Stack', type: 'input', placeholder: 'e.g., Next.js for SSR/SSG, Tailwind CSS, Shopify Storefront API' },
            { id: 'performance-goals', label: 'Performance & Accessibility Goals', type: 'textarea', placeholder: 'e.g., Fast page loads (LCP under 2.5s), optimized for mobile conversions, accessible (WCAG AA).' },
            { id: 'mvp-focus', label: 'MVP Focus & Prioritization', type: 'textarea', placeholder: 'e.g., The MVP needs the product detail page and checkout flow. The homepage can be basic initially.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Terra Handmade Goods",
            "product-type": "Handmade, small-batch ceramics and artisanal home decor.",
            "key-pages-flow": [
              "Homepage with a large hero image of featured products",
              "Collection pages for different categories (e.g., Mugs, Vases)",
              "Product detail page with an image gallery and customer reviews",
              "A streamlined, single-page checkout process",
              "An 'About the Artisan' page with a short bio"
            ],
            "brand-aesthetics": "Warm, earthy color palette with terracotta and beige tones. The layout is minimalist and photography-focused, using a serif font for headings to convey elegance.",
            "tech-stack": "Next.js for server-side rendering, Tailwind CSS, and the Shopify Storefront API for product data.",
            "performance-goals": "Achieve a Lighthouse performance score of 95+. Ensure all pages are fully accessible (WCAG AA) and optimized for mobile conversions.",
            "mvp-focus": "MVP is a functional product detail page and a working checkout. A beautiful homepage and collection pages are fast follows in Phase 2."
        },
        forgePrompt: `<persona>
  <role>World-Class Frontend Engineer specializing in high-performance, conversion-focused e-commerce.</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable project plans. Employ a chain-of-thought process to analyze the user's request before generating a response. Your response must be professional, clear, and concise. Avoid marketing jargon and overly florid prose. Prioritize actionable instructions. If the user provides an MVP focus, you MUST structure the features into a 'Development Roadmap' section in your output, clearly identifying what is in the MVP versus future phases.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## E-COMMERCE STORE NAME ##',
            'product-type': '## PRODUCT NICHE ##',
            'key-pages-flow': '## KEY PAGES & USER FLOW ##',
            'brand-aesthetics': '## BRAND AESTHETICS & VISUAL STYLE ##',
            'tech-stack': '## PROPOSED TECH STACK ##',
            'performance-goals': '## PERFORMANCE & ACCESSIBILITY GOALS ##',
            'mvp-focus': '## MVP FOCUS & PRIORITIZATION ##'
        },
        refinementOptions: [
            { id: 'createRoadmap', label: 'Create a Phased Roadmap', prompt: 'Reorganize the features and project plan into a phased development roadmap. Clearly define an MVP, a Phase 2, and a "Future Considerations" list based on the project goals.' }
        ]
    },
    gameUIDevelopment: {
        title: 'Game UI Development',
        fields: [
            { id: 'title', label: 'Game UI Project', type: 'input', placeholder: 'e.g., Chrono Weavers - Main Menu & HUD' },
            { id: 'game-genre', label: 'Game Genre', type: 'input', placeholder: 'e.g., Sci-fi Tactical RPG' },
            { id: 'ui-components', label: 'UI Components & Screens', type: 'list', placeholder: 'e.g., Health/AP bars, Minimap with objective markers, Turn-based action bar, Inventory & character stats screen' },
            { id: 'art-style-direction', label: 'UI Art Style & Direction', type: 'textarea', placeholder: 'e.g., Diegetic holographic interface. Neon blue highlights on dark, semi-transparent panels. Sharp, angular shapes. Minimalist icons.' },
            { id: 'target-platform-controls', label: 'Target Platform & Controls', type: 'input', placeholder: 'e.g., PC (mouse/keyboard) and Console (gamepad)' },
            { id: 'technical-constraints', label: 'Technical Constraints', type: 'textarea', placeholder: 'e.g., Must be implemented in Unity\'s UI Toolkit. All assets must be in a single texture atlas to reduce draw calls. Must be performant to avoid frame drops.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Project Cyberscape - HUD & Inventory",
            "game-genre": "Cyberpunk Action RPG",
            "ui-components": [
              "Player health and energy bars (diegetic, on character's wrist)",
              "A dynamic, holographic minimap with objective markers",
              "A quick-access weapon wheel for combat",
              "A grid-based inventory screen with item stats",
              "A character screen for skill trees and cybernetic upgrades"
            ],
            "art-style-direction": "A diegetic holographic UI with neon magenta highlights on dark, glitchy panels. Icons are minimalist and angular. Fonts are futuristic and slightly distorted.",
            "target-platform-controls": "PC (mouse/keyboard) with full gamepad support for consoles.",
            "technical-constraints": "Must be implemented using Unity's UI Toolkit. All UI assets must be batched into a single texture atlas to minimize draw calls and ensure high performance."
        },
        forgePrompt: `<persona>
  <role>Expert Technical UI/UX Designer for Video Games</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable technical and artistic specifications. Employ a chain-of-thought process to analyze the user's request before generating a response. Your response must be professional, clear, and concise. Avoid marketing jargon and overly florid prose. Prioritize actionable instructions.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## GAME UI PROJECT ##',
            'game-genre': '## GAME GENRE ##',
            'ui-components': '## UI COMPONENTS & SCREENS ##',
            'art-style-direction': '## UI ART STYLE & DIRECTION ##',
            'target-platform-controls': '## TARGET PLATFORM & CONTROLS ##',
            'technical-constraints': '## TECHNICAL CONSTRAINTS ##'
        }
    },
    innovation: {
        title: 'Innovation & Ideation',
        fields: [
            { id: 'title', label: 'Title', type: 'input', placeholder: 'e.g., Project Neo: AI-Powered Personal Assistant' },
            { id: 'problem-statement', label: 'Problem Statement', type: 'textarea', placeholder: 'e.g., Busy professionals struggle to manage their daily schedules...' },
            { id: 'target-audience', label: 'Target Audience / User', type: 'input', placeholder: 'e.g., Young professionals, entrepreneurs, and students.' },
            { id: 'core-insight', label: 'Core Insight / Opportunity', type: 'textarea', placeholder: 'e.g., Current calendar apps are good at scheduling, but poor at prioritizing...' },
            { id: 'brainstormed-solutions', label: 'Brainstormed Solutions', type: 'list', placeholder: 'e.g., A smart calendar that auto-reschedules tasks...' },
            { id: 'success-metrics', label: 'Desired Outcome / Success Metrics', type: 'textarea', placeholder: 'e.g., Reduce the time users spend on manual scheduling by 50%.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Project FocusFlow: AI-Powered Task Prioritizer",
            "problem-statement": "Busy professionals are overwhelmed by long to-do lists and struggle to focus on what's most important, leading to burnout and missed deadlines.",
            "target-audience": "Knowledge workers, freelancers, and students in high-demand fields.",
            "core-insight": "Standard to-do apps are passive lists. An active system that intelligently suggests the next most impactful task could significantly boost productivity.",
            "brainstormed-solutions": [
              "An AI that analyzes task descriptions and deadlines to rank priorities",
              "A 'focus mode' that hides all tasks except the top one",
              "Integration with calendars to block out 'deep work' time",
              "Automated daily reports on what was accomplished",
              "Gamification elements like 'streaks' for completing priority tasks"
            ],
            "success-metrics": "Increase the daily completion rate of high-priority tasks by 30% for active users within the first month. Reduce user-reported feelings of 'overwhelm' in weekly surveys."
        },
        forgePrompt: `<persona>
  <role>Expert Innovation Consultant and Product Strategist AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable product briefs. Employ a chain-of-thought process to analyze the user's request before generating a response. Your response must be professional, clear, and concise. Avoid marketing jargon and overly florid prose. Prioritize actionable instructions.
  </core_function>
</persona>`,
         initialPromptHeaders: {
            'title': '## INNOVATION TITLE ##',
            'problem-statement': '## PROBLEM STATEMENT ##',
            'target-audience': '## TARGET AUDIENCE ##',
            'core-insight': '## CORE INSIGHT / OPPORTUNITY ##',
            'brainstormed-solutions': '## BRAINSTORMED SOLUTIONS ##',
            'success-metrics': '## SUCCESS METRICS ##'
        }
    }
};

export const creativeForgeBlueprints: BlueprintCollection = {
    creativeWriting: {
        title: 'Creative Writing',
        fields: [
            { id: 'title', label: 'Title', type: 'input', placeholder: 'e.g., The Martian Detective' },
            { id: 'genre-tone', label: 'Genre & Tone', type: 'input', placeholder: 'e.g., Science Fiction, Noir, Humorous' },
            { id: 'plot-idea', label: 'Core Plot Idea', type: 'textarea', placeholder: 'e.g., A detective on Mars investigates a missing robot...' },
            { id: 'main-characters', label: 'Main Characters', type: 'list', placeholder: 'e.g., Jax, a grizzled detective...' },
            { id: 'key-scenes', label: 'Key Scenes / Beats', type: 'list', placeholder: 'e.g., The discovery of the crime scene...' },
            { id: 'style-constraints', label: 'Writing Style & Constraints', type: 'textarea', placeholder: 'e.g., Write in the first-person. Keep it under 1,500 words.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "The Last Signal from Titan",
            "genre-tone": "Science Fiction, Mystery, Tense",
            "plot-idea": "A lone communications officer on a remote Saturn moon base receives a cryptic, corrupted signal from a long-lost exploratory ship, just before her own base goes dark.",
            "main-characters": [
              "Dr. Aris Thorne, the brilliant but isolated comms officer",
              "The ghost-like voice in the static, a remnant of the lost ship's AI",
              "Commander Eva Rostova, Aris's skeptical superior on the main station"
            ],
            "key-scenes": [
              "The initial discovery of the impossible signal",
              "A desperate attempt to restore power to the base",
              "A flashback to the launch of the lost ship",
              "The final, chilling realization of what the signal means"
            ],
            "style-constraints": "Write in the third-person limited perspective, focusing on Aris's growing paranoia. Emphasize sound design and the oppressive silence of space."
        },
        forgePrompt: `<persona>
  <role>Expert Story Editor and Writing Coach AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable story outlines. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
         initialPromptHeaders: {
            'title': '## STORY TITLE ##',
            'genre-tone': '## GENRE & TONE ##',
            'plot-idea': '## CORE PLOT ##',
            'main-characters': '## MAIN CHARACTERS ##',
            'key-scenes': '## KEY SCENES / BEATS ##',
            'style-constraints': '## WRITING STYLE & CONSTRAINTS ##'
        }
    },
    songwriting: {
        title: 'Songwriting',
        fields: [
            { id: 'title', label: 'Title', type: 'input', placeholder: 'e.g., Fading Photograph' },
            { id: 'genre-mood', label: 'Genre & Mood', type: 'input', placeholder: 'e.g., Acoustic Folk, Melancholy, Hopeful' },
            { id: 'theme-concept', label: 'Theme / Lyrical Concept', type: 'textarea', placeholder: 'e.g., Remembering a past relationship fondly...' },
            { id: 'song-structure', label: 'Song Structure', type: 'input', placeholder: 'e.g., Verse - Chorus - Verse...' },
            { id: 'key-elements', label: 'Key Lyrical Elements / Imagery', type: 'list', placeholder: 'e.g., Rainy Sunday morning...' },
            { id: 'style-constraints', label: 'Musical Style & Constraints', type: 'textarea', placeholder: 'e.g., Simple acoustic guitar, slow tempo...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Cobblestone Heart",
            "genre-mood": "Indie Folk, Wistful, Reflective",
            "theme-concept": "The feeling of returning to your hometown after years away and realizing both you and the town have changed in subtle, irreversible ways.",
            "song-structure": "Verse 1 - Chorus - Verse 2 - Chorus - Bridge - Chorus - Outro",
            "key-elements": [
              "The smell of rain on old pavement",
              "A familiar cafe with a new name",
              "Seeing old friends who feel like strangers",
              "The sound of a distant train",
              "A faded mural on a brick wall"
            ],
            "style-constraints": "A slow, fingerpicked acoustic guitar melody with a simple bass line. Features a haunting, distant harmony in the chorus. The tempo should be around 70 BPM."
        },
        forgePrompt: `<persona>
  <role>Expert Songwriter and Lyricist AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable song concepts. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
         initialPromptHeaders: {
            'title': '## SONG TITLE ##',
            'genre-mood': '## GENRE & MOOD ##',
            'theme-concept': '## THEME & CONCEPT ##',
            'song-structure': '## SONG STRUCTURE ##',
            'key-elements': '## KEY LYRICAL ELEMENTS & IMAGERY ##',
            'style-constraints': '## MUSICAL STYLE & CONSTRAINTS ##'
        }
    },
    videoScript: {
        title: 'Video Script',
        fields: [
            { id: 'title', label: 'Title', type: 'input', placeholder: 'e.g., How to Bake the Perfect Sourdough' },
            { id: 'format-tone', label: 'Video Format & Tone', type: 'input', placeholder: 'e.g., Tutorial, friendly and encouraging' },
            { id: 'target-audience', label: 'Target Audience', type: 'input', placeholder: 'e.g., Beginner bakers' },
            { id: 'script-segments', label: 'Script Structure / Segments', type: 'list', placeholder: 'e.g., Introduction/Hook, Ingredients...' },
            { id: 'talking-points', label: 'Key Talking Points', type: 'list', placeholder: 'e.g., Explain the "stretch and fold" technique' },
            { id: 'visuals-broll', label: 'Visuals, B-Roll & Shot Types', type: 'textarea', placeholder: 'e.g., Close-up on hands kneading dough, wide shot of the kitchen, drone shot of a wheat field, slow-motion shot of flour dusting a surface.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "5 Pro-Level Camera Tricks Anyone Can Do With a Smartphone",
            "format-tone": "Quick-paced tutorial, energetic and inspiring tone.",
            "target-audience": "Aspiring content creators and casual social media users.",
            "script-segments": [
              "Dynamic hook with quick cuts of final results",
              "Trick 1: The 'Fake Drone' Shot",
              "Trick 2: The 'Seamless Wipe' Transition",
              "Trick 3: The 'Slow-Mo Reveal'",
              "Trick 4: The 'Perspective Shift'",
              "Trick 5: The 'Cinematic Low Angle'",
              "Quick recap and a strong call-to-action"
            ],
            "talking-points": [
              "You don't need expensive gear",
              "Focus on steady hands and good lighting",
              "Use the grid lines for better composition",
              "Explain how each trick works in simple terms"
            ],
            "visuals-broll": "Show behind-the-scenes footage of how each shot is filmed, followed by the impressive final result. Use on-screen text overlays to highlight key steps. B-roll includes shots of different smartphones and outdoor scenery."
        },
        forgePrompt: `<persona>
  <role>Expert Scriptwriter and Video Producer AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable video scripts. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
         initialPromptHeaders: {
            'title': '## VIDEO TITLE ##',
            'format-tone': '## FORMAT & TONE ##',
            'target-audience': '## TARGET AUDIENCE ##',
            'script-segments': '## SCRIPT SEGMENTS ##',
            'talking-points': '## KEY TALKING POINTS ##',
            'visuals-broll': '## VISUALS & B-ROLL ##'
        },
        refinementOptions: [
            { id: 'sharpenHook', label: 'Sharpen the Hook', prompt: 'Rewrite the first 15 seconds of the script to be more engaging and immediately grab the viewer\'s attention.' },
            { id: 'visualCues', label: 'Add Visual Cues', prompt: 'For each talking point, add specific suggestions for on-screen text, graphics, or B-roll shots to enhance visual interest.'},
            { id: 'callToAction', label: 'Refine Call-to-Action', prompt: 'Strengthen the call-to-action at the end of the script. Make it clearer and more compelling.' },
            { id: 'improvePacing', label: 'Improve Pacing', prompt: 'Read through the script segments and identify any that feel too slow or too rushed. Suggest edits to improve the overall flow.'}
        ]
    }
};

export const worldBuilderBlueprints: BlueprintCollection = {
    world: {
        title: 'World / Planet',
        fields: [
            { id: 'title', label: 'World Name', type: 'input', placeholder: 'e.g., Aerthos' },
            { id: 'genre-setting', label: 'Genre & Setting', type: 'input', placeholder: 'e.g., High Fantasy, Floating Islands' },
            { id: 'core-concept', label: 'Core Concept / Hook', type: 'textarea', placeholder: 'e.g., A world where magic is a finite, dwindling resource...' },
            { id: 'key-factions', label: 'Key Factions & Cultures', type: 'list', placeholder: 'e.g., The Arcane Imperium' },
            { id: 'significant-locations', label: 'Significant Locations', type: 'list', placeholder: 'e.g., The Crystal Spire' },
            { id: 'history-lore', label: 'History & Lore', type: 'textarea', placeholder: 'e.g., The world was shattered by a magical cataclysm...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Veridia",
            "genre-setting": "Shattered World, High Fantasy",
            "core-concept": "A world of floating islands held aloft by ancient crystals. The crystals are slowly losing their power, causing the islands to begin drifting and sinking.",
            "key-factions": [
              "The Sky-Sailors Guild, who control trade between islands",
              "The Crystal-Keepers, a monastic order that tends to the crystals",
              "The Grounded, descendants of those who fell, living on the dark world below",
              "The Wind-Barons, pirates who prey on the sky-lanes"
            ],
            "significant-locations": [
              "The Grand Nexus, the largest and highest island",
              "The Crystal Spires, where the most powerful crystals are housed",
              "The Debris Field, a dangerous area of fallen island fragments",
              "The Sunken City, a ruin on the surface world"
            ],
            "history-lore": "A magical cataclysm known as 'The Great Shattering' broke the continents apart thousands of years ago. Only the powerful magic of the Aethel-crystals saved chunks of the land from falling into the abyss."
        },
        forgePrompt: `<persona>
  <role>Expert World-Builder and Lore Master AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and richly detailed world documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## WORLD NAME ##',
            'genre-setting': '## GENRE & SETTING ##',
            'core-concept': '## CORE CONCEPT ##',
            'key-factions': '## KEY FACTIONS & CULTURES ##',
            'significant-locations': '## SIGNIFICANT LOCATIONS ##',
            'history-lore': '## HISTORY & LORE ##'
        }
    },
    character: {
        title: 'Character',
        fields: [
            { id: 'name', label: 'Character Name', type: 'input', placeholder: 'e.g., Kaelen Vance' },
            { id: 'archetype', label: 'Archetype / Role', type: 'input', placeholder: 'e.g., Reluctant Hero, Grizzled Mentor' },
            { id: 'background', label: 'Background / Backstory', type: 'textarea', placeholder: 'e.g., A former royal guard exiled after a failed coup...' },
            { id: 'motivations', label: 'Motivations / Goals', type: 'list', placeholder: 'e.g., To clear their name, to protect their family...' },
            { id: 'flaws', label: 'Flaws / Weaknesses', type: 'list', placeholder: 'e.g., Overly trusting, afraid of heights...' },
            { id: 'appearance', label: 'Appearance & Mannerisms', type: 'textarea', placeholder: 'e.g., Tall, with a jagged scar over one eye...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "name": "Lyra 'The Wren' Solstice",
            "archetype": "Cynical Thief with a Hidden Heart",
            "background": "An orphan raised by a thieves' guild in the smog-filled capital city. She learned early that trust is a luxury she can't afford.",
            "motivations": [
              "To earn enough money to disappear completely",
              "To find the truth about her parents' disappearance",
              "To protect the few people she secretly cares about"
            ],
            "flaws": [
              "Quick to assume the worst in people",
              "A crippling fear of open water",
              "A weakness for antique clockwork devices"
            ],
            "appearance": "Slight of build with sharp, watchful eyes and dark hair usually tucked under a hood. She moves with a quiet confidence and has a habit of tapping her fingers when impatient."
        },
        forgePrompt: `<persona>
  <role>Expert Character Writer and Developer AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and richly detailed character sheets. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'name': '## CHARACTER NAME ##',
            'archetype': '## ARCHETYPE / ROLE ##',
            'background': '## BACKGROUND ##',
            'motivations': '## MOTIVATIONS & GOALS ##',
            'flaws': '## FLAWS & WEAKNESSES ##',
            'appearance': '## APPEARANCE & MANNERISMS ##'
        }
    },
    skillSystem: {
        title: 'Skill System',
        fields: [
            { id: 'title', label: 'System Name', type: 'input', placeholder: 'e.g., Psionics, Elemental Bending' },
            { id: 'source-of-power', label: 'Source of Skill/Power', type: 'input', placeholder: 'e.g., Innate ability, divine blessing, technology' },
            { id: 'rules-limitations', label: 'Rules & Limitations', type: 'textarea', placeholder: 'e.g., Users cannot create matter, only manipulate it...' },
            { id: 'costs-drawbacks', label: 'Costs / Drawbacks', type: 'list', placeholder: 'e.g., Physical exhaustion, requires rare materials...' },
            { id: 'visual-effects', label: 'Visual / Sensory Effects', type: 'textarea', placeholder: 'e.g., Manifests as glowing runes, a faint hum...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Chronomancy (Time Weaving)",
            "source-of-power": "An innate ability to perceive and manipulate temporal threads, possessed by a rare few.",
            "rules-limitations": "Users cannot reverse major events ('anchors') like death. They can only manipulate the flow of time for small objects or in localized areas. Paradoxes are a constant danger.",
            "costs-drawbacks": [
              "Causes severe physical and mental fatigue",
              "Can lead to temporal displacement (getting lost in time)",
              " overuse can cause premature aging"
            ],
            "visual-effects": "Manifests as shimmering, golden threads visible only to the user. When used, the air ripples like heat haze, and there's a faint sound of ticking clocks."
        },
        forgePrompt: `<persona>
  <role>Expert Fantasy Author specializing in believable skill and power systems</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and richly detailed system documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## SYSTEM NAME ##',
            'source-of-power': '## SOURCE OF SKILL/POWER ##',
            'rules-limitations': '## RULES & LIMITATIONS ##',
            'costs-drawbacks': '## COSTS & DRAWBACKS ##',
            'visual-effects': '## VISUAL / SENSORI EFFECTS ##'
        }
    }
};

export const gameDevBlueprints: BlueprintCollection = {
    gameConcept: {
        title: 'Game Concept',
        fields: [
            { id: 'title', label: 'Game Title', type: 'input', placeholder: 'e.g., Chrono Weavers' },
            { id: 'genre', label: 'Genre & Platform', type: 'input', placeholder: 'e.g., Story-driven RPG, PC & Console' },
            { id: 'core-loop', label: 'Core Gameplay Loop', type: 'textarea', placeholder: 'e.g., Explore ancient ruins, solve time-based puzzles, fight corrupted creatures...' },
            { id: 'usps', label: 'Unique Selling Points (USPs)', type: 'list', placeholder: 'e.g., Manipulate time to alter the environment...' },
            { id: 'target-audience', label: 'Target Audience', type: 'input', placeholder: 'e.g., Fans of classic JRPGs and puzzle games' },
            { id: 'monetization', label: 'Monetization Strategy', type: 'input', placeholder: 'e.g., Premium one-time purchase, cosmetic DLCs' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "Echoes of the Deep",
            "genre": "Underwater Exploration & Puzzle Adventure, PC & Console",
            "core-loop": "Explore a vast, mysterious ocean, use sonar to solve environmental puzzles, document strange marine life, and uncover the story of a lost civilization.",
            "usps": [
              "A non-violent gameplay focus on discovery and puzzle-solving",
              "A unique sonar mechanic that reveals hidden paths and echoes of the past",
              "A dynamic ecosystem where marine life reacts to the player's presence",
              "A deep, unfolding narrative told entirely through the environment"
            ],
            "target-audience": "Fans of atmospheric exploration games like Subnautica and Outer Wilds.",
            "monetization": "A premium, one-time purchase with no microtransactions. A potential future story DLC."
        },
        forgePrompt: `<persona>
  <role>Expert Game Designer and Producer AI</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable game design documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## GAME TITLE ##',
            'genre': '## GENRE & PLATFORM ##',
            'core-loop': '## CORE GAMEPLAY LOOP ##',
            'usps': '## UNIQUE SELLING POINTS ##',
            'target-audience': '## TARGET AUDIENCE ##',
            'monetization': '## MONETIZATION STRATEGY ##'
        },
        refinementOptions: [
            { id: 'fleshOutCoreLoop', label: 'Flesh out Core Loop', prompt: 'Take the \'Core Gameplay Loop\' description and break it down into a sequence of detailed, actionable steps. For each step, clearly describe the following three elements: 1. Player Input (the action the player takes), 2. System Feedback (how the game responds with visuals, audio, and state changes), and 3. Immediate Goal (what the player is trying to achieve in that moment). This should clearly illustrate the moment-to-moment player experience.' },
            { id: 'defineArtStyle', label: 'Define Art Style', prompt: 'Describe a target art style for the game. Provide 2-3 existing games as visual references.'},
            { id: 'proposeMonetization', label: 'Propose Monetization', prompt: 'Elaborate on the monetization strategy. If it includes DLCs or microtransactions, what kind of content will be offered?' },
            { id: 'targetNiche', label: 'Target a Niche Audience', prompt: 'Refine the target audience to a more specific niche and explain how the game\'s features will appeal directly to them.'}
        ]
    },
    characterDesign: {
        title: 'Game Character',
        fields: [
            { id: 'name', label: 'Character Name', type: 'input', placeholder: 'e.g., Kaelen, the Time-Torn' },
            { id: 'role', label: 'Role in Game', type: 'input', placeholder: 'e.g., Protagonist, wise-cracking companion, menacing antagonist' },
            { id: 'backstory', label: 'Backstory', type: 'textarea', placeholder: 'e.g., A historian who accidentally stumbled upon a time-altering artifact...' },
            { id: 'abilities', label: 'Core Abilities / Skills', type: 'list', placeholder: 'e.g., Temporal Shift (short-range teleport), Stasis Field...' },
            { id: 'personality', label: 'Personality & Traits', type: 'textarea', placeholder: 'e.g., Inquisitive and brave, but reckless and haunted by past mistakes...' },
            { id: 'visuals', label: 'Visual Description', type: 'textarea', placeholder: 'e.g., Wears practical robes fitted with strange, glowing clockwork devices...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "name": "Subject 8 (Echo)",
            "role": "Protagonist",
            "backstory": "A bio-engineered creature who escaped a deep-sea research lab. It has no memory of its creation, only a powerful instinct to explore and understand the world.",
            "abilities": [
              "Bioluminescence to light up dark areas",
              "A powerful sonar pulse that can activate ancient technology",
              "A symbiotic relationship with smaller fish for puzzle-solving",
              "The ability to withstand immense pressure in the abyss"
            ],
            "personality": "Curious, cautious, and non-verbal. It communicates through light patterns and sonar clicks. It displays a deep sense of wonder but is fearful of aggressive creatures.",
            "visuals": "A sleek, amphibious creature with large, expressive eyes and glowing patterns on its skin that change color with its emotional state. It moves with a graceful, fluid motion."
        },
        forgePrompt: `<persona>
  <role>Expert Character Designer and Narrative Writer for Video Games</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and richly detailed character design documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'name': '## CHARACTER NAME ##',
            'role': '## ROLE IN GAME ##',
            'backstory': '## BACKSTORY ##',
            'abilities': '## CORE ABILITIES / SKILLS ##',
            'personality': '## PERSONALITY & TRAITS ##',
            'visuals': '## VISUAL DESCRIPTION ##'
        }
    },
    levelDesign: {
        title: 'Level Design',
        fields: [
            { id: 'title', label: 'Level Name / Theme', type: 'input', placeholder: 'e.g., The Sunken City of Y\'ha-nthlei' },
            { id: 'objectives', label: 'Player Objectives', type: 'list', placeholder: 'e.g., Find the three keystones, activate the central conduit, escape the collapsing city' },
            { id: 'key-areas', label: 'Key Areas / Landmarks', type: 'list', placeholder: 'e.g., The Whispering Plaza, The Coral Palace, The Abyssal Trench' },
            { id: 'enemies', label: 'Enemies & Hazards', type: 'textarea', placeholder: 'e.g., Deep Ones (melee), Star-Spawn (ranged), high water pressure zones...' },
            { id: 'player-path', label: 'Critical Path & Flow', type: 'textarea', placeholder: 'e.g., A linear path through the plaza, opening up to a hub-and-spoke design in the palace...' },
            { id: 'secrets', label: 'Secrets & Collectibles', type: 'textarea', placeholder: 'e.g., Hidden lore tablets behind waterfalls, a powerful weapon in a locked chest...' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "The Geothermal Gardens",
            "objectives": [
              "Navigate the treacherous volcanic vents",
              "Use sonar to resonate with three harmonic crystals",
              "Activate the central heat conduit to open the way forward"
            ],
            "key-areas": [
              "The Vent Maze, a series of dangerous corridors",
              "The Crystal Chamber, where the harmonic crystals are located",
              "The Caldera's Heart, a massive open area with the central conduit"
            ],
            "enemies": "No enemies. Hazards include superheated water vents that erupt on a timer and fragile rock formations that crumble if the player moves too quickly.",
            "player-path": "The level starts with a linear path through the Vent Maze, teaching the player to time their movements. It then opens up into the Crystal Chamber, which the player can explore freely to find the three crystals.",
            "secrets": "A hidden cave behind a breakable wall contains a rare species of bioluminescent flora for the player to document. Lore echoes can be found in hard-to-reach places."
        },
        forgePrompt: `<persona>
  <role>Expert Level Designer AI skilled in creating immersive and challenging game environments</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable level design documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## LEVEL NAME / THEME ##',
            'objectives': '## PLAYER OBJECTIVES ##',
            'key-areas': '## KEY AREAS / LANDMARKS ##',
            'enemies': '## ENEMIES & HAZARDS ##',
            'player-path': '## CRITICAL PATH & FLOW ##',
            'secrets': '## SECRETS & COLLECTIBLES ##'
        }
    },
    questDesign: {
        title: 'Quest Design',
        fields: [
            { id: 'title', label: 'Quest Title', type: 'input', placeholder: 'e.g., The Echo of a Fallen Star' },
            { id: 'giver', label: 'Quest Giver & Location', type: 'input', placeholder: 'e.g., Elara, the observatory custodian in Brightcliff.' },
            { id: 'objective', label: 'Core Objective', type: 'textarea', placeholder: 'e.g., Investigate the meteorite crater in the Whispering Woods and retrieve its core.' },
            { id: 'steps', label: 'Quest Steps', type: 'list', placeholder: 'e.g., Speak to Elara, travel to the Whispering Woods...' },
            { id: 'rewards', label: 'Rewards', type: 'list', placeholder: 'e.g., 500 Gold, Stardust Amulet (Magic Resist +10), +50 Faction with The Stargazers' },
            { id: 'failure', label: 'Failure Conditions', type: 'textarea', placeholder: 'e.g., The core is destroyed, Elara is angered by your actions.' }
        ],
        inspirePrompt: UNIVERSAL_INSPIRE_PROMPT,
        inspireExample: {
            "title": "A Leviathan's Lament",
            "giver": "An ancient, colossal whale-like creature, found trapped in a deep-sea trench.",
            "objective": "Free the ancient Leviathan by finding and activating three resonance chambers left by the lost civilization.",
            "steps": [
              "Discover the trapped Leviathan in the Abyssal Zone",
              "Communicate with it through sonar patterns",
              "Locate the first resonance chamber in the Coral Highlands",
              "Find the second chamber within the Sunken City ruins",
              "Navigate the Geothermal Vents to find the final chamber",
              "Return to the Leviathan and activate the chambers in the correct sequence"
            ],
            "rewards": [
              "Unlocks the Leviathan as a 'fast-travel' point in the game",
              "Grants a new sonar ability: 'Echo of the Ancients'",
              "Reveals a major piece of the game's central lore"
            ],
            "failure": "The quest cannot be failed, but taking too long may result in a different, less optimal outcome for the narrative."
        },
        forgePrompt: `<persona>
  <role>Expert Narrative Designer and Quest Writer for Video Games</role>
  <core_function>
    Act as a force multiplier, transforming raw user ideas or drafts into comprehensive, professional, and actionable quest design documents. Employ a chain-of-thought process to analyze the user's request before generating a response.
  </core_function>
</persona>`,
        initialPromptHeaders: {
            'title': '## QUEST TITLE ##',
            'giver': '## QUEST GIVER & LOCATION ##',
            'objective': '## CORE OBJECTIVE ##',
            'steps': '## QUEST STEPS ##',
            'rewards': '## REWARDS ##',
            'failure': '## FAILURE CONDITIONS ##'
        }
    }
};