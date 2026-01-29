"use client";

export function GridBackground() {
  return (
    <>
      {/* Schwarz-Weiß Gradient Hintergrund für Light Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:hidden" aria-hidden="true" />
      
      {/* Schwarz-Weiß Gradient Hintergrund für Dark Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-black via-gray-950 to-gray-900 hidden dark:block" aria-hidden="true" />
      
      {/* Light mode grid - etwas subtiler */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.08] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      {/* Dark mode grid - etwas subtiler */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.1] hidden dark:block"
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

