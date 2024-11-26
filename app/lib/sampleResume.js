import { z } from 'zod';

export const sampleResume = {
  personalDetails: {
    name: 'Jan Rebolledo Jimenez',
    website: 'https://janrebolledo.com',
    email: 'janrebolledoj2@gmail.com',
    phone: '(909) 213 - 7391',
    social_media: {
      linkedin: null,
      github: 'https://github.com/janrebolledo',
      twitter: null,
      facebook: null,
    },
  },
  education: [
    {
      course: 'B.S. in Computer Science',
      institute: 'California State Polytechnic University, Pomona',
      score: null,
      year: '2028',
      location: 'Pomona, CA',
    },
  ],
  skills: [
    'React.js',
    'Next.js',
    'Astro',
    'Svelte',
    'Shopify',
    'Stripe JavaScript SDK',
    'Lemon Squeezy API',
    'TypeScript',
    'UX design',
    'Contentful CMS',
    'Arduino',
    'LLM/AI',
  ],
  experience: [
    {
      title: 'Graphic Designer & Website Developer',
      company: 'Freelance',
      duration: '2020 – Present',
      description: [
        'Designed, developed, and deployed over 20 responsive business sites, portfolios, and ecommerce sites using React.js, Next.js, Astro, and Svelte.',
        'Optimized website performance by optimizing assets and lazy loading resulting in 90+ Google Lighthouse scores (Google’s performance testing tool).',
        'Handled over $10,000 in secure ecommerce payments for 100+ transactions with custom Shopify themes, headless Shopify stores, Stripe JavaScript SDK, and Lemon Squeezy API.',
      ],
      location: 'Remote',
    },
    {
      title: 'Student Ambassador',
      company: 'The Browser Company of New York',
      duration: 'September 2024 – Present',
      description: [
        'Represent and increase brand awareness for Arc, The Browser Company’s innovative web browser.',
        'Curate social media content, garnering 3,000 weekly views, and organize campus events to increase student adoption.',
        'Collect user feedback to contribute to product development and user experience improvements.',
      ],
      location: 'Remote',
    },
  ],
  projects: [
    {
      name: 'Artem Ecommerce Site',
      technologies: ['Next.js', 'Stripe API', 'TypeScript', 'Contentful CMS'],
      description: [
        'Generated 40+ weekly newsletter signups through strategic UX design and marketing integrations.',
        'Dynamic product and portfolio pages built around content imported from Contentful CMS.',
        'Secure payment processing using Stripe API and TypeScript types.',
        "Boosted client's revenue by 165% and generated 100+ monthly qualified leads.",
      ],
      link: null,
      duration: 'December 2023',
    },
    {
      name: 'Mountain Desert Career Pathways Hackathon',
      technologies: ['Next.js', 'Arduino', 'LLM/AI'],
      description: [
        'Led a team of 4 beginner-intermediate programmers to create a home energy tracking device to aid landlords and tenants in reducing energy waste, winning first place.',
        'Created a Next.js web application with authentication displaying real-time Arduino sensor data, featuring LLM/AI powered user consumption suggestions.',
      ],
      link: null,
      duration: 'February 2024',
    },
  ],
  certifications: [
    {
      name: 'CompTIA IT Fundamentals',
      platform: null,
      year: '2024',
      link: null,
    },
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
      title: '',
      company: '',
      duration: '',
      description: [],
      location: '',
    },
  ],
  projects: [
    {
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
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      description: z.array(z.string()),
      location: z.string(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      technologies: z.array(z.string()),
      description: z.array(z.string()),
      link: z.string(),
      duration: z.string(),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      platform: z.string(),
      year: z.string(),
      link: z.string(),
    })
  ),
});
