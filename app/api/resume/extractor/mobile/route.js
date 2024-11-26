import { AutofillWithResume } from '@/app/lib/extractResume';

const pdf = require('pdf-parse');

export async function POST(request) {
  const req = await request.formData();

  const resumeFile = req.get('resume');
  let arrayBuffer = await resumeFile.arrayBuffer();

  const resume = await pdf(arrayBuffer);
  const extractedText = resume.text.trim();

  const resumeData = await AutofillWithResume(extractedText);

  return Response.json(resumeData);
}
