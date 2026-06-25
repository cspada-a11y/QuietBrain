/* ===================================================================
 * QuietBrain — Portale Agenti Fisici (PAF)
 * File unico da incollare in v0.dev (o in app/page.tsx di un progetto
 * Next.js App Router). Dipende solo da `lucide-react` e Tailwind,
 * entrambi già presenti in v0.
 *
 * NOTA: la formula LEX,8h e la classificazione D.Lgs 81/08 art. 189 sono
 * INDICATIVE/DIMOSTRATIVE. Vanno sostituite con la routine Python reale
 * quando collegherete il backend. Stessa cosa per le professioni, i
 * download e l'esempio di database (segnaposto).
 * =================================================================== */
"use client";

import React from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Info,
  Gauge,
  BookOpen,
  Brain,
  HeartPulse,
  Database,
  ListFilter,
  FileSpreadsheet,
  Users,
  GraduationCap,
  Download,
  Mic,
  Volume2,
  ShieldCheck,
  X,
} from "lucide-react";

/* ============================ TEMA PAF ============================ */
const PAF = {
  red: "#C8102E", // logo istituzionale PÄF
  petrol: "#0E6E73", // accento istituzionale (petrolio)
  petrolDark: "#0A5358",
  green: "#16A34A", // classe BASSA / evidenza ALTA
  amber: "#D97706", // classe MEDIA / evidenza MEDIA
  orange: "#EA580C", // classe ALTA / alert / evidenza BASSA
  redClass: "#DC2626", // classe MOLTO ALTA
  line: "#E2E8F0",
  ink: "#0F172A",
};

/* ====================== TIPI E NAVIGAZIONE ======================= */
type Screen =
  | "home"
  | "categorie"
  | "selezionaLavoro"
  | "lavoratoriMenu"
  | "candidati"
  | "areaOperativa"
  | "simIntro"
  | "sforzoVocale"
  | "usoDPI"
  | "selezionaDPI"
  | "compilaCampi"
  | "outputSimulatore"
  | "esploraDati"
  | "effettiDiretti"
  | "effettiIndiretti"
  | "qualitaEvidenze"
  | "espertiMenu"
  | "espertiEsplora"
  | "domandeEsperti"
  | "ricercatoriLogin"
  | "creaAccount"
  | "ricercatoriMenu"
  | "flowchartDatabase"
  | "caricaDati";

const SIM = "Simulatore di esposizione al rumore soggettiva";

const TRAIL: Record<Screen, string> = {
  home: "HOME",
  categorie: "HOME / Categorie",
  selezionaLavoro: "Categorie / Lavoratori e pensionati / Seleziona lavoro",
  lavoratoriMenu: "Categorie / Lavoratori e pensionati",
  candidati: "… / Lavoratori e pensionati / Candidati",
  areaOperativa: "… / Lavoratori e pensionati / Area operativa",
  simIntro: "… / Area operativa / " + SIM,
  sforzoVocale: "… / Simulatore / Sforzo vocale",
  usoDPI: "… / Simulatore / Uso dei DPI",
  selezionaDPI: "… / Simulatore / Selezione DPI (banca dati PAF)",
  compilaCampi: "… / Simulatore / Dati esposizione",
  outputSimulatore: "… / Simulatore / Risultato",
  esploraDati: "… / Area operativa / Esplora dati",
  effettiDiretti: "… / Esplora dati / Effetti diretti",
  effettiIndiretti: "… / Esplora dati / Effetti indiretti",
  qualitaEvidenze: "… / Esplora dati / Qualità delle evidenze",
  espertiMenu: "Categorie / Esperti",
  espertiEsplora: "Categorie / Esperti / Esplora dati",
  domandeEsperti: "Categorie / Esperti / Domande d'interesse",
  ricercatoriLogin: "Categorie / Ricercatori ed enti / Accedi",
  creaAccount: "Categorie / Ricercatori ed enti / Crea account",
  ricercatoriMenu: "Categorie / Ricercatori ed enti",
  flowchartDatabase: "… / Ricercatori ed enti / Scarica e consulta i dati",
  caricaDati: "… / Ricercatori ed enti / Carica i tuoi dati",
};

type Nav = { go: (s: Screen) => void };

/* ====================== COMPONENTI DI BASE ====================== */
/** Parola chiave evidenziata in grassetto col colore istituzionale. */
function Kw({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold" style={{ color: PAF.petrolDark }}>{children}</strong>;
}

/** Riquadro di avviso arancione con icona di pericolo. */
function AlertBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      className="flex gap-3 rounded-lg border p-4 text-sm leading-relaxed"
      style={{ borderColor: PAF.orange, background: "#FFF7ED", color: "#7C2D12" }}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: PAF.orange }} />
      <div>
        {title && <div className="mb-1 font-bold" style={{ color: PAF.orange }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-xl font-extrabold tracking-tight" style={{ color: PAF.ink }}>
      {children}
    </h2>
  );
}

