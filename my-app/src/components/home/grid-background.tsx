"use client";

export function GridBackground() {
  return (
    <>
      {/* Light mode grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.15] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      {/* Dark mode grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.2] hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255, 255, 255) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255, 255, 255) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
    </>
  );
}

