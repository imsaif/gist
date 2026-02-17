interface BeforeAfterProps {
  before: string;
  after: string;
}

export function BeforeAfter({ before, after }: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="border-border-light rounded-xl border bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            Before
          </span>
          <span className="text-text-tertiary text-xs">Without gist.design</span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{before}</p>
      </div>

      <div className="border-border-light rounded-xl border bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            After
          </span>
          <span className="text-text-tertiary text-xs">With gist.design</span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{after}</p>
      </div>
    </div>
  );
}
