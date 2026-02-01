"use client";

export function GridBackground() {
  return (
    <>
      {/* Clean background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-background" 
        aria-hidden="true" 
      />
      

      
      {/* Sehr subtiler Grid - Light Mode */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
      
      {/* Sehr subtiler Grid - Dark Mode */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255, 255, 255) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255, 255, 255) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
    </>
  );
}
