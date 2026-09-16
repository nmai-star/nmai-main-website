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
  pricing: "Free" | "Freemium" | "Paid";
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
    tags: ["OpenAI", "Copywriting", "GPT-4o", "Scripts"],
  },
  {
    id: "claude",
    name: "Claude 3.7 Sonnet",
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
    name: "Midjourney v6",
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
      if (Array.isArray(parsed) && parsed.length > 0) {
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
