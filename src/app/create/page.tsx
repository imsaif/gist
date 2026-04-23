'use client';

import { useEffect } from 'react';

// The /create page is no longer used — gap fixing happens inline on the homepage.
// Redirect to home if someone lands here directly.
export default function CreateMode() {
  useEffect(() => {
    window.location.href = '/';
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-ink-tertiary">Redirecting...</div>
    </div>
  );
}
