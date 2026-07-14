import { useState } from "react";

interface CalculatorProps {
  onReset: () => void;
}

interface Resultado {
  faturamentoAlvo: number;
  pedidosTrimestre: number;
  pedidosMeta: number;
  sessoesTrimestre: number;
  sessoesMeta: number;
  crescimentoSessoesPercent: number;
  metaCrescimentoPercent: number;
  faturamentoMensalAtual: number;
  faturamentoMensalMeta: number;
  crescimentoMensalPercent: number;
  sessoesMensalAtual: number;
  sessoesMensalMeta: number;
  crescimentoSessoesMensalPercent: number;
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
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    // Sem vírgula, pontos em grupos de 3 dígitos: separador de milhar (ex: "90.000")
    limpo = limpo.replace(/\./g, "");
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
  const [faturamentoTrimestre, setFaturamentoTrimestre] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [taxaConversao, setTaxaConversao] = useState("");
  const [metaFaturamento, setMetaFaturamento] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");

  const calcular = () => {
    const faturamento = paraNumero(faturamentoTrimestre);
    const ticket = paraNumero(ticketMedio);
    const conversao = paraNumero(taxaConversao);
    const meta = paraNumero(metaFaturamento);

    if (faturamento <= 0 || ticket <= 0 || conversao <= 0 || meta <= 0) {
      setErro("Preencha todos os campos com valores maiores que zero para calcular.");
      setResultado(null);
      return;
    }
    setErro("");

    const taxaConversaoDecimal = conversao / 100;
    const metaCrescimentoPercent = ((meta - faturamento) / faturamento) * 100;
    const pedidosTrimestre = faturamento / ticket;
    const pedidosMeta = meta / ticket;
    const sessoesTrimestre = pedidosTrimestre / taxaConversaoDecimal;
    const sessoesMeta = pedidosMeta / taxaConversaoDecimal;
    const crescimentoSessoesPercent = ((sessoesMeta - sessoesTrimestre) / sessoesTrimestre) * 100;

    const faturamentoMensalAtual = faturamento / 3;
    const faturamentoMensalMeta = meta / 5;
    const crescimentoMensalPercent =
      ((faturamentoMensalMeta - faturamentoMensalAtual) / faturamentoMensalAtual) * 100;

    const sessoesMensalAtual = sessoesTrimestre / 3;
    const sessoesMensalMeta = sessoesMeta / 5;
    const crescimentoSessoesMensalPercent =
      ((sessoesMensalMeta - sessoesMensalAtual) / sessoesMensalAtual) * 100;

    setResultado({
      faturamentoAlvo: meta,
      pedidosTrimestre,
      pedidosMeta,
      sessoesTrimestre,
      sessoesMeta,
      crescimentoSessoesPercent,
      metaCrescimentoPercent,
      faturamentoMensalAtual,
      faturamentoMensalMeta,
      crescimentoMensalPercent,
      sessoesMensalAtual,
      sessoesMensalMeta,
      crescimentoSessoesMensalPercent,
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
                <label htmlFor="faturamento-trimestre" className="block text-sm font-medium text-foreground mb-2">
                  Faturamento dos últimos 3 meses (R$)
                </label>
                <input
                  id="faturamento-trimestre"
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 90000"
                  value={faturamentoTrimestre}
                  onChange={(e) => setFaturamentoTrimestre(e.target.value)}
                  onFocus={(e) => setFaturamentoTrimestre(paraEdicao(e.target.value))}
                  onBlur={(e) => setFaturamentoTrimestre(finalizarMoeda(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="ticket-medio" className="block text-sm font-medium text-foreground mb-2">
                  Ticket médio atual (R$)
                </label>
                <input
                  id="ticket-medio"
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
                <label htmlFor="taxa-conversao" className="block text-sm font-medium text-foreground mb-2">
                  Taxa de conversão atual (%)
                </label>
                <input
                  id="taxa-conversao"
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
                <label htmlFor="meta-faturamento" className="block text-sm font-medium text-foreground mb-2">
                  Meta de faturamento até dezembro (R$)
                </label>
                <input
                  id="meta-faturamento"
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Ex: 650000"
                  value={metaFaturamento}
                  onChange={(e) => setMetaFaturamento(e.target.value)}
                  onFocus={(e) => setMetaFaturamento(paraEdicao(e.target.value))}
                  onBlur={(e) => setMetaFaturamento(finalizarMoeda(e.target.value))}
                />
              </div>
            </div>

            <div className="text-center">
              <button onClick={calcular} className="btn-primary w-full sm:w-auto">
                Calcular
              </button>
              {erro && (
                <p className="mt-4 text-sm text-primary font-medium">{erro}</p>
              )}
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
                      {formatarMoeda(resultado.faturamentoAlvo)}
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos estimados últimos 3 meses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.pedidosTrimestre)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Pedidos necessários para meta</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarInteiro(resultado.pedidosMeta)}{" "}
                      <span className="text-base font-normal">pedidos</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões estimadas últimas 3 meses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatarInteiro(resultado.sessoesTrimestre)}{" "}
                      <span className="text-base font-normal">sessões</span>
                    </p>
                  </div>
                  <div className="result-card">
                    <p className="text-sm text-muted-foreground mb-1">Sessões necessárias até dezembro</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarInteiro(resultado.sessoesMeta)}{" "}
                      <span className="text-base font-normal">sessões</span>
                    </p>
                  </div>
                  <div className="result-card bg-primary/10 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      Crescimento total do período
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
                      {formatarMoeda(resultado.faturamentoAlvo)}
                    </span>{" "}
                    (crescimento de{" "}
                    <span className="font-semibold text-primary">
                      {formatarPercentual(resultado.metaCrescimentoPercent)}%
                    </span>{" "}
                    sobre os últimos 3 meses), seu e-commerce precisa gerar cerca de{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.pedidosMeta)} pedidos
                    </span>{" "}
                    e alcançar em torno de{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.sessoesMeta)} sessões
                    </span>{" "}
                    até dezembro, mantendo a mesma taxa de conversão atual.
                  </p>
                  <p className="text-foreground leading-relaxed mt-4">
                    Nos últimos 3 meses, seu e-commerce faturou em média{" "}
                    <span className="font-semibold text-primary">
                      {formatarMoeda(resultado.faturamentoMensalAtual)}
                    </span>{" "}
                    por mês. Para atingir sua meta, você precisa faturar cerca de{" "}
                    <span className="font-semibold text-primary">
                      {formatarMoeda(resultado.faturamentoMensalMeta)}
                    </span>{" "}
                    por mês até dezembro, um crescimento de{" "}
                    <span className="font-semibold text-primary">
                      {formatarPercentual(resultado.crescimentoMensalPercent)}%
                    </span>{" "}
                    ao mês.
                  </p>
                  <p className="text-foreground leading-relaxed mt-4">
                    Em sessões, você teve em média{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.sessoesMensalAtual)} sessões
                    </span>{" "}
                    por mês nos últimos 3 meses. Para atingir sua meta, você precisa chegar a cerca de{" "}
                    <span className="font-semibold text-primary">
                      {formatarInteiro(resultado.sessoesMensalMeta)} sessões
                    </span>{" "}
                    por mês até dezembro, um crescimento de{" "}
                    <span className="font-semibold text-primary">
                      {formatarPercentual(resultado.crescimentoSessoesMensalPercent)}%
                    </span>{" "}
                    ao mês.
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
