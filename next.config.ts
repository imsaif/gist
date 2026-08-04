import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Keeps the install command short enough to read in one line:
        //   curl -fsSL llmsgist.org/install.sh | bash
        // curl -L follows the 308, so the script still comes from the repo.
        source: '/install.sh',
        destination: 'https://raw.githubusercontent.com/imsaif/gist/main/install.sh',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
