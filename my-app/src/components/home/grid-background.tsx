"use client";

export function GridBackground() {
  return (
    <>
      {/* Mehrschichtige Schwarz-Weiß Gradient Hintergründe für Light Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:hidden" aria-hidden="true" />
      {/* Zusätzlicher radialer Gradient für mehr Tiefe - Light Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-radial from-transparent via-gray-100/30 to-gray-200/50 dark:hidden" aria-hidden="true" />
      {/* Zusätzlicher linearer Gradient von oben - Light Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/50 via-transparent to-gray-100/50 dark:hidden" aria-hidden="true" />
      
      {/* Mehrschichtige Schwarz-Weiß Gradient Hintergründe für Dark Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-black via-gray-950 to-gray-900 hidden dark:block" aria-hidden="true" />
      {/* Zusätzlicher radialer Gradient für mehr Tiefe - Dark Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-radial from-transparent via-gray-950/40 to-gray-900/60 hidden dark:block" aria-hidden="true" />
      {/* Zusätzlicher linearer Gradient von oben - Dark Mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900/40 hidden dark:block" aria-hidden="true" />
      
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

