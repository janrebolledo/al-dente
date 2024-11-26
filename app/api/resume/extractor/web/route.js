// thank u @mahsook3 on github for this <3 https://www.npmjs.com/package/autofill-with-resume?activeTab=readme
// i literally just needed to tweak it a little bit fr fr
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { resumeSchema } from '@/app/lib/sampleResume';
import { prompt } from '@/app/lib/extractResume';

export const maxDuration = 30;

export async function POST(request) {
  const req = await request.json();

  const result = streamObject({
    model: google('gemini-1.5-flash'),
    prompt: prompt(req),
    schema: resumeSchema,
  });

  return result.toTextStreamResponse();
}
