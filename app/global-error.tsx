"use client";

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <pre className="text-red-400 bg-gray-800 rounded p-4 mb-4 max-w-xl overflow-x-auto">{error.message}</pre>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
