/**
 * Centralized AI Tools & Gemini Gems Registry
 * Managed via the Admin Portal (/admin) and rendered on /ai-tools.
 */

export type AITool = {
  id: string;
  name: string;
  category:
    | "Gemini Gems"
    | "Text & Reasoning"
    | "Video & Avatars"
    | "Image & Creative"
    | "Voice & Audio"
    | "Automation & Agents"
    | "Productivity";
  pricing: "Free" | "Freemium" | "Paid" | "Check website";
  rating: number;
  description: string;
  bestFor: string;
  website: string;
  iconBg: string;
  iconColor: string;
  promptExample: string;
  practicalWorkflow: string;
  tags: string[];
};

const CATALOG_ADDITIONS: AITool[] = [
  {
    "id": "gemini",
    "name": "Google Gemini",
    "category": "Text & Reasoning",
    "pricing": "Check website",
    "rating": 0,
    "description": "Brainstorm ideas, draft content and ask questions with Google AI.",
    "bestFor": "Planning content and explaining concepts",
    "website": "https://gemini.google.com/",
    "iconBg": "bg-blue-500/10",
    "iconColor": "text-blue-400",
    "promptExample": "Explain three ways a beginner can use AI for daily planning.",
    "practicalWorkflow": "Ask a focused question -> Review the answer -> Adapt it to your project.",
    "tags": [
      "Text",
      "Planning content"
    ]
  },
  {
    "id": "perplexity",
    "name": "Perplexity",
    "category": "Text & Reasoning",
    "pricing": "Check website",
    "rating": 0,
    "description": "Research questions with AI answers and links to supporting sources.",
    "bestFor": "Source-backed research",
    "website": "https://www.perplexity.ai/",
    "iconBg": "bg-blue-500/10",
    "iconColor": "text-blue-400",
    "promptExample": "Compare three approaches to online learning and cite your sources.",
    "practicalWorkflow": "Ask a research question -> Open the cited sources -> Save verified notes.",
    "tags": [
      "Text",
      "Source-backed research"
    ]
  },
  {
    "id": "copilot",
    "name": "Microsoft Copilot",
    "category": "Text & Reasoning",
    "pricing": "Check website",
    "rating": 0,
    "description": "Use a conversational assistant to explore ideas, write drafts and simplify information.",
    "bestFor": "Everyday writing and brainstorming",
    "website": "https://copilot.microsoft.com/",
    "iconBg": "bg-blue-500/10",
    "iconColor": "text-blue-400",
    "promptExample": "Draft a friendly welcome message for a beginner learning community.",
    "practicalWorkflow": "Describe your goal -> Refine the draft -> Check facts before sharing.",
    "tags": [
      "Text",
      "Everyday writing"
    ]
  },
  {
    "id": "notebooklm",
    "name": "Gemini Notebook (NotebookLM)",
    "category": "Productivity",
    "pricing": "Check website",
    "rating": 0,
    "description": "Explore your source material with AI summaries and study assistance.",
    "bestFor": "Studying documents and organizing research",
    "website": "https://notebooklm.google/",
    "iconBg": "bg-amber-500/10",
    "iconColor": "text-amber-400",
    "promptExample": "Summarize these notes and list the questions they do not answer.",
    "practicalWorkflow": "Add your sources -> Ask focused questions -> Check the source references.",
    "tags": [
      "Productivity",
      "Studying documents"
    ]
  },
  {
    "id": "canva-magic",
    "name": "Canva AI",
    "category": "Image & Creative",
    "pricing": "Check website",
    "rating": 0,
    "description": "Create and edit visual designs with AI assistance inside Canva.",
    "bestFor": "Social graphics, slides and worksheets",
    "website": "https://www.canva.com/canva-ai/",
    "iconBg": "bg-purple-500/10",
    "iconColor": "text-purple-400",
    "promptExample": "Design a five-slide introduction to responsible AI use.",
    "practicalWorkflow": "Describe your design -> Customize the layout -> Review and export.",
    "tags": [
      "Image",
      "Social graphics, slides"
    ]
  },
  {
    "id": "firefly",
    "name": "Adobe Firefly",
    "category": "Image & Creative",
    "pricing": "Check website",
    "rating": 0,
    "description": "Generate and edit creative visuals using Adobe generative AI tools.",
    "bestFor": "Marketing artwork and visual concepts",
    "website": "https://www.adobe.com/products/firefly.html",
    "iconBg": "bg-purple-500/10",
    "iconColor": "text-purple-400",
    "promptExample": "Create a clean illustration of a digital classroom with warm lighting.",
    "practicalWorkflow": "Describe the visual -> Compare variations -> Edit the result for your design.",
    "tags": [
      "Image",
      "Marketing artwork"
    ]
  },
  {
    "id": "ideogram",
    "name": "Ideogram",
    "category": "Image & Creative",
    "pricing": "Check website",
    "rating": 0,
    "description": "Generate images and design concepts from written descriptions.",
    "bestFor": "Posters and concept exploration",
    "website": "https://ideogram.ai/",
    "iconBg": "bg-purple-500/10",
    "iconColor": "text-purple-400",
    "promptExample": "Create a minimal workshop poster with the headline Learn with AI.",
    "practicalWorkflow": "Write a prompt -> Inspect text and layout -> Refine and export.",
    "tags": [
      "Image",
      "Posters"
    ]
  },
  {
    "id": "leonardo",
    "name": "Leonardo.Ai",
    "category": "Image & Creative",
    "pricing": "Check website",
    "rating": 0,
    "description": "Explore AI-generated images and creative visual variations.",
    "bestFor": "Concept art and social media visuals",
    "website": "https://leonardo.ai/",
    "iconBg": "bg-purple-500/10",
    "iconColor": "text-purple-400",
    "promptExample": "Create a friendly illustration of a creator recording an online lesson.",
    "practicalWorkflow": "Describe the scene -> Generate alternatives -> Select and refine.",
    "tags": [
      "Image",
      "Concept art"
    ]
  },
  {
    "id": "heygen",
    "name": "HeyGen",
    "category": "Video & Avatars",
    "pricing": "Check website",
    "rating": 0,
    "description": "Create presenter-style videos with AI avatars and video translation tools.",
    "bestFor": "Training introductions and explainer videos",
    "website": "https://www.heygen.com/",
    "iconBg": "bg-pink-500/10",
    "iconColor": "text-pink-400",
    "promptExample": "Write a 45-second welcome script for a digital skills workshop.",
    "practicalWorkflow": "Prepare a script -> Choose a presenter -> Review pronunciation and export.",
    "tags": [
      "Video",
      "Training introductions"
    ]
  },
  {
    "id": "runway",
    "name": "Runway",
    "category": "Video & Avatars",
    "pricing": "Check website",
    "rating": 0,
    "description": "Generate and edit video with AI-assisted creative tools.",
    "bestFor": "Short creative clips and visual storytelling",
    "website": "https://runwayml.com/",
    "iconBg": "bg-pink-500/10",
    "iconColor": "text-pink-400",
    "promptExample": "Animate a slow camera move across a bright creative workspace.",
    "practicalWorkflow": "Prepare an idea or image -> Generate a clip -> Edit it into your video.",
    "tags": [
      "Video",
      "Short creative clips"
    ]
  },
  {
    "id": "synthesia",
    "name": "Synthesia",
    "category": "Video & Avatars",
    "pricing": "Check website",
    "rating": 0,
    "description": "Turn scripts into AI presenter videos for learning and communication.",
    "bestFor": "Training and instructional explainers",
    "website": "https://www.synthesia.io/",
    "iconBg": "bg-pink-500/10",
    "iconColor": "text-pink-400",
    "promptExample": "Introduce a lesson about customer communication in clear everyday language.",
    "practicalWorkflow": "Draft the lesson -> Choose an avatar -> Review the video before publishing.",
    "tags": [
      "Video",
      "Training"
    ]
  },
  {
    "id": "descript",
    "name": "Descript",
    "category": "Video & Avatars",
    "pricing": "Check website",
    "rating": 0,
    "description": "Edit recorded audio and video through text with AI-assisted production features.",
    "bestFor": "Lesson editing and podcast production",
    "website": "https://www.descript.com/",
    "iconBg": "bg-pink-500/10",
    "iconColor": "text-pink-400",
    "promptExample": "Remove repeated phrases from this recording and keep the key explanation.",
    "practicalWorkflow": "Import a recording -> Edit its transcript -> Review timing and export.",
    "tags": [
      "Video",
      "Lesson editing"
    ]
  },
  {
    "id": "suno",
    "name": "Suno",
    "category": "Voice & Audio",
    "pricing": "Check website",
    "rating": 0,
    "description": "Generate music ideas from descriptions of style, mood and instrumentation.",
    "bestFor": "Exploring musical ideas for creative projects",
    "website": "https://suno.com/",
    "iconBg": "bg-indigo-500/10",
    "iconColor": "text-indigo-400",
    "promptExample": "Create an upbeat instrumental idea with gentle percussion and piano.",
    "practicalWorkflow": "Describe the music -> Listen to variations -> Check usage rights before publishing.",
    "tags": [
      "Voice",
      "Exploring musical ideas for creative projects"
    ]
  },
  {
    "id": "aiva",
    "name": "AIVA",
    "category": "Voice & Audio",
    "pricing": "Check website",
    "rating": 0,
    "description": "Compose music with AI assistance and explore different musical styles.",
    "bestFor": "Instrumental compositions",
    "website": "https://www.aiva.ai/",
    "iconBg": "bg-indigo-500/10",
    "iconColor": "text-indigo-400",
    "promptExample": "Create a calm instrumental track for a reflective learning video.",
    "practicalWorkflow": "Choose a style -> Generate a composition -> Edit and check the license.",
    "tags": [
      "Voice",
      "Instrumental compositions"
    ]
  },
  {
    "id": "gamma",
    "name": "Gamma",
    "category": "Productivity",
    "pricing": "Check website",
    "rating": 0,
    "description": "Create presentations and visual documents from an outline with AI assistance.",
    "bestFor": "Slide decks and workshop outlines",
    "website": "https://gamma.app/",
    "iconBg": "bg-amber-500/10",
    "iconColor": "text-amber-400",
    "promptExample": "Create a six-slide introduction to content planning for beginners.",
    "practicalWorkflow": "Supply an outline -> Review generated slides -> Customize facts and visuals.",
    "tags": [
      "Productivity",
      "Slide decks"
    ]
  },
  {
    "id": "notion-ai",
    "name": "Notion AI",
    "category": "Productivity",
    "pricing": "Check website",
    "rating": 0,
    "description": "Use AI assistance within a workspace for notes, documents and team knowledge.",
    "bestFor": "Organizing notes and project information",
    "website": "https://www.notion.com/product/ai",
    "iconBg": "bg-amber-500/10",
    "iconColor": "text-amber-400",
    "promptExample": "Turn these workshop notes into action items with owners and deadlines.",
    "practicalWorkflow": "Open your notes -> Ask for a summary -> Review and assign next steps.",
    "tags": [
      "Productivity",
      "Organizing notes"
    ]
  },
  {
    "id": "grammarly",
    "name": "Grammarly",
    "category": "Text & Reasoning",
    "pricing": "Check website",
    "rating": 0,
    "description": "Improve clarity, grammar and tone with AI writing assistance.",
    "bestFor": "Polishing emails and lesson drafts",
    "website": "https://www.grammarly.com/",
    "iconBg": "bg-blue-500/10",
    "iconColor": "text-blue-400",
    "promptExample": "Make this announcement shorter and clearer while keeping a friendly tone.",
    "practicalWorkflow": "Draft your text -> Review suggested edits -> Keep changes that match your intent.",
    "tags": [
      "Text",
      "Polishing emails"
    ]
  },
  {
    "id": "zapier",
    "name": "Zapier",
    "category": "Automation & Agents",
    "pricing": "Check website",
    "rating": 0,
    "description": "Connect apps and add AI steps to repeatable business workflows.",
    "bestFor": "Forms, notifications and task handoffs",
    "website": "https://zapier.com/",
    "iconBg": "bg-emerald-500/10",
    "iconColor": "text-emerald-400",
    "promptExample": "Plan a workflow that summarizes a new form response and creates a follow-up task.",
    "practicalWorkflow": "Choose a trigger -> Add an AI step -> Test with sample data before enabling.",
    "tags": [
      "Automation",
      "Forms, notifications"
    ]
  },
  {
    "id": "n8n",
    "name": "n8n",
    "category": "Automation & Agents",
    "pricing": "Check website",
    "rating": 0,
    "description": "Build flexible workflows that connect apps, data and AI models.",
    "bestFor": "Custom AI workflows and integrations",
    "website": "https://n8n.io/",
    "iconBg": "bg-emerald-500/10",
    "iconColor": "text-emerald-400",
    "promptExample": "Design a workflow that categorizes incoming support requests for review.",
    "practicalWorkflow": "Connect your data source -> Add processing steps -> Test and monitor the workflow.",
    "tags": [
      "Automation",
      "Custom AI workflows"
    ]
  },
  {
    "id": "otter",
    "name": "Otter.ai",
    "category": "Productivity",
    "pricing": "Check website",
    "rating": 0,
    "description": "Transcribe meetings and create AI-assisted summaries and action items.",
    "bestFor": "Meeting notes and follow-up tasks",
    "website": "https://otter.ai/",
    "iconBg": "bg-amber-500/10",
    "iconColor": "text-amber-400",
    "promptExample": "Summarize this meeting into decisions, open questions and action items.",
    "practicalWorkflow": "Record with participant consent -> Review the transcript -> Share approved notes.",
    "tags": [
      "Productivity",
      "Meeting notes"
    ]
  }
];

