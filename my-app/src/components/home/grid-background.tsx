"use client";

export function GridBackground() {
  return (
    <div 
      className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        color: 'currentColor'
      }}
      aria-hidden="true"
    />
  );
}

