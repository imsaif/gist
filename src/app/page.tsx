import Link from 'next/link';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ViewfinderCircleIcon,
  NoSymbolIcon,
  DocumentIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import HowItWorks from '@/components/HowItWorks';

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 md:py-20">
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">{children}</h2>;
}

export default function Home() {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero area with gradient background */}
      <div className="hero-gradient-bg relative">
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
          <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/spec"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Spec
            </Link>
            <Link
              href="/audit"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Audit
            </Link>
            <Link
              href="/create"
              className="text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
            >
              Create
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          {/* Hero */}
          <section className="pt-24 pb-28 md:pt-32 md:pb-36">
            <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Fix how AI describes your product
            </h2>
            <p className="text-text-primary mb-8 max-w-xl text-xl leading-relaxed">
              Run a free audit to see how ChatGPT, Claude, and Perplexity describe your product.
              Then fix the gaps with a{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-[0.9em]">
                gist.design
              </code>{' '}
              file.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/audit"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-colors"
              >
                Run free audit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Why gist.design */}
      <div className="relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="ambient-orb top-1/4 -left-32 h-96 w-96 bg-indigo-500/[0.06]" />
        <div className="ambient-orb -right-24 bottom-1/4 h-80 w-80 bg-purple-500/[0.05]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">
            Why gist.design
          </h2>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            AI tools can read your code but not the decisions behind it. They fill gaps with
            competitor patterns, generic defaults, and wrong positioning.{' '}
            <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
              gist.design
            </code>{' '}
            is a structured markdown file that captures design decisions, interaction rationale,
            product positioning, and explicit boundaries. AI coding tools read it to build features
            that match design intent. LLMs read it to give accurate recommendations instead of
            guessing from training data.
          </p>
          <div className="glass-strong overflow-hidden rounded-2xl">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ExclamationTriangleIcon className="text-text-secondary h-4 w-4" />
                      Without gist.design
                    </span>
                  </th>
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheckIcon className="text-accent-primary h-4 w-4" />
                      What prevents it
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  {
                    failure:
                      'AI coding tool builds auto-execute when you designed for user approval',
                    fix: 'Design Decisions: "chose X over Y because Z"',
                  },
                  {
                    failure:
                      'AI fills gaps with competitor patterns your product deliberately avoids',
                    fix: 'Not This: explicit boundaries on what this is not',
                  },
                  {
                    failure: 'LLM recommends your product to the wrong audience',
                    fix: "Positioning: who it's for and who it's not for",
                  },
                  {
                    failure: 'LLM describes your product as a clone of a competitor',
                    fix: 'Positioning: vs comparisons with honest differences',
                  },
                ].map((row) => (
                  <tr key={row.failure}>
                    <td className="text-text-primary px-5 py-3.5">{row.failure}</td>
                    <td className="text-text-secondary px-5 py-3.5">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How it works — step process */}
      <HowItWorks />

      <div className="relative mx-auto max-w-6xl overflow-hidden px-6">
        {/* Integrations */}
        <Section id="integrations">
          {/* Ambient orb */}
          <div className="ambient-orb top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 bg-indigo-500/[0.05]" />
          <SectionHeading>Integrations</SectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Cursor',
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
                  </svg>
                ),
                instruction: (
                  <>
                    <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-xs">@Docs</code> →
                    Add new doc → paste your gist.design URL
                  </>
                ),
              },
              {
                name: 'Claude Code',
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
                  </svg>
                ),
                instruction: (
                  <>
                    Add to CLAUDE.md: &ldquo;Read /gist.design before implementing UI changes&rdquo;
                  </>
                ),
              },
              {
                name: 'GitHub Copilot',
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                ),
                instruction: <>Place file in repo root</>,
              },
              {
                name: 'ChatGPT',
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                  </svg>
                ),
                instruction: <>Paste URL or upload file for accurate product recommendations</>,
              },
            ].map((tool) => (
              <div
                key={tool.name}
                className="glass rounded-2xl p-5 transition-colors hover:border-white/[0.12] hover:bg-[rgba(26,29,39,0.6)]"
              >
                <div className="text-text-secondary mb-3">{tool.icon}</div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">{tool.name}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{tool.instruction}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Principles */}
        <Section id="principles">
          {/* Ambient orbs */}
          <div className="ambient-orb top-1/3 -left-20 h-80 w-80 bg-purple-500/[0.06]" />
          <div className="ambient-orb -right-16 bottom-1/4 h-72 w-72 bg-indigo-500/[0.05]" />
          <SectionHeading>Principles</SectionHeading>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            What makes a gist.design file actually useful to AI tools.
          </p>

          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Top-left: Decisions over descriptions */}
            <div className="glass overflow-hidden rounded-2xl md:col-span-5">
              <div className="glass-subtle relative flex h-64 flex-col items-center justify-center gap-3 overflow-hidden p-6">
                {/* Decorative glow */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.15) 0%, transparent 70%)',
                  }}
                />
                {/* Mock decision items */}
                <div className="relative z-10 flex w-full max-w-[280px] flex-col gap-2.5">
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <ScaleIcon className="text-accent-primary h-5 w-5 shrink-0" />
                    <span className="text-text-primary text-sm font-medium">Chose X over Y</span>
                    <svg
                      className="text-accent-primary ml-auto h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 opacity-40 backdrop-blur-sm">
                    <div className="h-5 w-5 shrink-0 rounded bg-white/[0.08]" />
                    <span className="text-text-secondary text-sm">The button is blue</span>
                    <svg
                      className="text-text-tertiary ml-auto h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <ScaleIcon className="text-accent-primary h-5 w-5 shrink-0" />
                    <span className="text-text-primary text-sm font-medium">Because Z matters</span>
                    <svg
                      className="text-accent-primary ml-auto h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-primary mb-2 text-xl font-semibold">
                  Decisions over descriptions
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  &ldquo;We chose X over Y because Z&rdquo; is useful. &ldquo;The button is
                  blue&rdquo; is not.
                </p>
              </div>
            </div>

            {/* Top-right: Specific over generic */}
            <div className="glass overflow-hidden rounded-2xl md:col-span-7">
              <div className="glass-subtle relative flex h-64 items-center justify-center overflow-hidden p-6">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.15) 0%, transparent 70%)',
                  }}
                />
                {/* Floating badge elements */}
                <div className="relative z-10 flex items-center gap-6">
                  {/* Specific example */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <ViewfinderCircleIcon className="text-accent-primary h-4 w-4" />
                        <span className="text-text-primary text-xs font-semibold">Specific</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-accent-primary/20 text-accent-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          High
                        </span>
                        <span className="text-text-secondary rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px]">
                          Med
                        </span>
                        <span className="text-text-tertiary rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px]">
                          Low
                        </span>
                      </div>
                      <p className="text-text-secondary mt-2 max-w-[160px] text-[10px] leading-relaxed">
                        3-tier badge next to each suggestion
                      </p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="text-text-tertiary flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium">vs</span>
                  </div>
                  {/* Generic example */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 opacity-40 backdrop-blur-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-white/[0.08]" />
                        <span className="text-text-secondary text-xs font-semibold">Generic</span>
                      </div>
                      <div className="h-2 w-24 rounded-full bg-white/[0.06]" />
                      <p className="text-text-tertiary mt-2 max-w-[160px] text-[10px] leading-relaxed">
                        &ldquo;uses confidence visualization&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-primary mb-2 text-xl font-semibold">
                  Specific over generic
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  &ldquo;Confidence scores appear as a 3-tier badge next to each suggestion,&rdquo;
                  not &ldquo;uses confidence visualization.&rdquo;
                </p>
              </div>
            </div>

            {/* Bottom-left: Negative space matters */}
            <div className="glass overflow-hidden rounded-2xl md:col-span-4">
              <div className="glass-subtle relative flex h-56 flex-col items-center justify-center gap-2.5 overflow-hidden p-6">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.12) 0%, transparent 70%)',
                  }}
                />
                <div className="relative z-10 flex w-full max-w-[220px] flex-col gap-2">
                  <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <NoSymbolIcon className="h-4 w-4 shrink-0 text-red-400/70" />
                    <span className="text-text-secondary text-xs line-through">Auto-execute</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <NoSymbolIcon className="h-4 w-4 shrink-0 text-red-400/70" />
                    <span className="text-text-secondary text-xs line-through">
                      Competitor pattern
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <NoSymbolIcon className="h-4 w-4 shrink-0 text-red-400/70" />
                    <span className="text-text-secondary text-xs line-through">
                      Generic defaults
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-primary mb-2 text-xl font-semibold">
                  Negative space matters
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  What the product is NOT is as important as what it is. The Not This section
                  prevents AI tools from filling gaps with competitor patterns.
                </p>
              </div>
            </div>

            {/* Bottom-center: One file per feature */}
            <div className="glass overflow-hidden rounded-2xl md:col-span-4">
              <div className="glass-subtle relative flex h-56 items-center justify-center overflow-hidden p-6">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.12) 0%, transparent 70%)',
                  }}
                />
                <div className="relative z-10 flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                  {/* File tree mock */}
                  <div className="text-text-tertiary flex items-center gap-2 text-xs">
                    <span className="text-text-secondary font-medium">/</span>
                  </div>
                  <div className="text-text-tertiary flex items-center gap-2 pl-3 text-xs">
                    <svg
                      className="h-3.5 w-3.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>
                    <span>features/</span>
                  </div>
                  <div className="flex items-center gap-2 pl-8 text-xs">
                    <DocumentIcon className="text-accent-primary h-3.5 w-3.5 shrink-0" />
                    <span className="text-accent-primary font-medium">auth.gist.design</span>
                  </div>
                  <div className="flex items-center gap-2 pl-8 text-xs">
                    <DocumentIcon className="text-accent-primary h-3.5 w-3.5 shrink-0" />
                    <span className="text-accent-primary font-medium">search.gist.design</span>
                  </div>
                  <div className="flex items-center gap-2 pl-8 text-xs">
                    <DocumentIcon className="text-accent-primary h-3.5 w-3.5 shrink-0" />
                    <span className="text-accent-primary font-medium">checkout.gist.design</span>
                  </div>
                  <div className="text-text-tertiary flex items-center gap-2 pl-3 text-xs">
                    <DocumentIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>gist.design</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-primary mb-2 text-xl font-semibold">
                  One file per feature
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  A product might have multiple gist.design files, one for each significant feature.
                  Keeps each file focused and contextually useful.
                </p>
              </div>
            </div>

            {/* Bottom-right: Generated, not written */}
            <div className="glass overflow-hidden rounded-2xl md:col-span-4">
              <div className="glass-subtle relative flex h-56 items-center justify-center overflow-hidden p-6">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.12) 0%, transparent 70%)',
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {/* Chat bubble mock */}
                  <div className="bg-msg-user-bg rounded-2xl rounded-br-sm px-4 py-2.5">
                    <span className="text-msg-user-text text-xs">
                      We chose approval over auto-execute...
                    </span>
                  </div>
                  {/* Arrow down */}
                  <SparklesIcon className="text-accent-primary h-6 w-6" />
                  {/* Generated file mock */}
                  <div className="w-full max-w-[200px] rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                    <div className="mb-1 flex items-center gap-1.5">
                      <DocumentIcon className="text-accent-primary h-3 w-3" />
                      <span className="text-accent-primary text-[10px] font-semibold">
                        .gist.design
                      </span>
                    </div>
                    <div className="mb-1 h-1.5 w-full rounded-full bg-white/[0.06]" />
                    <div className="mb-1 h-1.5 w-3/4 rounded-full bg-white/[0.06]" />
                    <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-primary mb-2 text-xl font-semibold">
                  Generated, not written
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  If designers have to author this file manually, it won&apos;t happen. The
                  conversation tool handles the format; the designer handles the thinking.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Reference */}
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 py-16 md:py-20">
        {/* Ambient orb */}
        <div className="ambient-orb top-1/2 right-0 h-72 w-72 -translate-y-1/2 bg-purple-500/[0.05]" />
        <h2 className="text-text-primary mb-8 text-3xl font-bold tracking-tight">Reference</h2>
        <div className="glass-strong overflow-hidden rounded-2xl">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                <th className="text-text-primary px-5 py-3.5 text-left font-semibold">Topic</th>
                <th className="text-text-primary px-5 py-3.5 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              <tr>
                <td className="text-text-primary px-5 py-3.5 font-medium">robots.txt</td>
                <td className="text-text-secondary px-5 py-3.5">
                  Crawlers &mdash; What can you access?
                </td>
              </tr>
              <tr>
                <td className="text-text-primary px-5 py-3.5 font-medium">sitemap.xml</td>
                <td className="text-text-secondary px-5 py-3.5">
                  Search engines &mdash; What pages exist?
                </td>
              </tr>
              <tr>
                <td className="text-text-primary px-5 py-3.5 font-medium">
                  <a
                    href="https://llmstxt.org"
                    className="text-text-primary hover:text-accent-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    llms.txt
                  </a>
                </td>
                <td className="text-text-secondary px-5 py-3.5">
                  LLMs &mdash; What content matters?
                </td>
              </tr>
              <tr className="bg-accent-primary/[0.08]">
                <td className="text-accent-primary px-5 py-3.5 font-semibold">gist.design</td>
                <td className="text-text-primary px-5 py-3.5 font-medium">
                  AI coding tools + LLMs &mdash; How does it work, why, and when should you
                  recommend it?
                </td>
              </tr>
              <tr>
                <td className="text-text-primary px-5 py-3.5 font-medium">File placement</td>
                <td className="text-text-secondary px-5 py-3.5">
                  <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">
                    /gist.design
                  </code>{' '}
                  in the project root, or{' '}
                  <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">
                    /features/[name]/gist.design
                  </code>{' '}
                  for multi-feature products
                </td>
              </tr>
              <tr>
                <td className="text-text-primary px-5 py-3.5 font-medium">Spec</td>
                <td className="text-text-secondary px-5 py-3.5">
                  Open for community input. Pattern research at{' '}
                  <a
                    href="https://aiuxdesign.guide"
                    className="text-accent-primary hover:text-accent-hover transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aiuxdesign.guide
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-16 md:pb-20">
        {/* Ambient orb */}
        <div className="ambient-orb top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/[0.06]" />
        <div className="glass rounded-2xl border border-white/[0.08] p-8 text-center">
          <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">
            Start with an audit
          </h2>
          <p className="text-text-secondary mx-auto max-w-lg text-lg leading-relaxed">
            Find out what AI tools get wrong about your product. Takes 30 seconds, costs nothing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/audit"
              className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-colors"
            >
              Run free audit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/create"
              className="text-text-secondary hover:text-text-primary text-base font-medium transition-colors"
            >
              or skip to file creation
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span className="text-text-tertiary text-sm">gist.design · 2026</span>
          <span className="text-text-tertiary text-sm">
            Powered by{' '}
            <a
              href="https://aiuxdesign.guide"
              className="text-text-secondary hover:text-text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              aiuxdesign.guide
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
