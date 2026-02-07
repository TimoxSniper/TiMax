export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        {/* Bronze progress indicator - Editorial Modernism */}
        <div className="relative">
          <div className="border-secondary mx-auto h-16 w-16 rounded-[6px] border-4">
            <div className="border-accent absolute inset-0 animate-spin rounded-[6px] border-t-4" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Laden...
        </p>
      </div>
    </div>
  );
}
