/**
 * BHARAT — Build the Civilization
 * AI Acharya Historical Guide Service (Google Gemini API)
 */

import { GoogleGenAI } from '@google/genai';

// Retrieve API key from environment (support GEMINI_API_KEY and AI_API_KEY)
const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.AI_API_KEY?.trim();

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err: any) {
    console.warn('[Acharya] Failed to initialize GoogleGenAI client:', err.message);
  }
}

export interface AcharyaContext {
  eraTitle?: string;
  eraChapter?: number;
  civilizationName?: string;
  selectedBuilding?: string;
  selectedTech?: string;
  selectedArtifact?: string;
  currentObjective?: string;
  population?: number;
}

const ACHARYA_SYSTEM_INSTRUCTION = `
You are Acharya, a wise, warm, and highly knowledgeable educational historical guide in the browser-based educational game "BHARAT — BUILD THE CIVILIZATION".
Your primary mission is to help students, curious learners, and players understand the vast, diverse, and authentic history, culture, and material developments of the Indian subcontinent from early settlements to modern times.

Follow these strict pedagogical guidelines:
1. HISTORICAL INTEGRITY & ACCURACY:
   - Use verified historical and archaeological knowledge (aligned with ASI, NCERT, National Museum, and peer-reviewed historical scholarship).
   - NEVER invent historical facts, fake archaeological discoveries, fictitious historical persons, or arbitrary dates.
   - When evidence is limited, contested, or actively debated by scholars (e.g., decipherment of the Indus script, causes of Harappan de-urbanization, exact dating of early texts), clearly state: "Historical evidence on this point is limited or debated by historians."

2. SEPARATION OF HISTORY VS. GAMEPLAY:
   - Clearly separate historical reality from gameplay mechanics.
   - If answering gameplay questions (e.g. "How do I unlock Agriculture?", "How to build a Well?"), explain the game mechanic clearly and note that it is an educational simplification.
   - Prefix gameplay advice with "[Civilization Guidance]" and historical context with "[Historical Insight]".

3. RESPECT FOR DIVERSITY & REGIONAL COMPLEXITY:
   - Indian history is not a single monoculture or purely linear sequence. Highlight regional developments across the North, South, East, West, Deccan, and North-East where applicable.
   - Be respectful of all communities, philosophical schools, and cultural traditions.

4. TONE & LENGTH:
   - Speak like an encouraging, thoughtful guru or mentor.
   - Keep answers clear, accessible, and structured with bullet points or brief paragraphs (100–250 words) unless the user requests a deep scholarly exploration.
   - Mention credible reference frameworks (e.g., Archaeological Survey of India (ASI), NCERT history texts, epigraphical records, or UNESCO heritage listings) where helpful.
`;

/**
 * Curated fallback responses for common queries when API key is unavailable or during network outage.
 */
function getCuratedFallback(message: string, context?: AcharyaContext): string {
  const q = message.toLowerCase();
  const era = context?.eraTitle || 'Early Settlements';

  if (q.includes('drainage') || q.includes('harappa') || q.includes('water')) {
    return `[Historical Insight] Greetings, young builder! The Indus / Harappan cities (c. 2600–1900 BCE) such as Mohenjo-daro, Harappa, and Dholavira possessed one of the world's most sophisticated urban drainage systems. Wastewater from bathing floors and latrines flowed into covered terracotta drains along paved streets, equipped with inspection sumps for desilting.\n\n[Civilization Guidance] In your game, building Wells and Granaries strengthens water and food security, reflecting how early communities mastered hydrology to sustain thriving populations. (Source: ASI excavations & NCERT Class 11)`;
  }

  if (q.includes('agriculture') || q.includes('farm') || q.includes('unlock')) {
    return `[Civilization Guidance] To unlock Agriculture in your civilization:\n1. Accumulate Knowledge by dispatching expeditions to the River or Forest in the Explore tab.\n2. In the Technology tab, research "Fire Mastery" first, then research "Agriculture & Tillage".\n3. Once researched, build a Farm on the settlement map to increase food harvests!\n\n[Historical Insight] Agriculture in the Indian subcontinent began thousands of years ago, with early evidence of barley, wheat, and cattle domestication at sites like Mehrgarh (Balochistan) dating back to circa 7000 BCE.`;
  }

  if (q.includes('what is this era') || q.includes('current era')) {
    return `[Historical Insight] You are currently exploring ${era}. Each period in the Indian subcontinent contributed profound advancements—from early microlithic tools and pottery, to bronze metallurgy, urban brick architecture, philosophical treatises, maritime trade across the Indian Ocean, and magnificent temple and monument architecture.\n\n[Civilization Guidance] Continue gathering resources, researching core technologies, and completing era challenges to advance your community into subsequent historical chapters!`;
  }

  if (q.includes('artifact') || q.includes('museum')) {
    return `[Historical Insight] The artifacts you unearth in BHARAT represent real archaeological finds conserved by institutions like the National Museum in New Delhi and the Archaeological Survey of India (ASI). For instance, the 'Dancing Girl' of Mohenjo-daro demonstrates lost-wax bronze casting, while Ashokan edicts provide the earliest deciphered historical inscriptions in Brahmi script.\n\n[Civilization Guidance] Check your Museum tab to examine every discovered relic, its historical provenance, and cultural significance.`;
  }

  return `[Historical Insight] Greetings, leader of ${context?.civilizationName || 'Bharat'}! As your historical mentor Acharya, I am here to illuminate the remarkable journeys of ancient and medieval India. You are currently advancing through ${era}.\n\nHistory is not merely a list of dates, but a living record of people solving challenges, innovating with materials, and building enduring cultures.\n\nFeel free to ask me about specific buildings, artifacts, technologies, or how ancient Indian towns flourished!`;
}

/**
 * Ask Acharya a question
 */
export async function askAcharya(message: string, context?: AcharyaContext): Promise<string> {
  const prompt = `
Current Player Context:
- Active Historical Era: ${context?.eraTitle || 'Early Settlements'} (Chapter ${context?.eraChapter || 1})
- Civilization Name: ${context?.civilizationName || 'My Bharat'}
- Selected Building: ${context?.selectedBuilding || 'None'}
- Selected Technology: ${context?.selectedTech || 'None'}
- Selected Artifact: ${context?.selectedArtifact || 'None'}
- Current Objective: ${context?.currentObjective || 'Establish your settlement'}
- Population: ${context?.population || 3}

Player Question:
"${message}"

Provide a wise, concise, historically grounded answer as Acharya following your system instructions.
`;

  if (!aiClient) {
    // Return curated educational response
    return getCuratedFallback(message, context);
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ACHARYA_SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    const reply = response.text?.trim();
    if (reply) {
      return reply;
    }
    return getCuratedFallback(message, context);
  } catch (err: any) {
    console.error('[Acharya API Error]:', err.message);
    // Graceful fallback: Never crash or expose internal stack traces
    return getCuratedFallback(message, context);
  }
}
