import { useState } from "react";

interface CalculatorProps {
  onReset: () => void;
}

interface Resultado {
  faturamentoAlvo2026: number;
  pedidos2025: number;
  pedidos2026: number;
  sessoes2025: number;
  sessoes2026: number;
  crescimentoSessoesPercent: number;
  metaCrescimentoPercent: number;
}

const parseNumero = (valor: string): number => {
  const limpo = valor.replace(/\s/g, "").replace(",", ".");
  return parseFloat(limpo) || 0;
};

const formatarMoeda = (valor: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

const formatarInteiro = (valor: number): string =>
  new Intl.NumberFormat("pt-BR").format(Math.ceil(valor));

const formatarPercentual = (valor: number): string => valor.toFixed(1).replace(".", ",");

export function Calculator({ onReset }: CalculatorProps) {
  const [faturamento2025, setFaturamento2025] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [taxaConversao, setTaxaConversao] = useState("");
  const [metaFaturamento2026, setMetaFaturamento2026] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const calcular = () => {
    const faturamento = parseNumero(faturamento2025);
    const ticket = parseNumero(ticketMedio);
    const conversao = parseNumero(taxaConversao);
    const meta = parseNumero(metaFaturamento2026);

    if (faturamento <= 0 || ticket <= 0 || conversao <= 0 || meta <= 0) return;

    const taxaConversaoDecimal = conversao / 100;
    const metaCrescimentoPercent = ((meta - faturamento) / faturamento) * 100;
    const pedidos2025 = faturamento / ticket;
    const pedidos2026 = meta / ticket;
    const sessoes2025 = pedidos2025 / taxaConversaoDecimal;
    const sessoes2026 = pedidos2026 / taxaConversaoDecimal;
    const crescimentoSessoesPercent = ((sessoes2026 - sessoes2025) / sessoes2025) * 100;

    setResultado({
      faturamentoAlvo2026: meta,
      pedidos2025,
      pedidos2026,
      sessoes2025,
      sessoes2026,
      crescimentoSessoesPercent,
      metaCrescimentoPercent,
    });
  };

  return (
    <section id="calculadora" className="py-12 sm:py-20 lg:py-28 bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                2
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Simule o plano de crescimento do seu e-commerce em{" "}
                <span className="text-gradient">2026</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Agora que já temos seus dados, use a calculadora abaixo para entender
              quanto seu e-commerce precisa crescer em faturamento, pedidos e sessões
              para atingir sua meta em 2026.
            </p>
            <button
              onClick={onReset}
              className="mt-4 text-sm text-muted-foreground underline hover:text-foreground transition-colors"
            >
              ← Voltar ao formulário
            </button>
          </div>

          <div className="card-elevated p-6 sm:p-8 lg:p-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Faturamento de 2025 (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 500000"
                  value={faturamento2025}
                  onChange={(e) => setFaturamento2025(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ticket médio atual (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 250"
                  value={ticketMedio}
                  onChange={(e) => setTicketMedio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Taxa de conversão atual (%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 1,5"
                  value={taxaConversao}
                  onChange={(e) => setTaxaConversao(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta de faturamento para 2026 (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 650000"
                  value={metaFaturamento2026}
                  onChange={(e) => setMetaFaturamento2026(e.target.value)}
                />
              </div>
            </div>

            <div className="text-center">
              <button onClick={calcular} className="btn-primary w-full sm:w-auto">
                Calcular meu 2026
              </button>
            </div>

            {resultado && (
              <div className="mt-10 pt-10 border-t border-border animate-fade-in">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                  Seu plano de crescimento para 2026
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Faturamento alvo em 2026</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarMoeda(resultado.faturamentoAlvo2026)}
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos estimados em 2025</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.pedidos2025)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos necessários em 2026</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarInteiro(resultado.pedidos2026)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões estimadas em 2025</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.sessoes2025)}{" "}
                      <span className="text-base font-normal">sessões</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões necessárias em 2026</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarInteiro(resultado.sessoes2026)}{" "}
                      <span className="text-base font-normal">sessões</span>
                    </p>
                  </div>
                  <div className="result-card bg-primary/10 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      Crescimento de sessões necessário
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      +{formatarPercentual(resultado.crescimentoSessoesPercent)}%
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                  <p className="text-foreground leading-relaxed">
                    Para atingir sua meta de faturamento de{" "}
                    <span className="font-semibold text-primary">
                      {formatarMoeda(resultado.faturamentoAlvo2026)}
                    </span>{" "}
                    em 2026 (crescimento de{" "}
                    <span className="font-semibold text-primary">
                      {formatarPercentual(resultado.metaCrescimentoPercent)}%
                    </span>
                    ), seu e-commerce precisa gerar cerca de{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.pedidos2026)} pedidos
                    </span>{" "}
                    e alcançar em torno de{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.sessoes2026)} sessões
                    </span>{" "}
                    no ano, mantendo a mesma taxa de conversão atual.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
