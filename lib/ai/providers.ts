import { Groq } from 'groq-sdk';
import { OpenAI } from 'openai';

export type AIProvider = 'groq' | 'openai';

export interface AICompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: 'json_object' | 'text';
}

export async function invokeAIModel(options: AICompletionOptions): Promise<{ content: string; provider: AIProvider }> {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.userPrompt },
        ],
        model: 'llama3-8b-8192',
        response_format: options.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        temperature: 0.2,
      });

      const content = chatCompletion.choices[0]?.message?.content || '';
      if (content) {
        return { content, provider: 'groq' };
      }
    } catch (error) {
      console.error('Groq API failed, falling back to OpenAI.', error);
    }
  }

  if (openaiKey) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.userPrompt },
        ],
        model: 'gpt-4o-mini',
        response_format: options.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        temperature: 0.2,
      });

      const content = chatCompletion.choices[0]?.message?.content || '';
      if (content) {
        return { content, provider: 'openai' };
      }
    } catch (error) {
      console.error('OpenAI API failed.', error);
    }
  }

  throw new Error('AI providers unavailable.');
}
