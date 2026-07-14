import pardusLogo from "../assets/pardus-logo.png";

export function Footer() {
  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <img src={pardusLogo} alt="Pardus" className="h-20 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pardus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
