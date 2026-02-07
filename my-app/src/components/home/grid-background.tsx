"use client";

export function GridBackground() {
  return (
    <>
      {/* Clean background */}
      <div className="bg-background pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* Sehr subtiler Grid - Light Mode */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Sehr subtiler Grid - Dark Mode */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden opacity-[0.04] dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255, 255, 255) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255, 255, 255) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
    </>
  );
}
