export function Footer() {
  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="brand-text text-xl text-foreground">allomni</span>
            <span className="partner-text text-sm text-muted-foreground">
              e-commerce partner
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} allomni. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
