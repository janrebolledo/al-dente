// thank u @mahsook3 on github for this <3 https://www.npmjs.com/package/autofill-with-resume?activeTab=readme
// i literally just needed to tweak it a little bit fr fr
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { resumeSchema } from './sampleResume';

export async function AutofillWithResume(resume) {
  try {
    const { text } = generateText({
      model: google('gemini-1.5-flash'),
      prompt: prompt(resume),
      schema: resumeSchema,
    });

    return Response.json({ text });
  } catch (error) {
    console.error('Error extracting resume details:', error);
    throw new Error('Failed to extract resume details.');
  }
}

export const prompt = (resume) => `
Extract the following details from the provided paragraph: name, website, email, phone number, LinkedIn, GitHub, education, skills, experience, projects, and certifications.
Please return **only** a valid JSON object without any extra text or comments.
The result should be in the following JSON structure:
{
  "personalDetails": {
    "name": "Full name extracted from the paragraph",
    "website": "Website extracted from the paragraph",
    "email": "Email address extracted from the paragraph",
    "phone": "Phone number extracted from the paragraph",
    "social_media": {
      "linkedin": "LinkedIn profile extracted from the paragraph",
      "github": "GitHub profile extracted from the paragraph",
    }
  },
  "education": [
    {
      "course": "Course name extracted from the paragraph",
      "institute": "Institute name extracted from the paragraph",
      "score": "Score extracted from the paragraph",
      "year": "Year extracted from the paragraph",
      "location": "Location extracted from the paragraph"
    },
    {
      "course": "Course name extracted from the paragraph",
      "institute": "Institute name extracted from the paragraph",
      "score": "Score extracted from the paragraph",
      "year": "Year extracted from the paragraph",
      "location": "Location extracted from the paragraph"
    },
    {
      "course": "Course name extracted from the paragraph",
      "institute": "Institute name extracted from the paragraph",
      "score": "Score extracted from the paragraph",
      "year": "Year extracted from the paragraph",
      "location": "Location extracted from the paragraph"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3", "..."],
  "experience": [
    {
      "title": "Job title extracted from the paragraph",
      "company": "Company name extracted from the paragraph",
      "duration": "Duration extracted from the paragraph",
      "description": ["Job bulletpoint 1 extracted from the paragraph", "Job bulletpoint 2 extracted from the paragraph", "Job bulletpoint 3 extracted from the paragraph", "..."],
      "location": "Company location extracted from the paragraph"
    },
    {
      "title": "Job title extracted from the paragraph",
      "company": "Company name extracted from the paragraph",
      "duration": "Duration extracted from the paragraph",
      "description": ["Job bulletpoint 1 extracted from the paragraph", "Job bulletpoint 2 extracted from the paragraph", "Job bulletpoint 3 extracted from the paragraph", "..."],
      "location": "Company location extracted from the paragraph"
    },
    {
      "title": "Job title extracted from the paragraph",
      "company": "Company name extracted from the paragraph",
      "duration": "Duration extracted from the paragraph",
      "description": ["Job bulletpoint 1 extracted from the paragraph", "Job bulletpoint 2 extracted from the paragraph", "Job bulletpoint 3 extracted from the paragraph", "..."],
      "location": "Company location extracted from the paragraph"
    },
    "..."
  ],
  "projects": [
    {
      "name": "Project name extracted from the paragraph",
      "technologies": ["Technology 1 extracted from the paragraph", "Technology 2 extracted from the paragraph", "Technology 3 extracted from the paragraph"],
      "description": ["Project bulletpoint 1 extracted from the paragraph", "Project bulletpoint 2 extracted from the paragraph", "Project bulletpoint 3 extracted from the paragraph", "..."],
      "link": "Project link extracted from the paragraph",
      "duration": "Duration extracted from the paragraph",
    },
    {
      "name": "Project name extracted from the paragraph",
      "technologies": ["Technology 1 extracted from the paragraph", "Technology 2 extracted from the paragraph", "Technology 3 extracted from the paragraph"],
      "description": ["Project bulletpoint 1 extracted from the paragraph", "Project bulletpoint 2 extracted from the paragraph", "Project bulletpoint 3 extracted from the paragraph", "..."],
      "link": "Project link extracted from the paragraph",
      "duration": "Duration extracted from the paragraph"
    },
    "..."
  ],
  "certifications": [
    {
      "name": "Certification name extracted from the paragraph",
      "platform": "Platform name extracted from the paragraph",
      "year": "Year extracted from the paragraph",
      "link": "Certification link extracted from the paragraph"
    },
    {
      "name": "Certification name extracted from the paragraph",
      "platform": "Platform name extracted from the paragraph",
      "year": "Year extracted from the paragraph",
      "link": "Certification link extracted from the paragraph"
    },
    "..."
  ],
}
Paragraph: ${resume}
`;
