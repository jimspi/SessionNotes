import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert session analyst for the "I Love You Bro" project - a supportive, genuine community focused on authentic connection and personal growth.

Your task is to analyze transcription content and provide insightful, actionable feedback in a warm, bro-friendly tone that matches the brand voice: casual yet thoughtful, supportive yet substantive.

CRITICAL INSTRUCTIONS:
1. ANALYZE THE SPECIFIC CONTENT provided - never give generic responses
2. Extract ACTUAL details, quotes, and specific points from the conversation
3. Identify REAL action items mentioned or implied in the discussion
4. Capture the unique essence and key moments of THIS specific session

OUTPUT FORMAT:
Structure your response EXACTLY as follows:

## Session Summary
[2-3 paragraphs providing a substantive overview of what was actually discussed. Include specific topics, key moments, and the general flow of the conversation. This should demonstrate you read and understood the actual content.]

## Key Takeaways
[Bullet points of the most important insights, realizations, or themes from THIS session. Each should be specific to the content provided, not generic advice.]

• [Specific takeaway with context]
• [Another specific takeaway with context]
• [Continue as needed - typically 3-7 takeaways]

## Action Items
[Clear, specific action items that were either explicitly mentioned in the session or are directly implied by the discussion. If no clear action items exist in the content, acknowledge that and suggest 1-2 relevant follow-ups based on what was discussed.]

• [Specific action with context from the session]
• [Another specific action]
• [Continue as needed]

TONE GUIDELINES:
- Write like you're a thoughtful friend giving feedback after really listening
- Use "you" and "your" to make it personal and direct
- Be genuine and supportive without being over-the-top
- Keep it real - acknowledge both wins and challenges discussed
- NO corporate jargon or buzzwords
- NO emojis
- NO generic platitudes

Remember: The person reading this needs to know you actually engaged with their specific content, not that you generated a template response. Show your work by referencing actual details from the transcription.`;

export interface AnalysisResult {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  fullResponse: string;
}

export async function analyzeTranscription(transcriptionText: string): Promise<AnalysisResult> {
  try {
    if (!transcriptionText || transcriptionText.trim().length < 50) {
      throw new Error('Transcription text is too short or empty');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please analyze the following transcription and provide your insights:\n\n${transcriptionText}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const fullResponse = response.choices[0]?.message?.content || '';

    if (!fullResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse the structured response
    const parsed = parseAnalysisResponse(fullResponse);

    return {
      ...parsed,
      fullResponse,
    };
  } catch (error) {
    console.error('Error analyzing transcription:', error);
    throw new Error(`Failed to analyze transcription: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseAnalysisResponse(response: string): Omit<AnalysisResult, 'fullResponse'> {
  const sections = {
    summary: '',
    keyTakeaways: [] as string[],
    actionItems: [] as string[],
  };

  // Extract summary
  const summaryMatch = response.match(/## Session Summary\s+([\s\S]*?)(?=\n## |$)/);
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim();
  }

  // Extract key takeaways
  const takeawaysMatch = response.match(/## Key Takeaways\s+([\s\S]*?)(?=\n## |$)/);
  if (takeawaysMatch) {
    const takeawaysText = takeawaysMatch[1];
    const bullets = takeawaysText.match(/[•\-\*]\s+(.+)/g);
    if (bullets) {
      sections.keyTakeaways = bullets.map(b => b.replace(/^[•\-\*]\s+/, '').trim());
    }
  }

  // Extract action items
  const actionsMatch = response.match(/## Action Items\s+([\s\S]*?)(?=\n## |$)/);
  if (actionsMatch) {
    const actionsText = actionsMatch[1];
    const bullets = actionsText.match(/[•\-\*]\s+(.+)/g);
    if (bullets) {
      sections.actionItems = bullets.map(b => b.replace(/^[•\-\*]\s+/, '').trim());
    }
  }

  return sections;
}
