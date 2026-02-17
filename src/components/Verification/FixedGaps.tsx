interface FixedGapsProps {
  fixedGaps: string[];
  remainingGaps: string[];
}

export function FixedGaps({ fixedGaps, remainingGaps }: FixedGapsProps) {
  return (
    <div className="border-border-light rounded-xl border bg-white p-5">
      <h4 className="text-text-primary mb-4 text-sm font-semibold">Verification Results</h4>

      {fixedGaps.length > 0 && (
        <div className="mb-4">
          <p className="text-text-tertiary mb-2 text-xs font-medium">Fixed</p>
          <ul className="space-y-2">
            {fixedGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-text-secondary text-sm">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {remainingGaps.length > 0 && (
        <div>
          <p className="text-text-tertiary mb-2 text-xs font-medium">Remaining</p>
          <ul className="space-y-2">
            {remainingGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                <span className="text-text-secondary text-sm">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