export const INITIAL_AI_TOOLS: AITool[] = [
  {
    id: "custom-gemini-gem-1",
    name: "NMAI Sales Objection Mentor",
    category: "Gemini Gems",
    pricing: "Free",
    rating: 5.0,
    description:
      "Custom-trained Gemini assistant created specifically for NMAI. Pre-configured with specialized instructions, conversation frameworks, and practical business knowledge.",
    bestFor:
      "Personalized course guidance, objection handling, sales scripts & direct student support",
    website:
      "https://gemini.google.com/gem/16HfUl9hwpduJh9TIkPFJ171ZU-2n8-68?usp=sharing",
    iconBg:
      "bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-400/20",
    iconColor: "text-cyan-300",
    promptExample:
      "Help me practice handling customer objections using the NMAI conversation system.",
    practicalWorkflow:
      "Click Launch Gem -> Opens directly in Google Gemini -> Start asking questions with preloaded knowledge.",
    tags: ["Gemini Gem", "Custom AI", "Google Gemini", "NMAI Exclusive"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Text & Reasoning",
    pricing: "Freemium",
    rating: 4.9,
    description:
      "Industry-standard conversational AI for copywriting, business strategy, curriculum planning, and problem solving.",
    bestFor: "Content creation, lesson scripts, customer emails & sales scripts",
    website: "https://chatgpt.com",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    promptExample:
      "Act as an expert digital educator. Create a 5-day email onboarding sequence for new students joining our online business course.",
    practicalWorkflow:
      "Use ChatGPT to draft lesson scripts -> Refine tone -> Generate quiz questions for each module.",
    tags: ["OpenAI", "Copywriting", "Writing", "Scripts"],
  },
  {
    id: "claude",
    name: "Claude",
    category: "Text & Reasoning",
    pricing: "Freemium",
    rating: 4.9,
    description:
      "Anthropic's flagship model known for nuanced writing, deep reasoning, long document analysis, and high-accuracy code.",
    bestFor:
      "Complex course architectures, analytical business reviews, and human-sounding longform writing",
    website: "https://claude.ai",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    promptExample:
      "Review this 4-module network marketing course outline. Analyze it for student drop-off risks and suggest 3 interactive exercises.",
    practicalWorkflow:
      "Upload PDF slides or ebooks into Claude -> Ask it to summarize into bite-sized actionable cheat sheets.",
    tags: ["Anthropic", "Analysis", "Deep Thinking", "Education"],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Image & Creative",
    pricing: "Paid",
    rating: 4.8,
    description:
      "Photorealistic and stylized AI image generator producing world-class thumbnails, promotional artwork, and course illustrations.",
    bestFor:
      "Course thumbnails, social media hero visuals, brand branding & aesthetic moodboards",
    website: "https://midjourney.com",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    promptExample:
      "Modern cinematic close-up of a student studying futuristic digital course on laptop, neon teal and deep navy lighting, 8k --ar 16:9",
    practicalWorkflow:
      "Generate 4 variations -> Upscale preferred image -> Crop in Canva for YouTube thumbnail.",
    tags: ["Visuals", "Thumbnails", "Generative Art", "Branding"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Voice & Audio",
    pricing: "Freemium",
    rating: 4.9,
    description:
      "Ultra-realistic generative voice synthesis with natural human inflections, multilingual dubbing, and custom voice cloning.",
    bestFor:
      "Course voiceovers, podcast narration, promotional videos & multilingual audio tracks",
    website: "https://elevenlabs.io",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    promptExample:
      "Select 'Adam' or cloned profile. Tone: warm, authoritative, engaging educator.",
    practicalWorkflow:
      "Write script in ChatGPT -> Paste into ElevenLabs -> Download crisp MP3 -> Align with video timeline.",
    tags: ["Voice AI", "Voiceover", "Audio Dubbing", "Podcasts"],
  },
  {
    id: "make",
    name: "Make.com",
    category: "Automation & Agents",
    pricing: "Freemium",
    rating: 4.8,
    description:
      "Visual automation platform that connects apps and APIs to build autonomous workflows, student notifications, and CRM syncs.",
    bestFor:
      "Automating student enrollment, sending WhatsApp alerts, synchronizing course completions",
    website: "https://make.com",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    promptExample:
      "Watch Webhook (New Student) -> Add to Airtable -> Send Welcome WhatsApp message -> Add to Course Cohort.",
    practicalWorkflow:
      "Connect Google Sheet + WhatsApp API + NMAI webhooks for 100% hands-free student onboarding.",
    tags: ["No-Code", "Automation", "Webhooks", "Integrations"],
  },
  ...CATALOG_ADDITIONS,
];

const TOOLS_STORAGE_KEY = "nmai-ai-tools-data";

export function getAiTools(): AITool[] {
  if (typeof window === "undefined") {
    return INITIAL_AI_TOOLS;
  }

  try {
    const raw = localStorage.getItem(TOOLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Upgrade once: preserve custom entries and do not resurrect later deletions.
        if (localStorage.getItem("nmai-ai-tools-catalog-version") !== "2026-10-14") {
          const ids = new Set(parsed.map((tool: AITool) => tool.id));
          const upgraded = [...parsed, ...CATALOG_ADDITIONS.filter(tool => !ids.has(tool.id))];
          localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(upgraded));
          localStorage.setItem("nmai-ai-tools-catalog-version", "2026-10-14");
          return upgraded;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading AI tools:", e);
  }

  return INITIAL_AI_TOOLS;
}

export function saveAiTools(tools: AITool[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
    localStorage.setItem("nmai-ai-tools-catalog-version", "2026-10-14");
  } catch (e) {
    console.error("Error saving AI tools:", e);
  }
}

export function addAiTool(newTool: Omit<AITool, "id">): AITool {
  const tools = getAiTools();
  const tool: AITool = {
    ...newTool,
    id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };
  tools.unshift(tool);
  saveAiTools(tools);
  return tool;
}

export function updateAiTool(id: string, partial: Partial<AITool>): boolean {
  const tools = getAiTools();
  const idx = tools.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  tools[idx] = { ...tools[idx], ...partial };
  saveAiTools(tools);
  return true;
}

export function deleteAiTool(id: string): boolean {
  const tools = getAiTools();
  const filtered = tools.filter((t) => t.id !== id);
  if (filtered.length === tools.length) return false;

  saveAiTools(filtered);
  return true;
}
