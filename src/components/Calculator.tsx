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

// Converte o texto digitado livremente (com vírgula ou ponto decimal) em número
const paraNumero = (valor: string): number => {
  let limpo = valor.replace(/R\$\s?/g, "").replace(/%/g, "").trim();
  if (limpo.includes(",")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  }
  return parseFloat(limpo) || 0;
};

// Deixa o número visível para edição, sem símbolos, mantendo a vírgula decimal
const paraEdicao = (valor: string): string => {
  const numero = paraNumero(valor);
  if (!numero) return "";
  return numero.toString().replace(".", ",");
};

// Aplica a formatação final (R$ ou %) quando o campo perde o foco
const finalizarMoeda = (valor: string): string => {
  const numero = paraNumero(valor);
  if (!numero) return "";
  return formatarMoeda(numero);
};

const finalizarPercentual = (valor: string): string => {
  const numero = paraNumero(valor);
  if (!numero) return "";
  return `${numero.toString().replace(".", ",")}%`;
};

export function Calculator({ onReset }: CalculatorProps) {
  const [faturamento2025, setFaturamento2025] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [taxaConversao, setTaxaConversao] = useState("");
  const [metaFaturamento2026, setMetaFaturamento2026] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const calcular = () => {
    const faturamento = paraNumero(faturamento2025);
    const ticket = paraNumero(ticketMedio);
    const conversao = paraNumero(taxaConversao);
    const meta = paraNumero(metaFaturamento2026);

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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Simule o plano de{" "}
                <span className="text-gradient">crescimento</span> do seu e-commerce
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Agora que já temos seus dados, use a calculadora abaixo para entender
              quanto seu e-commerce precisa crescer em faturamento, pedidos e sessões
              para atingir suas metas.
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
                  Faturamento dos últimos 3 meses (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 90000"
                  value={faturamento2025}
                  onChange={(e) => setFaturamento2025(e.target.value)}
                  onFocus={(e) => setFaturamento2025(paraEdicao(e.target.value))}
                  onBlur={(e) => setFaturamento2025(finalizarMoeda(e.target.value))}
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
                  onFocus={(e) => setTicketMedio(paraEdicao(e.target.value))}
                  onBlur={(e) => setTicketMedio(finalizarMoeda(e.target.value))}
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
                  onFocus={(e) => setTaxaConversao(paraEdicao(e.target.value))}
                  onBlur={(e) => setTaxaConversao(finalizarPercentual(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta de faturamento até dezembro (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 650000"
                  value={metaFaturamento2026}
                  onChange={(e) => setMetaFaturamento2026(e.target.value)}
                  onFocus={(e) => setMetaFaturamento2026(paraEdicao(e.target.value))}
                  onBlur={(e) => setMetaFaturamento2026(finalizarMoeda(e.target.value))}
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
                  Seu plano de crescimento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Faturamento alvo</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarMoeda(resultado.faturamentoAlvo2026)}
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos estimados últimos 3 meses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.pedidos2025)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos necessários para meta</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarInteiro(resultado.pedidos2026)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões estimadas últimas 3 meses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.sessoes2025)}{" "}
                      <span className="text-base font-normal">sessões</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões necessárias até dezembro</p>
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
                    (crescimento de{" "}
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
                    até dezembro, mantendo a mesma taxa de conversão atual.
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
