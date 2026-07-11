export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-baseline gap-2">
            <span className="brand-text text-2xl sm:text-3xl text-foreground">allomni</span>
            <span className="partner-text text-sm sm:text-base text-muted-foreground hidden sm:inline">
              e-commerce partner
            </span>
          </div>
          <span className="partner-text text-xs text-muted-foreground sm:hidden">
            e-commerce partner
          </span>
        </div>
      </div>
    </header>
  );
}
