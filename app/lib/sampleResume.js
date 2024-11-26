import { z } from 'zod';

export const sampleResume = {
  certifications: [
    {
      id: '0',
      link: '',
      name: 'CompTIA IT Fundamentals',
      platform: '',
      year: 'April 2024',
    },
  ],
  education: [
    {
      course: 'B.S. in Computer Science',
      id: '0',
      institute: 'California State Polytechnic University, Pomona',
      location: 'Pomona, CA',
      score: '',
      year: 'May 2028',
    },
  ],
  experience: [
    {
      company: 'Freelance',
      description: [
        'Designed, developed, and deployed over 20 responsive business sites, portfolios, and ecommerce sites using React.js, Next.js, Astro, and Svelte.',
        'Optimized website performance by optimizing assets and lazy loading resulting in 90+ Google Lighthouse scores (Google’s performance testing tool).',
        'Handled over $10,000 in secure ecommerce payments for 100+ transactions with custom Shopify themes, headless Shopify stores, Stripe JavaScript SDK, and Lemon Squeezy API.',
      ],
      duration: '2020 – Present',
      id: '0',
      location: 'Remote',
      title: 'Graphic Designer & Website Developer',
    },
  ],
  personalDetails: {
    email: 'janrebolledoj2@gmail.com',
    name: 'Jan Rebolledo Jimenez',
    phone: '(909) 213 - 7391',
    social_media: {
      github: 'https://github.com/janrebolledo',
      linkedin: '',
    },
    website: 'https://janrebolledo.com',
  },
  projects: [
    {
      description: [
        'Generated 40+ weekly newsletter signups through strategic UX design and marketing integrations.',
        'Dynamic product and portfolio pages built around content imported from Contentful CMS.',
        'Secure payment processing using Stripe API and TypeScript types.',
        "Boosted client's revenue by 165% and generated 100+ monthly qualified leads.",
      ],
      duration: 'December 2023',
      id: '0',
      link: '',
      name: 'Artem Ecommerce Site',
      technologies: [
        'React.js',
        'Next.js',
        'Astro',
        'Svelte',
        'Stripe API',
        'TypeScript',
      ],
    },
    {
      description: [
        'Led a team of 4 beginner-intermediate programmers to create a home energy tracking device to aid landlords and tenants in reducing energy waste, winning first place.',
        'Created a Next.js web application with authentication displaying real-time Arduino sensor data, featuring LLM/AI powered user consumption suggestions.',
      ],
      duration: 'February 2024',
      id: '1',
      link: '',
      name: 'Mountain Desert Career Pathways Hackathon',
      technologies: ['Next.js', 'Arduino', 'LLM/AI'],
    },
  ],
  skills: [
    'React.js',
    'Next.js',
    'Astro',
    'Svelte',
    'Shopify',
    'Stripe',
    'Lemon Squeezy API',
    'UX design',
    'Contentful CMS',
    'TypeScript',
    'Arduino',
    'LLM/AI',
  ],
};

export const initialState = {
  personalDetails: {
    name: '',
    website: '',
    email: '',
    phone: '',
    social_media: {
      linkedin: '',
      github: '',
    },
  },
  education: [
    {
      course: '',
      institute: '',
      score: null,
      year: '',
      location: '',
    },
  ],
  skills: [],
  experience: [
    {
      id: '',
      title: '',
      company: '',
      duration: '',
      description: [],
      location: '',
    },
  ],
  projects: [
    {
      id: '',
      name: '',
      technologies: [],
      description: [],
      link: null,
      duration: '',
    },
  ],
  certifications: [
    // {
    //   name: '',
    //   platform: '',
    //   year: '',
    //   link: null,
    // },
  ],
};

// define a schema for the notifications
export const resumeSchema = z.object({
  personalDetails: z.object({
    name: z.string(),
    website: z.string(),
    email: z.string(),
    phone: z.string(),
    social_media: z.object({
      linkedin: z.string(),
      github: z.string(),
    }),
  }),
  education: z.array(
    z.object({
      id: z.string(),
      course: z.string(),
      institute: z.string(),
      score: z.string(),
      year: z.string(),
      location: z.string(),
    })
  ),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      description: z.array(z.string()),
      location: z.string(),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      technologies: z.array(z.string()),
      description: z.array(z.string()),
      link: z.string(),
      duration: z.string(),
    })
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      platform: z.string(),
      year: z.string(),
      link: z.string(),
    })
  ),
});
