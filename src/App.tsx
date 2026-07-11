import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { LeadForm } from "./components/LeadForm";
import { Calculator } from "./components/Calculator";
import { InfoSection } from "./components/InfoSection";
import { Footer } from "./components/Footer";

function App() {
  const [calculadoraLiberada, setCalculadoraLiberada] = useState(false);

  useEffect(() => {
    const acessouAntes = sessionStorage.getItem("calculadoraAcessada");
    const viaHash = window.location.hash === "#calculadora";
    if (acessouAntes === "true" || viaHash) {
      setCalculadoraLiberada(true);
      sessionStorage.setItem("calculadoraAcessada", "true");
    }
  }, []);

  const liberarCalculadora = () => {
    sessionStorage.setItem("calculadoraAcessada", "true");
    setCalculadoraLiberada(true);
  };

  const voltarAoFormulario = () => {
    sessionStorage.removeItem("calculadoraAcessada");
    setCalculadoraLiberada(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {!calculadoraLiberada && <LeadForm onFormSuccess={liberarCalculadora} />}
        {calculadoraLiberada && <Calculator onReset={voltarAoFormulario} />}
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
