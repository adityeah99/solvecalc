import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topic = z.enum([
  'arithmetic',
  'fractions',
  'algebra',
  'geometry',
  'statistics',
  'probability',
  'trigonometry',
]);

// Articles: src/content/articles/<slug>.md -> /articles/<slug>
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    topic,
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    calculators: z.array(z.string()).default([]),
    quiz: topic.optional(),
    related: z.array(z.string()).default([]),
  }),
});

// Lessons: src/content/learn/<topic>.md -> /learn/<topic>
const learn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    topic,
    order: z.number(),
    calculators: z.array(z.string()).default([]),
    articles: z.array(z.string()).default([]),
  }),
});

// Quizzes: src/data/quizzes/<topic>.json -> /quizzes/<topic>
const quizzes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/quizzes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    topic,
    questions: z
      .array(
        z.object({
          id: z.string(),
          question: z.string(),
          options: z.array(z.string()).length(4),
          answer: z.number().int().min(0).max(3),
          explanation: z.string(),
        }),
      )
      .min(5),
  }),
});

// Blog: src/content/blog/<slug>.md -> /blog/<slug>
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(75),
    description: z.string().max(160),
    category: z.enum(['study-tips', 'for-parents', 'math-basics']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Illustration drawn on the post's cover (see components/BlogArt.astro).
    icon: z.enum(['notepad', 'lightbulb', 'spark', 'grid', 'family', 'target', 'magnifier']),
    // Cover tone, matching the palette tokens.
    tone: z.enum(['blue', 'hi', 'green', 'ink', 'red', 'lcd']),
    calculators: z.array(z.string()).default([]),
    articles: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

// Long-form calculator copy: src/data/calculator-content/<slug>.json
const calculatorContent = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/calculator-content' }),
  schema: z.object({
    intro: z.string(),
    formula: z.array(z.object({ label: z.string(), expr: z.string(), note: z.string().optional() })).min(1),
    howItWorks: z.array(z.string()).min(1),
    example: z.object({
      title: z.string(),
      problem: z.string(),
      steps: z.array(z.string()).min(2),
      answer: z.string(),
    }),
    mistakes: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
  }),
});

export const collections = { articles, learn, quizzes, calculatorContent, blog };