function PrimaryButton({
  children,
  onClick,
  full,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 ${full ? "w-full" : ""}`}
      style={{ background: PAF.petrol }}
    >
      {children}
    </button>
  );
}

/** Card di navigazione (servizio) con icona. */
function ServiceCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}>
        {icon}
      </span>
      <div>
        <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>{title}</div>
        <p className="mt-1 text-xs text-slate-500">{desc}</p>
      </div>
      <ChevronRight size={18} className="ml-auto mt-1 shrink-0 text-slate-300" />
    </button>
  );
}

/** Modale generica (pop-up). */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-base font-extrabold" style={{ color: PAF.petrol }}>{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}

/* ============================ CHROME ============================ */
function PortalChrome() {
  return (
    <div className="w-full text-white" style={{ background: PAF.red }}>
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded font-black" style={{ background: "white", color: PAF.red }}>PÄF</span>
          <span className="text-sm font-bold">Portale Agenti Fisici</span>
        </div>
        <nav className="hidden gap-5 text-sm opacity-90 sm:flex">
          <span>Rumore</span>
          <span>Banche dati</span>
          <span>Calcolatori</span>
          <span className="rounded bg-white/15 px-2 py-0.5 font-semibold">QuietBrain</span>
        </nav>
      </div>
    </div>
  );
}

function AppHeader({ onHome }: { onHome: () => void }) {
  return (
    <button onClick={onHome} className="flex w-full items-center gap-3 border-x border-b-0 border-slate-200 bg-white px-6 py-4 text-left">
      <span className="grid h-9 w-9 place-items-center rounded font-black text-white" style={{ background: PAF.red }}>PÄF</span>
      <div>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">QuietBrain</span>
        <span className="ml-2 align-middle text-xs font-medium" style={{ color: PAF.petrol }}>
          proteggi la tua mente dal rumore in ambito lavorativo
        </span>
      </div>
      {/* Loghi partner: segnaposto. Sostituisci con i loghi reali. */}
      <span className="ml-auto hidden text-[10px] text-slate-300 sm:block">EDUCA · INAIL · CNR · Fondazione Santa Lucia</span>
    </button>
  );
}

function Breadcrumb({ screen, onBack, canBack }: { screen: Screen; onBack: () => void; canBack: boolean }) {
  return (
    <div className="flex items-center gap-3 border-x border-slate-200 bg-slate-50 px-6 py-2.5 text-xs text-slate-500">
      {canBack && (
        <button onClick={onBack} className="flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-slate-600 hover:bg-slate-200">
          <ArrowLeft size={13} /> Indietro
        </button>
      )}
      <span className="truncate italic">{TRAIL[screen]}</span>
    </div>
  );
}

/* ====================== MOTORE SIMULATORE ======================= */
/* INDICATIVO — sostituire con la routine Python ufficiale (NESI). */
type Classe = { nome: string; color: string; descrizione: string };

function classeDa(lex: number): Classe {
  if (lex < 80) return { nome: "BASSA", color: PAF.green, descrizione: "Sotto il valore inferiore di azione (80 dB(A))." };
  if (lex < 85) return { nome: "MEDIA", color: PAF.amber, descrizione: "Tra il valore inferiore (80) e superiore (85) di azione." };
  if (lex < 87) return { nome: "ALTA", color: PAF.orange, descrizione: "Tra il valore superiore di azione (85) e il valore limite (87)." };
  return { nome: "MOLTO ALTA", color: PAF.redClass, descrizione: "Pari o oltre il valore limite di esposizione (87 dB(A))." };
}

// Livello base in dB(A) inferito dallo sforzo vocale (Nesi, Guest 2018, indicativo)
const LIVELLO_SFORZO: Record<string, number> = {
  normale: 70,
  alzato: 78,
  "molto alzato": 85,
  grido: 92,
};

function calcolaLex(input: {
  sforzo: string;
  oreGiorno: number;
  usaDPI: boolean;
  attenuazioneDPI: number; // attenuazione nominale dB
  proporzioneDPI: number; // 0..1 quota di tempo con DPI indossati
}) {
  const L = LIVELLO_SFORZO[input.sforzo] ?? 78;
  const norm = 10 * Math.log10(Math.max(0.1, input.oreGiorno) / 8);
  const lexSenza = L + norm;

  // Modello energetico indicativo: media tra frazione protetta e non protetta
  const p = Math.min(1, Math.max(0, input.proporzioneDPI));
  const Lprot = L - input.attenuazioneDPI;
  const energiaMedia = p * Math.pow(10, Lprot / 10) + (1 - p) * Math.pow(10, L / 10);
  const Lcon = 10 * Math.log10(energiaMedia) + norm;

  return {
    lexSenza: Math.round(lexSenza * 10) / 10,
    lexCon: Math.round(Lcon * 10) / 10,
  };
}

/* ===================== BANCA DATI DPI (PAF) ===================== */
/* Struttura come la banca dati DPI-u del PAF: tipologia, marca, modello,
 * SNR e metodo HML (H/M/L). ESEMPI segnaposto: sostituire con le voci
 * reali della banca dati DPI del Portale. */
type DPI = { tipo: string; marca: string; modello: string; snr: number; h: number; m: number; l: number };
const BANCA_DPI: DPI[] = [
  { tipo: "Cuffia", marca: "Esempio", modello: "EM-30", snr: 30, h: 33, m: 28, l: 21 },
  { tipo: "Cuffia", marca: "Esempio", modello: "EM-25", snr: 25, h: 28, m: 22, l: 16 },
  { tipo: "Inserto espandibile", marca: "Esempio", modello: "IE-37", snr: 37, h: 36, m: 34, l: 33 },
  { tipo: "Inserto preformato", marca: "Esempio", modello: "IP-25", snr: 25, h: 27, m: 22, l: 19 },
  { tipo: "Inserto preformato", marca: "Esempio", modello: "IP-28", snr: 28, h: 30, m: 25, l: 21 },
  { tipo: "Archetto", marca: "Esempio", modello: "AR-23", snr: 23, h: 25, m: 20, l: 17 },
];

/* ===================== STUDI LETTERATURA ======================== */
type Q = "ALTA" | "MEDIA" | "BASSA";
const colQ = (q: Q) => (q === "ALTA" ? PAF.green : q === "MEDIA" ? PAF.amber : PAF.orange);

const STUDI_DIRETTI: Record<"cronica" | "temporanea", { autore: string; anno: number; titolo: string; sintesi: string; q: Q }[]> = {
  cronica: [
    {
      autore: "Cheng et al.",
      anno: 2019,
      titolo: "Esposizione cronica al rumore occupazionale e funzioni esecutive",
      sintesi:
        "Studio di coorte su lavoratori esposti cronicamente a rumore occupazionale: l'esposizione cumulata si associa a una riduzione delle prestazioni nelle funzioni esecutive e nella velocità di elaborazione, con effetto dose-dipendente rispetto al LEX,8h cumulato.",
      q: "ALTA",
    },
    {
      autore: "Esempio et al.",
      anno: 2020,
      titolo: "Esposizione cronica e memoria episodica",
      sintesi: "Evidenza di un'associazione tra esposizione cronica e declino della memoria episodica, di entità moderata.",
      q: "MEDIA",
    },
  ],
  temporanea: [
    {
      autore: "Esempio et al.",
      anno: 2021,
      titolo: "Esposizione temporanea e attenzione",
      sintesi: "Effetti transitori del rumore acuto sull'attenzione sostenuta, con recupero alla cessazione dell'esposizione.",
      q: "BASSA",
    },
  ],
};

const EFFETTI_INDIRETTI = [
  "Stress fisiologico",
  "Disturbi del sonno",
  "Aumento della pressione arteriosa",
  "Malattie cardiovascolari",
  "Alterazioni dell'umore",
  "Ridotta qualità della comunicazione",
  "Affaticamento e ridotta concentrazione",
];

/* ===================== DOMANDE ESPERTI ========================= */
const DOMANDE_ESPERTI = [
  {
    q: "I diversi livelli di esposizione discriminano tra presenza e assenza di perdita uditiva?",
    calcolo:
      "Il sistema confronta i soggetti del database stratificati per classe di LEX,8h (BASSA / MEDIA / ALTA / MOLTO ALTA) rispetto alla variabile audiometrica «perdita uditiva (sì/no)», calcolando proporzioni per gruppo e un test di associazione (chi-quadrato) sulle frequenze osservate.",
  },
  {
    q: "L'esposizione discrimina tra punteggi sopra e sotto il cut-off dei test cognitivi?",
    calcolo:
      "Per ciascun test cognitivo il database confronta la distribuzione del LEX,8h tra chi è sopra e chi è sotto il cut-off clinico, riportando medie, deviazioni standard e un test di confronto tra gruppi (t-test / Mann-Whitney secondo la distribuzione).",
  },
  {
    q: "Esiste una relazione dose-risposta tra esposizione cumulata e neuroimaging?",
    calcolo:
      "Il sistema mette in relazione l'esposizione cumulata (LEX,8h × anni) con gli indici di neuroimaging tramite un modello di regressione, riportando coefficiente, intervallo di confidenza e qualità del fit.",
  },
];

/* =================== MENU ESPLORA ESPERTI ====================== */
const MENU_ESPERTI = [
  { id: "pop", label: "Popolazione", voci: ["Lavoratori esposti", "Pensionati", "Gruppo di controllo"] },
  { id: "demo", label: "Dati demografici", voci: ["Età", "Sesso", "Scolarità"] },
  { id: "psico", label: "Dati psicometrici", voci: ["Funzioni esecutive", "Memoria", "Attenzione"] },
  { id: "audio", label: "Dati audiometrici", voci: ["Soglia tonale", "Perdita uditiva", "Acufeni"] },
  { id: "neuro", label: "Dati di neuroimaging", voci: ["Volumetria", "Sostanza bianca", "Connettività"] },
];

/* ============================================================== */
/* ============================ APP ============================= */
/* ============================================================== */
export default function QuietBrainApp() {
  const [screen, setScreen] = React.useState<Screen>("home");
  const [history, setHistory] = React.useState<Screen[]>([]);

  // Stato simulatore
  const [professione, setProfessione] = React.useState("");
  const [sforzo, setSforzo] = React.useState("");
  const [usaDPI, setUsaDPI] = React.useState<boolean | null>(null);
  const [dpiSelezionato, setDpiSelezionato] = React.useState<DPI | null>(null);
  const [proporzioneDPI, setProporzioneDPI] = React.useState(50); // % tempo d'uso DPI
  const [oreGiorno, setOreGiorno] = React.useState(8);
  const [anni, setAnni] = React.useState(10);

  const nav: Nav = {
    go: (s) => {
      setHistory((h) => [...h, screen]);
      setScreen(s);
    },
  };
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 py-6" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-3xl px-4">
        <PortalChrome />
        <AppHeader onHome={() => { setScreen("home"); setHistory([]); }} />
        <Breadcrumb screen={screen} onBack={back} canBack={history.length > 0} />
        <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white px-6 py-8 sm:px-10">
          <Router
            screen={screen}
            nav={nav}
            sim={{
              professione, setProfessione,
              sforzo, setSforzo,
              usaDPI, setUsaDPI,
              dpiSelezionato, setDpiSelezionato,
              proporzioneDPI, setProporzioneDPI,
              oreGiorno, setOreGiorno,
              anni, setAnni,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================ ROUTER =========================== */
type SimState = {
  professione: string; setProfessione: (v: string) => void;
  sforzo: string; setSforzo: (v: string) => void;
  usaDPI: boolean | null; setUsaDPI: (v: boolean) => void;
  dpiSelezionato: DPI | null; setDpiSelezionato: (v: DPI | null) => void;
  proporzioneDPI: number; setProporzioneDPI: (v: number) => void;
  oreGiorno: number; setOreGiorno: (v: number) => void;
  anni: number; setAnni: (v: number) => void;
};

function Router({ screen, nav, sim }: { screen: Screen; nav: Nav; sim: SimState }) {
  switch (screen) {
    case "home": return <Home nav={nav} />;
    case "categorie": return <Categorie nav={nav} />;
    case "selezionaLavoro": return <SelezionaLavoro nav={nav} sim={sim} />;
    case "lavoratoriMenu": return <LavoratoriMenu nav={nav} />;
    case "candidati": return <Candidati nav={nav} />;
    case "areaOperativa": return <AreaOperativa nav={nav} />;
    case "simIntro": return <SimIntro nav={nav} />;
    case "sforzoVocale": return <SforzoVocale nav={nav} sim={sim} />;
    case "usoDPI": return <UsoDPI nav={nav} sim={sim} />;
    case "selezionaDPI": return <SelezionaDPI nav={nav} sim={sim} />;
    case "compilaCampi": return <CompilaCampi nav={nav} sim={sim} />;
    case "outputSimulatore": return <OutputSimulatore nav={nav} sim={sim} />;
    case "esploraDati": return <EsploraDati nav={nav} />;
    case "effettiDiretti": return <EffettiDiretti nav={nav} />;
    case "effettiIndiretti": return <EffettiIndiretti />;
    case "qualitaEvidenze": return <QualitaEvidenze />;
    case "espertiMenu": return <EspertiMenu nav={nav} />;
    case "espertiEsplora": return <EspertiEsplora />;
    case "domandeEsperti": return <DomandeEsperti />;
    case "ricercatoriLogin": return <RicercatoriLogin nav={nav} />;
    case "creaAccount": return <CreaAccount nav={nav} />;
    case "ricercatoriMenu": return <RicercatoriMenu nav={nav} />;
    case "flowchartDatabase": return <FlowchartDatabase />;
    case "caricaDati": return <CaricaDati />;
    default: return null;
  }
}

/* ============================ HOME ============================ */
function Home({ nav }: { nav: Nav }) {
  return (
    <div className="text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: PAF.petrol }}>
        <Brain size={14} /> Rischio rumore e funzioni cognitive
      </span>
      <SectionTitle>QuietBrain</SectionTitle>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
        QuietBrain ti aiuta a comprendere il legame tra <Kw>esposizione al rumore occupazionale</Kw> e{" "}
        <Kw>declino cognitivo</Kw>. Puoi <Kw>esplorare le evidenze</Kw> scientifiche, <Kw>stimare la tua esposizione</Kw>{" "}
        e <Kw>contribuire alla ricerca</Kw>.
      </p>
      <div className="mx-auto mt-6 max-w-xl">
        <AlertBox title="Avvertenza">
          Gli output di QuietBrain hanno finalità <Kw>informativa e preventiva</Kw>, non certificativa, e{" "}
          <Kw>non sostituiscono una valutazione professionale</Kw> con strumentazione idonea.
        </AlertBox>
      </div>
      <div className="mt-7">
        <PrimaryButton onClick={() => nav.go("categorie")}>
          ACCEDI AI SERVIZI <ChevronRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ========================= CATEGORIE ========================= */
function Categorie({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Categorie di fruitori</SectionTitle>
      {/* Frase di raccordo richiesta */}
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        <Kw>Scegli la categoria a cui appartieni</Kw> per accedere ai servizi pensati per te.
      </p>
      <div className="mt-6 grid gap-3">
        <ServiceCard
          icon={<Users size={20} />}
          title="Lavoratori e pensionati"
          desc={<>Esplora le evidenze, <Kw>stima la tua esposizione</Kw> con il simulatore e candidati come volontario.</>}
          onClick={() => nav.go("selezionaLavoro")}
        />
        <ServiceCard
          icon={<GraduationCap size={20} />}
          title="Esperti"
          desc={<>Esplora i dati sperimentali e poni <Kw>domande d'interesse</Kw> al database.</>}
          onClick={() => nav.go("espertiMenu")}
        />
        <ServiceCard
          icon={<Database size={20} />}
          title="Ricercatori ed enti"
          desc={<>Scarica e consulta i dati, oppure <Kw>carica i tuoi dati</Kw> nel database condiviso.</>}
          onClick={() => nav.go("ricercatoriLogin")}
        />
      </div>
    </div>
  );
}

/* ===================== SELEZIONA LAVORO ====================== */
function SelezionaLavoro({ nav, sim }: { nav: Nav; sim: SimState }) {
  return (
    <div>
      <SectionTitle>Lavoratori e pensionati</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Indica la tua <Kw>professione</Kw> (attuale o passata). Verrà usata come riferimento per la
        stima dell'esposizione.
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <label className="mb-1 block text-xs font-semibold text-slate-500">Professione</label>
        <input
          value={sim.professione}
          onChange={(e) => sim.setProfessione(e.target.value)}
          placeholder="Es. operaio metalmeccanico"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
        />
        <p className="mt-1 text-[11px] text-slate-400">Classificazione ISTAT delle professioni (648 voci).</p>
        <div className="mt-5">
          <PrimaryButton full onClick={() => nav.go("lavoratoriMenu")}>
            Continua <ChevronRight size={16} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ===================== LAVORATORI MENU ====================== */
function LavoratoriMenu({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Cosa vuoi fare?</SectionTitle>
      <div className="mt-6 grid gap-3">
        <ServiceCard
          icon={<Gauge size={20} />}
          title="Area operativa"
          desc={<>Usa il <Kw>simulatore</Kw> di esposizione e <Kw>esplora</Kw> le evidenze della letteratura.</>}
          onClick={() => nav.go("areaOperativa")}
        />
        <ServiceCard
          icon={<HeartPulse size={20} />}
          title="Candidati"
          desc={<>Partecipa come volontario e <Kw>contribuisci alla ricerca</Kw>.</>}
          onClick={() => nav.go("candidati")}
        />
      </div>
    </div>
  );
}

/* ======================= AREA OPERATIVA ===================== */
function AreaOperativa({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Area operativa</SectionTitle>
      {/* Frase di raccordo richiesta */}
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Da qui puoi <Kw>esplorare</Kw> il simulatore per stimare la tua esposizione al rumore e,
        se vuoi partecipare alla ricerca, <Kw>candidarti</Kw> come volontario.
      </p>
      <div className="mt-6 grid gap-3">
        <ServiceCard
          icon={<Gauge size={20} />}
          title={SIM}
          desc={<>Stima il tuo <Kw>LEX,8h annuo</Kw> e la <Kw>classe di esposizione</Kw> a partire da pochi dati.</>}
          onClick={() => nav.go("simIntro")}
        />
        <ServiceCard
          icon={<BookOpen size={20} />}
          title="Esplora i dati della letteratura"
          desc={<>Effetti <Kw>diretti</Kw> e <Kw>indiretti</Kw> del rumore, con la qualità delle evidenze.</>}
          onClick={() => nav.go("esploraDati")}
        />
      </div>
    </div>
  );
}

/* ===================== SIM INTRO (Procedi) ================== */
function SimIntro({ nav }: { nav: Nav }) {
  const [popLex, setPopLex] = React.useState(false);
  const [popSforzo, setPopSforzo] = React.useState(false);
  return (
    <div>
      <span className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: PAF.orange }}>
        <Volume2 size={14} /> ESPOSIZIONE AL RUMORE SOGGETTIVA
      </span>
      <SectionTitle>Procedi alla simulazione</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Il simulatore è costruito a partire dalla <Kw>NESI</Kw> (Noise Exposure Structured Interview).
        Stima la tua esposizione partendo dallo <Kw>sforzo vocale</Kw> richiesto sul lavoro, usato come
        indicatore del <Kw>livello di rumore</Kw>. A partire da questi dati ottieni un{" "}
        <button onClick={() => setPopLex(true)} className="font-bold underline decoration-dotted underline-offset-2" style={{ color: PAF.petrol }}>
          LEX,8h
        </button>{" "}
        annuo stimato e la corrispondente <Kw>classe di esposizione</Kw>.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
        <div className="mb-1 flex items-center gap-2 font-bold" style={{ color: PAF.petrol }}>
          <Mic size={15} /> Definisci lo sforzo vocale richiesto
        </div>
        Lo sforzo vocale è lo sforzo necessario per farti capire mentre{" "}
        <Kw>parli con una persona a 1,2 m di distanza</Kw> nell'ambiente di lavoro: più devi alzare la
        voce, più alto è il rumore di fondo.{" "}
        <button onClick={() => setPopSforzo(true)} className="font-semibold underline" style={{ color: PAF.petrol }}>
          Cosa significa esattamente?
        </button>
        <div className="mt-1 text-[11px] italic text-slate-400">Rif.: Nesi, Guest (2018).</div>
      </div>

      <div className="mt-6">
        <PrimaryButton full onClick={() => nav.go("sforzoVocale")}>
          Inizia <ChevronRight size={16} />
        </PrimaryButton>
      </div>

      {popLex && (
        <Modal title="Che cos'è il LEX,8h?" onClose={() => setPopLex(false)}>
          <p>
            Il <Kw>LEX,8h</Kw> è il <Kw>livello di esposizione giornaliera al rumore normalizzato a 8 ore</Kw>,
            espresso in <Kw>dB(A)</Kw>. Rappresenta la media energetica del rumore a cui sei esposto in una
            giornata lavorativa tipo, riportata convenzionalmente a un turno di 8 ore così da poter
            confrontare situazioni con durate diverse.
          </p>
          <p className="mt-3">
            È il parametro su cui il <Kw>D.Lgs 81/08, art. 189</Kw> definisce i valori di azione e di limite
            dell'esposizione. La «A» indica la <Kw>ponderazione A</Kw>, che pesa le frequenze come le percepisce
            l'orecchio umano.
          </p>
        </Modal>
      )}
      {popSforzo && (
        <Modal title="Definizione di sforzo vocale" onClose={() => setPopSforzo(false)}>
          <p>
            Lo <Kw>sforzo vocale</Kw> indica quanto devi modulare e alzare la voce per essere compreso da
            un interlocutore posto a circa <Kw>1,2 m di distanza</Kw>. Viene usato come indicatore
            indiretto del livello di rumore di fondo: voce normale ≈ ambiente silenzioso, voce alzata o
            urlata ≈ ambiente molto rumoroso.
          </p>
          <p className="mt-3 text-[12px] italic text-slate-500">Riferimento bibliografico: Nesi, Guest (2018).</p>
        </Modal>
      )}
    </div>
  );
}

/* ===================== SFORZO VOCALE ======================== */
function SforzoVocale({ nav, sim }: { nav: Nav; sim: SimState }) {
  const opzioni = [
    { v: "normale", l: "Voce normale", d: "Conversazione tranquilla, nessuno sforzo." },
    { v: "alzato", l: "Voce alzata", d: "Devi alzare un po' la voce per farti capire." },
    { v: "molto alzato", l: "Voce molto alzata", d: "Devi parlare forte, quasi gridando." },
    { v: "grido", l: "Grido", d: "Devi gridare per essere compreso a 1,2 m." },
  ];
  return (
    <div>
      <SectionTitle>Sforzo vocale richiesto</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Quanto devi <Kw>alzare la voce</Kw> per farti capire da una persona a <Kw>1,2 m</Kw> di distanza
        nel tuo ambiente di lavoro?
      </p>
      <div className="mx-auto mt-6 grid max-w-md gap-2">
        {opzioni.map((o) => (
          <button
            key={o.v}
            onClick={() => sim.setSforzo(o.v)}
            className="flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition"
            style={{ borderColor: sim.sforzo === o.v ? PAF.petrol : PAF.line, background: sim.sforzo === o.v ? "#ECFDF5" : "#fff" }}
          >
            <span>
              <span className="font-bold">{o.l}</span>
              <span className="block text-xs text-slate-500">{o.d}</span>
            </span>
            {sim.sforzo === o.v && <ChevronRight size={16} style={{ color: PAF.petrol }} />}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-md">
        <PrimaryButton full onClick={() => nav.go("usoDPI")}>
          Continua <ChevronRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ======================= USO DPI =========================== */
function UsoDPI({ nav, sim }: { nav: Nav; sim: SimState }) {
  return (
    <div>
      <SectionTitle>Utilizzi i DPI uditivi?</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Indica se usi <Kw>dispositivi di protezione individuale</Kw> dell'udito (tappi, cuffie). Se sì,
        al passo successivo sceglierai il modello dalla <Kw>banca dati DPI del PAF</Kw>.
      </p>
      <div className="mx-auto mt-6 flex max-w-md gap-3">
        <button
          onClick={() => { sim.setUsaDPI(true); nav.go("selezionaDPI"); }}
          className="flex-1 rounded-lg border px-4 py-3 text-sm font-bold transition"
          style={{ borderColor: sim.usaDPI === true ? PAF.petrol : PAF.line, background: sim.usaDPI === true ? "#ECFDF5" : "#fff", color: sim.usaDPI === true ? PAF.petrol : PAF.ink }}
        >
          Sì
        </button>
        <button
          onClick={() => { sim.setUsaDPI(false); sim.setDpiSelezionato(null); nav.go("compilaCampi"); }}
          className="flex-1 rounded-lg border px-4 py-3 text-sm font-bold transition"
          style={{ borderColor: sim.usaDPI === false ? PAF.petrol : PAF.line, background: sim.usaDPI === false ? "#ECFDF5" : "#fff", color: sim.usaDPI === false ? PAF.petrol : PAF.ink }}
        >
          No
        </button>
      </div>
      <p className="mx-auto mt-4 max-w-md text-center text-xs text-slate-400">
        Scegli un'opzione per proseguire.
      </p>
    </div>
  );
}

/* =================== SELEZIONA DPI (banca dati PAF) ============== */
function SelezionaDPI({ nav, sim }: { nav: Nav; sim: SimState }) {
  const [q, setQ] = React.useState("");
  const [ordina, setOrdina] = React.useState<"snr" | "tipo" | "marca">("snr");

  const elenco = React.useMemo(() => {
    const f = BANCA_DPI.filter(
      (d) =>
        d.marca.toLowerCase().includes(q.toLowerCase()) ||
        d.modello.toLowerCase().includes(q.toLowerCase()) ||
        d.tipo.toLowerCase().includes(q.toLowerCase())
    );
    return [...f].sort((a, b) =>
      ordina === "snr" ? b.snr - a.snr : ordina === "tipo" ? a.tipo.localeCompare(b.tipo) : a.marca.localeCompare(b.marca)
    );
  }, [q, ordina]);

  const sel = sim.dpiSelezionato;

  return (
    <div>
      <span className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: PAF.petrol }}>
        <Database size={14} /> Banca dati DPI uditivi — PAF
      </span>
      <SectionTitle>Seleziona il dispositivo di protezione</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Cerca per <Kw>marca</Kw>, <Kw>modello</Kw> o <Kw>tipologia</Kw> e seleziona il tuo DPI. Per ogni
        dispositivo sono riportati l'indice <Kw>SNR</Kw> e i valori del metodo <Kw>HML</Kw> (H/M/L).
      </p>

      {/* barra ricerca + ordinamento, come la banca dati PAF */}
      <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca marca o modello…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
        />
        <select
          value={ordina}
          onChange={(e) => setOrdina(e.target.value as "snr" | "tipo" | "marca")}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
        >
          <option value="snr">Ordina per SNR</option>
          <option value="tipo">Ordina per tipologia</option>
          <option value="marca">Ordina per marca</option>
        </select>
      </div>

      {/* tabella dispositivi */}
      <div className="mx-auto mt-4 max-w-2xl overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <span className="col-span-4">Tipologia</span>
          <span className="col-span-3">Marca · Modello</span>
          <span className="col-span-2 text-center">SNR</span>
          <span className="col-span-3 text-center">H / M / L</span>
        </div>
        {elenco.map((d) => {
          const attivo = sel?.modello === d.modello && sel?.marca === d.marca;
          return (
            <button
              key={d.marca + d.modello}
              onClick={() => sim.setDpiSelezionato(d)}
              className="grid w-full grid-cols-12 items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm transition"
              style={{ background: attivo ? "#ECFDF5" : "#fff" }}
            >
              <span className="col-span-4 flex items-center gap-2 font-medium">
                <ShieldCheck size={15} style={{ color: attivo ? PAF.petrol : "#94a3b8" }} /> {d.tipo}
              </span>
              <span className="col-span-3 text-slate-600">{d.marca} · {d.modello}</span>
              <span className="col-span-2 text-center font-extrabold" style={{ color: PAF.petrol }}>{d.snr}</span>
              <span className="col-span-3 text-center text-xs text-slate-500">{d.h} / {d.m} / {d.l}</span>
            </button>
          );
        })}
        {elenco.length === 0 && (
          <div className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-400">
            Nessun dispositivo trovato. Modifica la ricerca o inserisci i valori manualmente nella procedura PAF.
          </div>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-2xl text-[11px] text-slate-400">
        Elenco dimostrativo: collegare la banca dati DPI reale del Portale Agenti Fisici.
      </p>

      {/* barra proporzione tempo d'uso DPI */}
      {sel && (
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: PAF.petrol }}>
            <ShieldCheck size={16} /> Proporzione di tempo di utilizzo dei DPI
          </div>
          <p className="mb-3 text-xs text-slate-500">
            Hai selezionato <Kw>{sel.marca} {sel.modello}</Kw> (SNR {sel.snr} dB). Per quale percentuale del
            tempo di esposizione lo indossi effettivamente?
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={sim.proporzioneDPI}
            onChange={(e) => sim.setProporzioneDPI(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: PAF.petrol }}
          />
          <div className="mt-1 text-right text-sm font-extrabold" style={{ color: PAF.petrol }}>{sim.proporzioneDPI}%</div>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-md">
        <PrimaryButton full onClick={() => nav.go("compilaCampi")}>
          Continua <ChevronRight size={16} />
        </PrimaryButton>
        {!sel && <p className="mt-2 text-center text-[11px] text-slate-400">Seleziona un dispositivo per applicarne l'attenuazione (altrimenti verrà usato un valore indicativo).</p>}
      </div>
    </div>
  );
}

/* ===================== COMPILA CAMPI ======================== */
function CompilaCampi({ nav, sim }: { nav: Nav; sim: SimState }) {
  return (
    <div>
      <SectionTitle>Dati di esposizione</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Inserisci la tua <Kw>storia lavorativa</Kw> per stimare l'esposizione cumulata.
      </p>
      <div className="mx-auto mt-6 grid max-w-md gap-4">
        <Campo label="Ore di esposizione al giorno" value={sim.oreGiorno} onChange={sim.setOreGiorno} min={0} max={16} suffix="ore" />
        <Campo label="Anni di esposizione" value={sim.anni} onChange={sim.setAnni} min={0} max={50} suffix="anni" />
        <PrimaryButton full onClick={() => nav.go("outputSimulatore")}>
          Calcola <Gauge size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
        />
        <span className="text-xs text-slate-400">{suffix}</span>
      </div>
    </div>
  );
}

/* ===================== OUTPUT SIMULATORE ==================== */
function OutputSimulatore({ nav, sim }: { nav: Nav; sim: SimState }) {
  const [popClassi, setPopClassi] = React.useState(false);
  const r = calcolaLex({
    sforzo: sim.sforzo || "alzato",
    oreGiorno: sim.oreGiorno,
    usaDPI: !!sim.usaDPI,
    attenuazioneDPI: sim.dpiSelezionato?.snr ?? 25, // SNR del dispositivo scelto dalla banca dati PAF
    proporzioneDPI: sim.proporzioneDPI / 100,
  });
  const classeSenza = classeDa(r.lexSenza);
  const classeCon = classeDa(r.lexCon);

  return (
    <div>
      <SectionTitle>Risultato della simulazione</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Stima del tuo <Kw>LEX,8h annuo</Kw> e della <Kw>classe di esposizione</Kw>
        {sim.professione ? <> per la professione: <Kw>{sim.professione}</Kw></> : null}.
      </p>

      {/* Due badge: senza attenuazione DPI / con attenuazione DPI */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CardLex titolo="Senza attenuazione DPI" lex={r.lexSenza} classe={classeSenza} />
        {sim.usaDPI ? (
          <CardLex titolo="Con attenuazione DPI" lex={r.lexCon} classe={classeCon} highlight />
        ) : (
          <div className="grid flex-1 place-items-center rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            Non hai indicato l'uso dei DPI: nessuna attenuazione applicata.
          </div>
        )}
      </div>

      {sim.usaDPI && (
        <p className="mt-3 text-center text-xs text-slate-500">
          {sim.dpiSelezionato ? <>Con <Kw>{sim.dpiSelezionato.marca} {sim.dpiSelezionato.modello}</Kw> (SNR {sim.dpiSelezionato.snr} dB), </> : null}
          indossati per il <Kw>{sim.proporzioneDPI}%</Kw> del tempo, l'esposizione si riduce di{" "}
          <Kw>{Math.max(0, Math.round((r.lexSenza - r.lexCon) * 10) / 10)} dB(A)</Kw>.
        </p>
      )}

      {/* Box classi di rischio → D.Lgs 81/08 art. 189 */}
      <button
        onClick={() => setPopClassi(true)}
        className="mt-6 flex w-full items-center justify-between rounded-lg border p-4 text-left text-sm transition hover:shadow-sm"
        style={{ borderColor: PAF.petrol, background: "#F0FDFA" }}
      >
        <span className="flex items-center gap-2 font-semibold" style={{ color: PAF.petrol }}>
          <Info size={16} /> Sei interessato a sapere quali sono le classi di rischio? Clicca qui
        </span>
        <ChevronRight size={16} style={{ color: PAF.petrol }} />
      </button>

      <div className="mt-5">
        <AlertBox title="Attenzione: risultato soggettivo">
          I livelli di rumore e la classe derivano da <Kw>stime soggettive</Kw> basate sulla tua percezione.
          La classe è attribuita secondo i criteri del <Kw>D.Lgs 81/08, art. 189</Kw>. Questi risultati{" "}
          <Kw>non derivano da misurazioni strumentali</Kw>: per una valutazione professionale rivolgiti a esperti.
        </AlertBox>
      </div>

      <div className="mt-6 text-center">
        <PrimaryButton onClick={() => nav.go("areaOperativa")}>Torna all'area operativa</PrimaryButton>
      </div>

      {popClassi && (
        <Modal title="Classi di rischio — D.Lgs 81/08, art. 189" onClose={() => setPopClassi(false)}>
          <p className="mb-3">
            Il <Kw>D.Lgs 81/08, art. 189</Kw> fissa, in funzione del LEX,8h, i valori di azione e il valore
            limite di esposizione al rumore:
          </p>
          <div className="grid gap-2">
            <ClasseRiga c={{ nome: "BASSA", color: PAF.green, descrizione: "LEX,8h < 80 dB(A) — sotto il valore inferiore di azione." }} />
            <ClasseRiga c={{ nome: "MEDIA", color: PAF.amber, descrizione: "80 ≤ LEX,8h < 85 dB(A) — tra valore inferiore e superiore di azione." }} />
            <ClasseRiga c={{ nome: "ALTA", color: PAF.orange, descrizione: "85 ≤ LEX,8h < 87 dB(A) — tra valore superiore di azione e valore limite." }} />
            <ClasseRiga c={{ nome: "MOLTO ALTA", color: PAF.redClass, descrizione: "LEX,8h ≥ 87 dB(A) — oltre il valore limite di esposizione." }} />
          </div>
          <div className="mt-4">
            <AlertBox>
              I valori riportati hanno scopo <Kw>informativo</Kw>. La classificazione di legge presuppone
              misurazioni strumentali eseguite da personale qualificato.
            </AlertBox>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CardLex({ titolo, lex, classe, highlight }: { titolo: string; lex: number; classe: Classe; highlight?: boolean }) {
  return (
    <div className="flex-1 rounded-lg border p-4" style={{ borderColor: highlight ? PAF.green : PAF.line, background: highlight ? "#F0FDF4" : "#fff" }}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titolo}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold" style={{ color: PAF.petrol }}>{lex.toFixed(1)}</span>
        <span className="text-sm font-bold text-slate-500">dB(A)</span>
      </div>
      <div className="mt-3">
        <span className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: classe.color }}>
          Classe {classe.nome}
        </span>
        <p className="mt-1.5 text-[11px] text-slate-500">{classe.descrizione}</p>
      </div>
    </div>
  );
}

function ClasseRiga({ c }: { c: Classe }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: c.color }}>{c.nome}</span>
      <span className="text-xs text-slate-600">{c.descrizione}</span>
    </div>
  );
}

/* ======================= ESPLORA DATI ====================== */
function EsploraDati({ nav }: { nav: Nav }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">
        Indaga gli effetti <Kw>diretti</Kw> e <Kw>indiretti</Kw> dell'esposizione al rumore. Ogni studio è
        accompagnato da un indicatore di <Kw>qualità delle evidenze</Kw>.
      </p>
      <ServiceCard
        icon={<Brain size={20} />}
        title="Effetti diretti dell'esposizione al rumore"
        desc={<>Esposizione <Kw>cronica</Kw> e <Kw>temporanea</Kw>, con la qualità delle evidenze per ciascuno studio.</>}
        onClick={() => nav.go("effettiDiretti")}
      />
      <ServiceCard
        icon={<HeartPulse size={20} />}
        title="Effetti indiretti dell'esposizione al rumore"
        desc={<>Categorie di effetti <Kw>mediati</Kw> da altre patologie, descritte dai dati aggregati delle evidenze.</>}
        onClick={() => nav.go("effettiIndiretti")}
      />
    </div>
  );
}

/* ====================== EFFETTI DIRETTI ==================== */
function EffettiDiretti({ nav }: { nav: Nav }) {
  const [tab, setTab] = React.useState<"cronica" | "temporanea">("cronica");
  const [idx, setIdx] = React.useState(0);
  const studi = STUDI_DIRETTI[tab];
  const studio = studi[idx] ?? studi[0];

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold">Effetti diretti dell'esposizione al rumore in ambiente lavorativo</h3>
      <div className="mb-4 flex gap-2 text-sm">
        {(["cronica", "temporanea"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setIdx(0); }}
            className={`rounded-md px-3 py-1.5 font-semibold ${tab === t ? "text-white" : "bg-slate-100 text-slate-600"}`}
            style={tab === t ? { background: PAF.petrol } : {}}
          >
            Esposizione {t}
          </button>
        ))}
      </div>

      {/* elenco studi */}
      <div className="mb-4 grid gap-2">
        {studi.map((s, i) => (
          <button
            key={s.titolo}
            onClick={() => setIdx(i)}
            className="flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition"
            style={{ borderColor: i === idx ? PAF.petrol : PAF.line, background: i === idx ? "#F0FDFA" : "#fff" }}
          >
            <span className="font-medium">{s.autore}, {s.anno} — {s.titolo}</span>
            <span className="ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: colQ(s.q) }}>
              Evidenza {s.q}
            </span>
          </button>
        ))}
      </div>

      {/* dettaglio studio (esempio Cheng et al.) */}
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-extrabold" style={{ color: PAF.petrol }}>{studio.autore}, {studio.anno}</h4>
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: colQ(studio.q) }}>
            Qualità delle evidenze: {studio.q}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{studio.sintesi}</p>
        <div className="mt-3">
          <AlertBox>
            Si tratta di un <Kw>singolo studio</Kw>: il suo peso va sempre interpretato nel contesto della
            ricerca disponibile.
          </AlertBox>
        </div>
      </div>

      <button
        onClick={() => nav.go("qualitaEvidenze")}
        className="mt-4 flex items-center gap-1 text-xs font-semibold underline"
        style={{ color: PAF.petrol }}
      >
        Cosa si intende per «qualità delle evidenze»? Clicca qui <ChevronRight size={13} />
      </button>
    </div>
  );
}

/* ===================== QUALITA EVIDENZE ==================== */
function QualitaEvidenze() {
  return (
    <div>
      <SectionTitle>Qualità delle evidenze</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        La <Kw>qualità delle evidenze</Kw> esprime quanto possiamo essere <Kw>fiduciosi</Kw> che la stima
        di un effetto sia corretta. Non riguarda un singolo numero, ma la <Kw>solidità complessiva</Kw> dei
        dati che lo sostengono.
      </p>

      <h3 className="mt-6 text-sm font-bold" style={{ color: PAF.petrol }}>Come viene valutata</h3>
      <p className="mt-2 text-sm text-slate-600">La valutazione tiene conto principalmente di:</p>
      <ul className="mt-2 grid gap-2">
        {[
          ["Disegno dello studio", "Studi sperimentali e coorti prospettiche pesano più di studi trasversali."],
          ["Rischio di bias", "Errori sistematici nel reclutamento, nella misura o nell'analisi."],
          ["Coerenza", "Risultati concordi tra studi diversi rafforzano la fiducia."],
          ["Trasferibilità (directness)", "Quanto popolazione, esposizione ed esiti corrispondono al caso reale."],
          ["Precisione", "Ampiezza degli intervalli di confidenza e numerosità del campione."],
        ].map(([t, d]) => (
          <li key={t} className="rounded-md border border-slate-200 px-4 py-3 text-sm">
            <span className="font-bold">{t}</span>
            <span className="block text-xs text-slate-500">{d}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-bold" style={{ color: PAF.petrol }}>I livelli</h3>
      <div className="mt-2 grid gap-2">
        <ClasseRiga c={{ nome: "ALTA", color: PAF.green, descrizione: "Alta fiducia: è improbabile che nuovi studi cambino la stima." }} />
        <ClasseRiga c={{ nome: "MEDIA", color: PAF.amber, descrizione: "Fiducia moderata: nuovi studi potrebbero modificarla." }} />
        <ClasseRiga c={{ nome: "BASSA", color: PAF.orange, descrizione: "Bassa fiducia: la stima è incerta e potrà cambiare." }} />
      </div>
    </div>
  );
}

/* ===================== EFFETTI INDIRETTI =================== */
function EffettiIndiretti() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold">Effetti indiretti dell'esposizione al rumore</h3>
      <p className="mb-4 text-sm text-slate-600">
        Effetti <Kw>mediati</Kw> dall'insorgenza di altre condizioni (fino a 10 categorie), descritti dai
        dati aggregati di più evidenze.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {EFFETTI_INDIRETTI.map((v) => (
          <div key={v} className="rounded-md border border-slate-200 px-4 py-3 text-sm font-medium">{v}</div>
        ))}
      </div>
    </div>
  );
}

/* ========================= CANDIDATI ======================= */
function Candidati({ nav: _nav }: { nav: Nav }) {
  const MAIL = "quietbrain@hsantalucia.it"; // segnaposto: sostituire con la mail reale
  return (
    <div>
      <SectionTitle>Candidati come volontario</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Partecipando contribuisci direttamente al <Kw>popolamento del database</Kw> sperimentale sul
        rumore e il declino cognitivo.
      </p>

      {/* Istruzioni: scarica la scheda e inviala alla mail */}
      <div className="mx-auto mt-6 max-w-lg rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: PAF.petrol }}>
          <Info size={16} /> Come candidarti
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          <Kw>Scarica la scheda</Kw> di candidatura, compilala e <Kw>inviala</Kw> all'indirizzo{" "}
          <Kw>{MAIL}</Kw>. Verrai ricontattato per le procedure sperimentali.
        </p>
        <div className="mt-4">
          <PrimaryButton onClick={() => { /* segnaposto: collega il file reale */ }}>
            <Download size={16} /> Scarica la scheda di candidatura
          </PrimaryButton>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Il pulsante di download è un segnaposto: collega la scheda PDF reale.</p>
      </div>
    </div>
  );
}

/* ========================= ESPERTI ========================= */
function EspertiMenu({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Sezione esperti</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        <Kw>Esplora</Kw> i dati sperimentali sugli effetti cognitivi dell'esposizione al rumore o poni{" "}
        <Kw>domande d'interesse</Kw> al database.
      </p>
      <div className="mt-6 grid gap-3">
        <ServiceCard
          icon={<ListFilter size={20} />}
          title="Esplora i dati"
          desc={<>Seleziona i criteri di interesse attraverso cinque menù: popolazione, demografici, psicometrici, audiometrici, neuroimaging.</>}
          onClick={() => nav.go("espertiEsplora")}
        />
        <ServiceCard
          icon={<Database size={20} />}
          title="Domande d'interesse per esperti"
          desc={<>Poni al database domande predefinite e scopri <Kw>come viene fatto il calcolo</Kw>.</>}
          onClick={() => nav.go("domandeEsperti")}
        />
      </div>
    </div>
  );
}

function EspertiEsplora() {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold">Esplora i dati per criteri di interesse</h3>
      <div className="grid gap-2">
        {MENU_ESPERTI.map((m) => (
          <div key={m.id} className="rounded-md border border-slate-200">
            <button
              onClick={() => setOpen(open === m.id ? null : m.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            >
              {m.label}
              <ChevronDown size={16} className={`transition ${open === m.id ? "rotate-180" : ""}`} />
            </button>
            {open === m.id && (
              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {m.voci.map((v) => (
                    <span key={v} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DomandeEsperti() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div>
      <SectionTitle>Domande d'interesse per esperti</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Seleziona una domanda: oltre alla risposta, ti mostriamo <Kw>come viene fatto il calcolo</Kw> sul database.
      </p>
      <div className="mt-6 grid gap-2">
        {DOMANDE_ESPERTI.map((d, i) => (
          <div key={i} className="rounded-md border border-slate-200">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
            >
              {d.q}
              <ChevronDown size={16} className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                <div className="mb-1 flex items-center gap-2 text-xs font-bold" style={{ color: PAF.petrol }}>
                  <Info size={14} /> Come viene fatto il calcolo
                </div>
                {d.calcolo}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= RICERCATORI ======================= */
function RicercatoriLogin({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Ricercatori ed enti</SectionTitle>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-slate-600">Accedi per consultare o caricare i dati.</p>
      <div className="mx-auto mt-6 grid max-w-sm gap-3">
        <input placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
        <input placeholder="Password" type="password" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
        <PrimaryButton full onClick={() => nav.go("ricercatoriMenu")}>Accedi</PrimaryButton>
        <button onClick={() => nav.go("creaAccount")} className="text-xs font-semibold underline" style={{ color: PAF.petrol }}>
          Non hai un account? Creane uno
        </button>
      </div>
    </div>
  );
}

function CreaAccount({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Crea un account</SectionTitle>
      <div className="mx-auto mt-6 grid max-w-sm gap-3">
        <input placeholder="Nome e cognome" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
        <input placeholder="Ente / Istituzione" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
        <input placeholder="Email istituzionale" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
        <PrimaryButton full onClick={() => nav.go("ricercatoriMenu")}>Crea account</PrimaryButton>
      </div>
    </div>
  );
}

function RicercatoriMenu({ nav }: { nav: Nav }) {
  return (
    <div>
      <SectionTitle>Area ricercatori</SectionTitle>
      <div className="mt-6 grid gap-3">
        <ServiceCard
          icon={<FileSpreadsheet size={20} />}
          title="Scarica e consulta i dati"
          desc={<>Esplora il <Kw>flow chart</Kw> delle variabili del database e scarica i dati.</>}
          onClick={() => nav.go("flowchartDatabase")}
        />
        <ServiceCard
          icon={<Database size={20} />}
          title="Carica i tuoi dati"
          desc={<>Contribuisci all'<Kw>open science</Kw> caricando dati soggettivi o oggettivi.</>}
          onClick={() => nav.go("caricaDati")}
        />
      </div>
    </div>
  );
}

function FlowchartDatabase() {
  const VARIABILI = ["Quadro cognitivo globale", "Funzioni esecutive", "Memoria", "Scale comportamentali", "Indici neuroradiologici", "Misure di neuroimaging", "Dati audiometrici", "Storia di esposizione"];
  return (
    <div>
      <SectionTitle>Scarica e consulta i dati</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Il <Kw>flow chart</Kw> mostra le variabili del database. Da ciascun test si raggiunge la
        pubblicazione di riferimento tramite il <Kw>DOI</Kw>.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {VARIABILI.map((v) => (
          <div key={v} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm">
            <span className="font-medium">{v}</span>
            <span className="text-[10px] text-slate-400">DOI</span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <PrimaryButton><Download size={16} /> Scarica l'intero database</PrimaryButton>
        <p className="mt-2 text-[11px] text-slate-400">Segnaposto: collega il file/endpoint reale.</p>
      </div>
    </div>
  );
}

function CaricaDati() {
  return (
    <div>
      <SectionTitle>Carica i tuoi dati</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Carica dati <Kw>soggettivi</Kw> (questionari) o <Kw>oggettivi</Kw> (misure strumentali). Il sistema
        applica una pipeline di controllo qualità.
      </p>
      <div className="mx-auto mt-6 grid max-w-md gap-3">
        <div className="grid place-items-center rounded-lg border-2 border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          Trascina qui il file (CSV / XLSX) oppure clicca per selezionarlo
        </div>
        <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-600">
          <div className="mb-2 font-bold" style={{ color: PAF.petrol }}>Checklist di caricamento</div>
          <ul className="grid gap-1 text-xs">
            <li>· Variabili anonimizzate (nessun dato identificativo)</li>
            <li>· Tracciato conforme alla legenda del database</li>
            <li>· Consenso informato disponibile</li>
          </ul>
        </div>
        <PrimaryButton full>Invia per la validazione</PrimaryButton>
      </div>
    </div>
  );
}
