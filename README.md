# Gist

> A thinking partner for designers. Think before you design.

Gist helps designers clarify what they're building, map user journeys, and capture design decisions — before opening Figma.

## What is Gist?

Gist is a conversational design tool that acts as a thinking partner. Instead of jumping straight into visual design, Gist helps you work through the thinking that should happen first:

- **Clarify your goals** — What are you actually trying to solve?
- **Map user journeys** — What does the user experience look like step by step?
- **Capture decisions** — Why did you make the choices you made?

## Three Modes

### Brief Mode

Quick clarification before you design. Answer a few questions and walk away with a clear design brief — goal, context, decisions, and a ready-to-design prompt.

### Map Mode

Walk through user journeys step by step. Build a flow map with states (happy path, empty, error, loading) and surface relevant UX patterns for each step.

### Rationale Mode

Capture and defend your design decisions. Document what you decided, why, and what alternatives you rejected. Perfect for stakeholder presentations.

## Features

- **AI-Powered Conversations** — Powered by Claude to ask the right questions and challenge assumptions
- **Pattern Library** — 28 proven AI/UX patterns surfaced contextually during conversation
- **Export Ready** — Download your brief, map, or rationale as markdown
- **Mock Mode** — Test locally without an API key

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (optional for mock mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/imsaif/gist.git
cd gist

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Required for AI features (optional if using mock mode)
ANTHROPIC_API_KEY=your_api_key_here

# Set to 'true' to use mock responses (no API key needed)
MOCK_MODE=true
```

### Development

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see Gist.

## Usage

1. **Choose a mode** from the landing page:
   - Brief — for quick clarification
   - Map — for user journey mapping
   - Rationale — for decision documentation

2. **Have a conversation** with the AI. It will ask questions to help you think through your design.

3. **Watch the artifact build** in the right panel as you talk. The brief, map, or rationale updates in real-time.

4. **Export when ready** — copy to clipboard or download as markdown.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude API (Anthropic)
- **Icons:** Heroicons

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── brief/page.tsx     # Brief mode
│   ├── map/page.tsx       # Map mode
│   ├── rationale/page.tsx # Rationale mode
│   └── api/chat/route.ts  # Chat API endpoint
├── components/
│   ├── Brief/             # Brief mode components
│   ├── DesignMap/         # Map mode components
│   ├── Rationale/         # Rationale mode components
│   └── Chat/              # Shared chat components
├── lib/
│   ├── constants.ts       # System prompts & initial states
│   ├── briefParser.ts     # Brief response parser
│   ├── designMapParser.ts # Map response parser
│   ├── rationaleParser.ts # Rationale response parser
│   └── patterns/          # UX pattern library
└── types/
    └── index.ts           # TypeScript definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Built with care for designers who think before they design.
