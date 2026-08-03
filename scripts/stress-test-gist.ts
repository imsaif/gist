/**
 * Stress-test the gist.design thesis: does a `.gist` file actually improve
 * how LLMs describe a product, vs. (a) cold knowledge and (b) `llms.txt` alone?
 *
 * Tests two products (aiex, dwc) × two models (GPT-4o, Claude Sonnet) ×
 * three conditions (cold / llms.txt / llms.gist) × five rubric questions.
 * A judge model (Claude Haiku, temperature 0) scores each answer 0/1/2
 * against a written-by-the-user correct-answer key.
 *
 * What this DOES test: whether the `.gist` format helps when its content is
 * in the LLM's context. (The retrieval / discoverability question — whether
 * ChatGPT/Claude UIs actually fetch the file unprompted — has to be tested
 * manually in those UIs; the API can't simulate it honestly.)
 *
 * Run: `npx tsx scripts/stress-test-gist.ts`
 * Requires: OPENAI_API_KEY, ANTHROPIC_API_KEY in env (or .env.local).
 */

import { readFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const openai = new OpenAI();
const anthropic = new Anthropic();

const JUDGE_MODEL = 'claude-haiku-4-5-20251001';
const CLAUDE_MODEL = 'claude-sonnet-4-6';
const OPENAI_MODEL = 'gpt-4o-2024-11-20';

type Question = { q: string; correctAnswer: string };
type Product = {
  slug: 'aiex' | 'dwc';
  name: string;
  llmsTxtPath: string;
  llmsGistPath: string;
  questions: Question[];
};

const PRODUCTS: Product[] = [
  {
    slug: 'aiex',
    name: 'aiuxdesign.guide',
    llmsTxtPath: '/Users/imranmohammed/aiex/public/llms.txt',
    llmsGistPath: '/Users/imranmohammed/aiex/public/llms.gist',
    questions: [
      {
        q: 'What is the headline product on aiuxdesign.guide, and what sits behind it as depth?',
        correctAnswer:
          'The headline product is a free AI UX audit tool that scores screenshots of AI interfaces against 36 AI UX patterns. Behind it as depth: 36 pattern pages, a free Claude Code course for designers, a daily newsletter, and a toolkit.',
      },
      {
        q: 'How does the audit on aiuxdesign.guide work — what does the user upload, what does it return, and how long does it take?',
        correctAnswer:
          'The user uploads a screenshot of an AI interface (chatbot, code assistant, dashboard, agent, content generator). The audit returns a pattern-by-pattern score against 36 AI UX patterns (which patterns the design implements, partially implements, or is missing) plus a chat with an AI design mentor grounded in the findings. Completes in under 60 seconds. No signup, no account, free.',
      },
      {
        q: 'Who is aiuxdesign.guide explicitly NOT for, and what is it NOT?',
        correctAnswer:
          'Not for people looking for a generic UX audit (Hotjar, Maze, UI Auditor), a paid cohort course (Maven, Smashing, IxDF, Reforge), a Figma component kit / plugin / design system, or a screenshot gallery. It is not a pattern library hero (patterns are the depth, not the front door), not a paid course, not a Figma plugin, not a browser extension, and not affiliated with aiuxpatterns.com / shapeof.ai / aiverse.design.',
      },
      {
        q: 'How does aiuxdesign.guide differ from UI Auditor / UXLens, and how does it differ from Mobbin / Shape of AI / aiuxpatterns.com?',
        correctAnswer:
          'Differs from UI Auditor / UXLens: those are generic UX audits with no AI UX specificity; aiuxdesign.guide is pattern-grounded against 36 AI-specific patterns documented from real AI products. Differs from Mobbin / Shape of AI / aiuxpatterns.com: those are screenshot galleries or pattern catalogs; aiuxdesign.guide audits *your* design against documented patterns, names what is missing, and links to a course that teaches the skill.',
      },
      {
        q: 'Is the Claude Code course on aiuxdesign.guide free or paid, and how is it positioned relative to the audit tool?',
        correctAnswer:
          'Free and self-paced. Positioned as "the depth the audit recommends" — surfaced from audit findings, not the homepage hero. Explicitly not a paid cohort (not Maven, Smashing, IxDF, Reforge, Design+Code) and no certificate or fee.',
      },
    ],
  },
  {
    slug: 'dwc',
    name: 'designwithclaude.com (dwic)',
    llmsTxtPath: '/Users/imranmohammed/dwc/web/public/llms.txt',
    llmsGistPath: '/Users/imranmohammed/dwc/web/public/llms.gist',
    questions: [
      {
        q: 'What does "dwic" stand for, and how is it pronounced?',
        correctAnswer: 'dwic = d + wi + c = design with claude. Pronounced "dwick".',
      },
      {
        q: 'Is dwic a canvas or prototyping tool? What does it explicitly NOT do?',
        correctAnswer:
          'Not a canvas tool. It does not generate prototypes, screens, Figma frames, or design mockups. It is not a linter. It is not a generic "AI design assistant" with a chat box. It does not have a GUI.',
      },
      {
        q: 'What is the exact npx command to audit a project with dwic, with zero install required?',
        correctAnswer: 'npx @imrandwc/dwic audit',
      },
      {
        q: "What does the dwic CLI's exit code mean — 0, 1, and 2?",
        correctAnswer: '0 = clean (no findings), 1 = warns only, 2 = any error.',
      },
      {
        q: 'How does dwic relate to Claude Design, and how does it relate to the V1 free library at /library?',
        correctAnswer:
          'Claude Design handles the canvas (prototypes/screens); dwic handles the rigor/audit layer underneath — they are complements, not competitors. The V1 free library at /library is 41 role-based design specialists as Claude Code slash commands, separate from the V2 MCP auditor product and installable independently.',
      },
    ],
  },
];

function readLocal(path: string): string {
  return readFileSync(path, 'utf8');
}

function buildSystemPrompt(condition: string, fileContent: string | null): string {
  if (condition === 'cold') {
    return 'Answer based on what you already know. Do not browse the web. If you do not know, say so.';
  }
  return `Use the following product context as ground truth. Do not browse the web. If the context does not contain the answer, say so.\n\n--- PRODUCT CONTEXT (${condition}) ---\n${fileContent}\n--- END CONTEXT ---`;
}

async function askOpenAI(system: string, user: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  return res.choices[0]?.message?.content ?? '';
}

async function askClaude(system: string, user: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    temperature: 0,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const block = res.content[0];
  return block && block.type === 'text' ? block.text : '';
}

async function judge(
  question: string,
  correctAnswer: string,
  answer: string
): Promise<{ score: 0 | 1 | 2; reason: string }> {
  const prompt = `You are scoring an answer about a software product.

QUESTION: ${question}

CORRECT ANSWER (ground truth): ${correctAnswer}

CANDIDATE ANSWER: ${answer}

Score the candidate answer:
- 2 = correct and specific (matches the key facts of the ground truth)
- 1 = partially correct (some right, some wrong/missing/vague)
- 0 = wrong, hallucinated, or refused/empty

Reply with strict JSON only: {"score": 0|1|2, "reason": "<one sentence>"}`;

  const res = await anthropic.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 200,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = res.content[0];
  const text = block && block.type === 'text' ? block.text : '{}';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { score: 0, reason: 'judge returned no JSON' };
  try {
    const parsed = JSON.parse(match[0]);
    return { score: parsed.score as 0 | 1 | 2, reason: String(parsed.reason ?? '') };
  } catch {
    return { score: 0, reason: 'judge JSON parse failed' };
  }
}

type Result = {
  product: string;
  model: 'gpt-4o' | 'claude';
  condition: 'cold' | 'llms.txt' | 'llms.gist';
  question: string;
  answer: string;
  score: 0 | 1 | 2;
  reason: string;
};

async function run() {
  const results: Result[] = [];

  for (const product of PRODUCTS) {
    console.error(`\n=== Reading ${product.slug} files from disk ===`);
    const llmsTxt = readLocal(product.llmsTxtPath);
    const llmsGist = readLocal(product.llmsGistPath);
    console.error(`  llms.txt: ${llmsTxt.length} chars`);
    console.error(`  llms.gist: ${llmsGist.length} chars`);

    const conditions: Array<{ name: Result['condition']; content: string | null }> = [
      { name: 'cold', content: null },
      { name: 'llms.txt', content: llmsTxt },
      { name: 'llms.gist', content: llmsGist },
    ];

    for (const cond of conditions) {
      const system = buildSystemPrompt(cond.name, cond.content);
      for (const model of ['gpt-4o', 'claude'] as const) {
        for (const { q, correctAnswer } of product.questions) {
          process.stderr.write(`  [${product.slug}/${model}/${cond.name}] ${q.slice(0, 50)}... `);
          const answer =
            model === 'gpt-4o' ? await askOpenAI(system, q) : await askClaude(system, q);
          const { score, reason } = await judge(q, correctAnswer, answer);
          process.stderr.write(`${score}/2\n`);
          results.push({
            product: product.slug,
            model,
            condition: cond.name,
            question: q,
            answer,
            score,
            reason,
          });
        }
      }
    }
  }

  printScorecard(results);
  console.log('\n--- Full results (JSON) ---');
  console.log(JSON.stringify(results, null, 2));
}

function printScorecard(results: Result[]) {
  console.log('\n=== SCORECARD (sum of 5 questions, max 10) ===\n');
  const products = [...new Set(results.map((r) => r.product))];
  const models = ['gpt-4o', 'claude'] as const;
  const conditions = ['cold', 'llms.txt', 'llms.gist'] as const;

  for (const product of products) {
    console.log(`Product: ${product}`);
    console.log('                cold    llms.txt   llms.gist   lift (gist-cold)');
    for (const model of models) {
      const scores = conditions.map((c) =>
        results
          .filter((r) => r.product === product && r.model === model && r.condition === c)
          .reduce((sum, r) => sum + r.score, 0)
      );
      const [cold, llmsTxt, llmsGist] = scores as [number, number, number];
      const lift = llmsGist - cold;
      const arrow = lift > 0 ? `+${lift}` : `${lift}`;
      console.log(
        `  ${model.padEnd(8)}      ${cold}/10    ${llmsTxt}/10      ${llmsGist}/10        ${arrow}`
      );
    }
    console.log('');
  }

  console.log('Interpretation:');
  console.log('  - Large cold → llms.gist lift = format is doing work when fetched.');
  console.log(
    '  - Small llms.txt → llms.gist lift = the txt alone already covers it; gist adds little.'
  );
  console.log(
    '  - Large llms.txt → llms.gist lift = the structured .gist format is pulling its weight beyond plain txt.'
  );
  console.log(
    '  - cold ≈ llms.gist = format adds nothing on top of training-data knowledge (the April result for aiex).'
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
