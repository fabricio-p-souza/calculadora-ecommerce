import { useState, type FormEvent } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface LeadFormProps {
  onFormSuccess: () => void;
}

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_REGEX = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9À-ÖØ-öø-ÿ-]+(\.[a-zA-Z0-9À-ÖØ-öø-ÿ-]+)+(\/[^\s]*)?$/;

// Remove tudo que não for letra/espaço enquanto o usuário digita
const formatarNome = (valor: string): string => valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "");

// Aplica a máscara brasileira de telefone conforme o usuário digita
const formatarTelefone = (valor: string): string => {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
};

export function LeadForm({ onFormSuccess }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erro, setErro] = useState("");
  // Honeypot: campo invisível para humanos. Se vier preenchido, é bot.
  const [empresaHoneypot, setEmpresaHoneypot] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Bot detectado: encerra silenciosamente sem gravar lead nem disparar Pixel.
    if (empresaHoneypot) {
      onFormSuccess();
      return;
    }

    const whatsappDigitos = whatsapp.replace(/\D/g, "");
    const valido =
      NAME_REGEX.test(name.trim()) &&
      EMAIL_REGEX.test(email.trim()) &&
      SITE_REGEX.test(website.trim()) &&
      (whatsappDigitos.length === 10 || whatsappDigitos.length === 11);

    if (!valido) {
      setErro("Confira os campos: nome, e-mail, site e WhatsApp precisam estar no formato correto.");
      return;
    }
    setErro("");

    window.fbq?.("track", "Lead");

    const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      const body = new URLSearchParams({
        nome: name,
        email,
        site: website,
        whatsapp,
        faturamento: "",
        origem: "calculadora-pardus",
        page_url: window.location.href,
      });
      fetch(webhookUrl, { method: "POST", mode: "no-cors", body }).catch(() => {});
    }

    onFormSuccess();
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="section-container grid gap-10 lg:grid-cols-2 items-start">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            A <span className="text-gradient">Black Friday</span> não vai salvar um
            planejamento ruim.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Descubra quanto o seu e-commerce precisa crescer em faturamento, pedidos e
            tráfego para aproveitar os meses mais importantes de 2026.
          </p>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </span>
              <span>Entenda se a sua meta de faturamento é realmente alcançável.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </span>
              <span>
                Descubra se o foco da sua estratégia deve ser em tráfego, conversão ou
                ticket médio.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </span>
              <span>
                Tome decisões baseadas em dados e chegue mais preparado para a Black
                Friday e o fim do ano.
              </span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-foreground mb-2">Como funciona</p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Informe o faturamento dos seus últimos 3 meses.</li>
              <li>Defina sua meta de faturamento para o restante do ano.</li>
              <li>Receba um plano com os indicadores necessários para atingir sua meta.</li>
            </ol>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-card border border-border rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Acesse a calculadora de crescimento
            </h2>
            <p className="text-muted-foreground mb-6">
              Preencha seus dados para receber o acesso à calculadora e começar a testar
              cenários para o seu e-commerce.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nome*
                </label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(formatarNome(e.target.value))}
                  pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}"
                  title="Digite apenas letras"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                  Link do Site*
                </label>
                <input
                  id="website"
                  type="text"
                  className="input-field"
                  placeholder="www.sualoja.com.br"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value.replace(/\s/g, ""))}
                  pattern="(https?:\/\/)?(www\.)?[a-zA-Z0-9À-ÖØ-öø-ÿ-]+(\.[a-zA-Z0-9À-ÖØ-öø-ÿ-]+)+(\/[^\s]*)?"
                  title="Digite um endereço de site válido, ex: sualoja.com.br"
                  required
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp*
                </label>
                <input
                  id="whatsapp"
                  type="text"
                  inputMode="tel"
                  className="input-field"
                  placeholder="(11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatarTelefone(e.target.value))}
                  pattern="\(\d{2}\) \d{4,5}-\d{4}"
                  title="Digite um telefone válido com DDD"
                  required
                />
              </div>

              {/* Honeypot anti-bot: invisível e fora do fluxo de tab para humanos */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="empresa">Empresa</label>
                <input
                  id="empresa"
                  type="text"
                  name="empresa"
                  tabIndex={-1}
                  autoComplete="off"
                  value={empresaHoneypot}
                  onChange={(e) => setEmpresaHoneypot(e.target.value)}
                />
              </div>

              {erro && (
                <p className="text-sm text-center" style={{ color: "rgb(220,38,38)" }}>
                  {erro}
                </p>
              )}
              <button type="submit" className="btn-primary w-full">
                Acesse a calculadora!
              </button>

              <p className="text-sm text-center" style={{ color: "rgb(150,150,150)" }}>
                Prometemos não utilizar suas informações de contato para enviar qualquer
                tipo de SPAM.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
