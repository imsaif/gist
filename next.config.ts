import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The short form the homepage shows: curl -fsSL llmsgist.org/i | bash
        // curl -L follows the 308, so the script still comes from the repo.
        source: '/i',
        destination: 'https://raw.githubusercontent.com/imsaif/gist/main/install.sh',
        permanent: true,
      },
      {
        // Kept so anything already pointing at the long form still resolves.
        source: '/install.sh',
        destination: 'https://raw.githubusercontent.com/imsaif/gist/main/install.sh',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
