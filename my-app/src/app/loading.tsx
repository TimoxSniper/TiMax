export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Bronze progress indicator - Editorial Modernism */}
        <div className="relative">
          <div className="w-16 h-16 rounded-[6px] border-4 border-secondary mx-auto">
            <div className="absolute inset-0 border-t-4 border-accent rounded-[6px] animate-spin" />
          </div>
        </div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Laden...
        </p>
      </div>
    </div>
  );
}
