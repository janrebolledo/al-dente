import { AutofillWithResume } from '@/app/lib/extractResume';
import { sampleResume } from '@/app/lib/sampleResume';
import { NextResponse } from 'next/server';

const pdf = require('pdf-parse');

export async function POST(request) {
  const req = await request.formData();

  const resumeFile = req.get('resume');
  let arrayBuffer = await resumeFile.arrayBuffer();

  const resume = await pdf(arrayBuffer);
  const extractedText = resume.text.trim();

  console.log(extractedText);
  const resumeData = await AutofillWithResume(extractedText);

  console.log(resumeData);

  return Response.json(resumeData);
}
