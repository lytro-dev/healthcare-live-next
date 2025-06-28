import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition"
      >
        Go Home
      </a>
    </div>
  );
} 