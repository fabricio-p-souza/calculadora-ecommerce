import pardusLogo from "../assets/pardus-logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-baseline gap-2">
            <img src={pardusLogo} alt="Pardus" className="h-16 sm:h-20 w-auto" />
          </div>
        </div>
      </div>
    </header>
  );
}
