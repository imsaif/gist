import type { RepoFiles } from '@/types/repo-audit';

const API = 'https://api.github.com';
const MAX_README_CHARS = 20_000;
const MAX_PATHS = 400;

export class GitHubError extends Error {
  constructor(
    message: string,
    public kind: 'not_found' | 'rate_limited' | 'network'
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export function parseRepoUrl(input: unknown): { owner: string; repo: string } | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim().replace(/\/+$/, '');
  const url = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/);
  const short = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  const m = url ?? short;
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function mapStatus(status: number): GitHubError {
  if (status === 404) return new GitHubError('Repository not found', 'not_found');
  if (status === 403 || status === 429) return new GitHubError('GitHub rate limit', 'rate_limited');
  return new GitHubError(`GitHub returned ${status}`, 'network');
}

export async function fetchRepoFiles(owner: string, repo: string): Promise<RepoFiles> {
  const base = `${API}/repos/${owner}/${repo}`;

  const readmeRes = await fetch(`${base}/readme`, {
    headers: { ...headers(), Accept: 'application/vnd.github.raw' },
  }).catch(() => {
    throw new GitHubError('Could not reach GitHub', 'network');
  });
  if (!readmeRes.ok && readmeRes.status !== 404) throw mapStatus(readmeRes.status);
  const readme = readmeRes.ok
    ? (
        await readmeRes.text().catch(() => {
          throw new GitHubError('Could not read GitHub response', 'network');
        })
      ).slice(0, MAX_README_CHARS)
    : null;

  const pkgRes = await fetch(`${base}/contents/package.json`, {
    headers: { ...headers(), Accept: 'application/vnd.github.raw' },
  }).catch(() => null);
  let packageDescription: string | null = null;
  if (pkgRes && pkgRes.ok) {
    try {
      packageDescription = JSON.parse(await pkgRes.text()).description ?? null;
    } catch {
      packageDescription = null;
    }
  }

  const treeRes = await fetch(`${base}/git/trees/HEAD?recursive=1`, { headers: headers() }).catch(
    () => {
      throw new GitHubError('Could not reach GitHub', 'network');
    }
  );
  if (!treeRes.ok) throw mapStatus(treeRes.status);
  const tree = (await treeRes.json().catch(() => {
    throw new GitHubError('Could not parse GitHub response', 'network');
  })) as { tree?: Array<{ path: string; type: string }> };
  const filePaths = (tree.tree ?? [])
    .filter((n) => n.type === 'blob')
    .map((n) => n.path)
    .slice(0, MAX_PATHS);

  return { owner, repo, readme, packageDescription, filePaths };
}
