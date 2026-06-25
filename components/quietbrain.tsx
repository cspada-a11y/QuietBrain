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

// Categorie di sforzo vocale NESI (slide 10) → livello dB(A) indicativo (Nesi, Guest 2018)
const SFORZO_NESI: { v: string; label: string; lex: number }[] = [
  { v: "normale", label: "Parlare normalmente da 1,2 m", lex: 60 },
  { v: "alzata", label: "Alzare la voce da 1,2 m", lex: 66 },
  { v: "alta", label: "Parlare a voce alta da 1,2 m", lex: 72 },
  { v: "moltoalta", label: "Parlare a voce molto alta da 1,2 m", lex: 78 },
  { v: "grido12", label: "Gridare da 1,2 m", lex: 84 },
  { v: "grido06", label: "Gridare da 0,6 m", lex: 90 },
  { v: "urlo", label: "Urlare nell'orecchio del tuo interlocutore", lex: 96 },
];
const LIVELLO_SFORZO: Record<string, number> = Object.fromEntries(SFORZO_NESI.map((s) => [s.v, s.lex]));

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

/* ===================== DEFINIZIONI POP-UP (slide 30/31) ========= */
const DEFS: Record<string, string> = {
  "Sani":
    "Soggetti senza deficit cognitivi clinicamente rilevanti, con prestazioni nella norma ai test: costituiscono il gruppo di riferimento (controllo).",
  "Subjective Cognitive Decline (SCD)":
    "Il Declino Cognitivo Soggettivo (SCD) indica l'esperienza soggettiva di un peggioramento delle proprie capacità cognitive (in particolare della memoria) che persiste nel tempo in persone con capacità oggettive conservate. Si ritiene possa rappresentare una fase preclinica della malattia di Alzheimer: uno stadio molto precoce che precede la comparsa di sintomi clinicamente evidenti.",
  "Mild Cognitive Impairment (MCI)":
    "Il Mild Cognitive Impairment (MCI), o Disturbo Cognitivo Lieve, rappresenta una fase intermedia tra il normale invecchiamento e la demenza. Comporta lievi difficoltà di memoria, attenzione o linguaggio riscontrabili ai test clinici, che però non compromettono l'autonomia quotidiana in compiti di facile attuazione.",
  "Demenza Lieve":
    "Con Demenza Lieve si intende una mancanza di indipendenza nelle attività quotidiane e una compromissione moderata delle capacità cognitive.",
  "Fazekas":
    "La scala di Fazekas quantifica l'estensione delle lesioni in aree profonde del cervello, solitamente esito di micro-eventi ischemici. Tali lesioni, conseguenza di una malattia dei piccoli vasi, possono essere asintomatiche o associarsi a un rallentamento dell'elaborazione cognitiva e del funzionamento esecutivo.",
  "ERICA":
    "I punteggi ERICA aiutano a identificare visivamente i pazienti con malattia di Alzheimer valutando la perdita di volume della corteccia entorinale (sintomo prodromico). Il punteggio varia da 0 a 3: valori più alti indicano maggiore atrofia e maggiore probabilità di malattia di Alzheimer.",
  "MTA":
    "Il punteggio MTA (atrofia del lobo temporale mediale) distingue i pazienti con disturbo cognitivo lieve (MCI) o morbo di Alzheimer da quelli senza problemi. Funziona bene nello screening della demenza, con accuratezza ~75% nella diagnosi e ~85% nel confermare la malattia di Alzheimer.",
};

/* =================== MENU ESPLORA ESPERTI (slide 29) =========== */
type Voce = { label: string; info?: string; note?: string };
const MENU_ESPERTI: { id: string; label: string; voci: Voce[]; caption?: string }[] = [
  {
    id: "pop",
    label: "Popolazione",
    voci: [
      { label: "Soggetti Sani" },
      { label: "Subjective Cognitive Decline", info: DEFS["Subjective Cognitive Decline (SCD)"] },
      { label: "Mild Cognitive Impairment", info: DEFS["Mild Cognitive Impairment (MCI)"] },
      { label: "Demenza Lieve", info: DEFS["Demenza Lieve"] },
    ],
  },
  {
    id: "demo",
    label: "Dati demografici",
    voci: [
      { label: "Età", note: "Rimanda alle fasce: 60-64, 65-69, 70-74, 75-80." },
      { label: "Sesso" },
      { label: "Professione", note: "Rimanda alle 648 professioni della classificazione ISTAT." },
      { label: "Esposizione al rumore lavoro-correlato", note: "Rimanda a 3 indici: alta, media, bassa." },
    ],
  },
  {
    id: "psico",
    label: "Dati psicometrici",
    caption: "9 categorie × 20 variabili",
    voci: [
      { label: "Quadro cognitivo globale" },
      { label: "Attenzione e Funzioni Esecutive" },
      { label: "Memoria" },
      { label: "Linguaggio" },
      { label: "Prassia" },
      { label: "Scale comportamentali" },
      { label: "Consapevolezza" },
      { label: "Benessere psicosociale" },
      { label: "NESI" },
    ],
  },
  {
    id: "audio",
    label: "Dati audiometrici",
    caption: "Presenza / assenza di perdita di acuità uditiva",
    voci: [
      { label: "Perdita di udito rumore-correlata" },
      { label: "Nessuna perdita di udito rumore-correlata" },
    ],
  },
  {
    id: "neuro",
    label: "Dati di neuroimaging",
    caption: "Rimanda a 3 indici",
    voci: [
      { label: "Fazekas", info: DEFS["Fazekas"] },
      { label: "ERICA", info: DEFS["ERICA"] },
      { label: "MTA", info: DEFS["MTA"] },
    ],
  },
];

/* ===================== QUERIES ESPERTO (file Queries) =========
 * Analisi DESCRITTIVE realmente implementate nelle macro: conteggi
 * (CountIf/CountIfs), percentuali per gruppo e confronto tra proporzioni
 * in punti percentuali (soglia 10 pp). Nessun test inferenziale
 * (no chi-quadrato, ANOVA, regressione logistica/lineare, odds ratio). */
const DOMANDE_ESPERTI: { q: string; calcolo: string; excel?: boolean }[] = [
  {
    q: "Come varia l'esposizione al rumore lavoro-correlato in funzione della tipologia (industriale, aviazione, edile, musica, parlato, marina) nella popolazione studiata?",
    calcolo:
      "Per ciascuna delle 6 tipologie di rumore si contano i soggetti e, per ognuna, quanti ricadono nei livelli di esposizione Alta (0), Media (1) e Bassa (2); si calcolano le percentuali per livello e si individua il profilo prevalente di ogni tipologia. Confronto descrittivo: si evidenziano le tipologie con la maggiore e la minore quota di alta esposizione.",
  },
  {
    q: "La tipologia del rumore ha effetti diversi su rapidità del processo informativo (TMT-A), task switching (TMT-B), memoria a breve termine (FCSRT immediate) e memoria a lungo termine (FCSRT delayed)?",
    calcolo:
      "Per ciascuna tipologia e per ciascun test si conta quanti soggetti cadono sotto il cut-off clinico (TMT-A > 93 sec, TMT-B > 282 sec, FCSRT immediate < 19,59, FCSRT delayed < 6,31) e si calcola la percentuale sotto cut-off. A ogni gruppo si assegna un profilo descrittivo: Critico (≥ 50%), Moderato (25–49%), Buono (< 25%).",
  },
  {
    q: "I diversi livelli di esposizione al rumore discriminano la presenza o l'assenza di perdita di acuità uditiva?",
    calcolo:
      "Per i tre gruppi di esposizione (Alta, Media, Bassa) si contano i soggetti con e senza perdita uditiva e si calcola la percentuale con perdita. Si confronta la differenza in punti percentuali tra Alta e Bassa esposizione: se ≥ 10 pp l'esposizione discrimina, differenze minori indicano assenza di discriminazione. Nessun test inferenziale.",
  },
  {
    q: "I diversi livelli di esposizione al rumore discriminano tra punteggi sopra e sotto il cut-off del MMSE (cut-off = 23)?",
    calcolo:
      "Per i tre gruppi di esposizione si contano i soggetti sotto cut-off (MMSE ≤ 23) e sopra, e si calcola la percentuale sotto cut-off. Si confronta la differenza Alta vs Bassa in punti percentuali (soglia 10 pp) per stabilire se l'esposizione discrimina il punteggio MMSE.",
    excel: true,
  },
  {
    q: "Chi è stato esposto ad alti livelli di rumore sviluppa una maggiore perdita di volume dell'ippocampo (MTA ≥ 2)?",
    calcolo:
      "Per i tre gruppi di esposizione si conta quanti soggetti hanno MTA ≥ 2 e si calcola la percentuale. Si confronta la differenza Alta vs Bassa in punti percentuali (soglia 10 pp): una differenza positiva ≥ 10 pp indica maggiore atrofia ippocampale nei più esposti.",
  },
  {
    q: "I livelli di esposizione al rumore predicono il punteggio della cognizione globale (MMSE)?",
    calcolo:
      "Per i tre gruppi di esposizione si calcola la percentuale di soggetti sotto il cut-off del MMSE (indicatore della cognizione globale) e si confrontano le proporzioni Alta vs Bassa in punti percentuali (soglia 10 pp). Analisi descrittiva, senza regressione.",
  },
];

/* Esempio di risultato della query MMSE sul foglio (macro AnalisiCompletaEsposizioneMMSE) */
const ESEMPIO_EXCEL_MMSE = {
  titolo: "AnalisiCompletaEsposizioneMMSE — output sul foglio",
  intestazioni: ["Gruppo", "N totale", "N sotto cutoff (≤23)", "N sopra cutoff (>23)", "% sotto cutoff"],
  righe: [
    ["Alta esposizione (0)", "26", "8", "18", "30,8%"],
    ["Media esposizione (1)", "38", "7", "31", "18,4%"],
    ["Bassa esposizione (2)", "42", "4", "38", "9,5%"],
  ],
  esito:
    "Differenza Alta vs Bassa = 21,3 punti percentuali (≥ 10 pp): nel campione i soggetti con alta esposizione cadono sotto il cut-off MMSE più spesso, quindi l'esposizione discrimina il punteggio. Confronto descrittivo tra proporzioni, senza test inferenziale.",
};

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
  const [anniLav, setAnniLav] = React.useState(10);
  const [settimaneLav, setSettimaneLav] = React.useState(46);
  const [giorniSett, setGiorniSett] = React.useState(5);

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
    <div className="min-h-screen w-full bg-slate-100 py-6" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", color: PAF.ink }}>
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
              anniLav, setAnniLav,
              settimaneLav, setSettimaneLav,
              giorniSett, setGiorniSett,
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
  anniLav: number; setAnniLav: (v: number) => void;
  settimaneLav: number; setSettimaneLav: (v: number) => void;
  giorniSett: number; setGiorniSett: (v: number) => void;
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
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

/* ===================== SFORZO VOCALE (NESI) ================ */
function SforzoVocale({ nav, sim }: { nav: Nav; sim: SimState }) {
  return (
    <div>
      <div className="text-center text-sm font-bold" style={{ color: PAF.petrol }}>Sezione Lavoro</div>
      <SectionTitle>Sforzo vocale richiesto</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Per selezionare il livello di esposizione al rumore dalla tabella, immagina di essere al lavoro e
        di dover <Kw>parlare con una persona a circa 1,2 metri di distanza</Kw>. Supponi che il tuo
        interlocutore abbia un udito normale, non indossi protezioni acustiche e che tu possa vedere
        chiaramente volti e gesti. In base allo <Kw>sforzo vocale</Kw> che dovresti fare per farti capire
        in questa situazione, scegli il livello di rumore corrispondente.
      </p>
      <p className="mt-2 text-[11px] italic text-slate-400">Scala dello sforzo vocale — Nesi, Guest (2018).</p>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
        <div className="px-4 py-2.5 text-sm font-bold text-white" style={{ background: PAF.petrol }}>Sforzo vocale richiesto</div>
        {SFORZO_NESI.map((o) => {
          const sel = sim.sforzo === o.v;
          return (
            <button
              key={o.v}
              onClick={() => sim.setSforzo(o.v)}
              className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition"
              style={{ background: sel ? "#ECFDF5" : "#fff" }}
            >
              <span className={sel ? "font-bold" : ""}>{o.label}</span>
              <span className="grid h-5 w-5 place-items-center rounded-full border" style={{ borderColor: sel ? PAF.petrol : "#cbd5e1", background: sel ? PAF.petrol : "#fff" }}>
                {sel && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
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
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
        />
        <select
          value={ordina}
          onChange={(e) => setOrdina(e.target.value as "snr" | "tipo" | "marca")}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
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

      {/* barra proporzione tempo d'uso DPI — più grande, con consegna (slide 13) */}
      {sel && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border-2 p-5" style={{ borderColor: PAF.petrol, background: "#F0FDFA" }}>
          <div className="mb-2 flex items-center gap-2 text-base font-extrabold" style={{ color: PAF.petrol }}>
            <ShieldCheck size={20} /> Stima del tempo di utilizzo del DPI
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Indica la <Kw>proporzione di tempo</Kw> in cui hai indossato il DPI selezionato
            (<Kw>{sel.marca} {sel.modello}</Kw>). La proporzione è un valore compreso tra{" "}
            <Kw>0</Kw> ("mai indossato") e <Kw>1</Kw> ("indossato per l'intero periodo di esposizione").
            Ad esempio, se lo hai indossato per il 20% del tempo corrisponde a 0,20.
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={sim.proporzioneDPI}
            onChange={(e) => sim.setProporzioneDPI(Number(e.target.value))}
            className="mt-4 h-3 w-full cursor-pointer appearance-none rounded-full"
            style={{ accentColor: PAF.petrol, background: `linear-gradient(90deg, ${PAF.petrol} ${sim.proporzioneDPI}%, #cbd5e1 ${sim.proporzioneDPI}%)` }}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>0 — mai</span>
            <span className="text-2xl font-extrabold" style={{ color: PAF.petrol }}>{(sim.proporzioneDPI / 100).toFixed(2)}</span>
            <span>1 — sempre</span>
          </div>
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
  const totaleOre = sim.anniLav * sim.settimaneLav * sim.giorniSett * sim.oreGiorno;
  return (
    <div>
      <div className="text-center text-sm font-bold" style={{ color: PAF.petrol }}>Sezione Lavoro</div>
      <SectionTitle>Compila i campi richiesti</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Compila gli spazi con tutte le informazioni richieste, inserendo i dati in modo{" "}
        <Kw>completo e accurato</Kw>.
      </p>
      <div className="mx-auto mt-6 grid max-w-md gap-4">
        <Campo label="Anni lavorativi" value={sim.anniLav} onChange={sim.setAnniLav} min={0} max={60} suffix="anni" />
        <Campo label="Settimane lavorative" value={sim.settimaneLav} onChange={sim.setSettimaneLav} min={0} max={52} suffix="sett./anno" />
        <Campo label="Giorni a settimana" value={sim.giorniSett} onChange={sim.setGiorniSett} min={0} max={7} suffix="gg/sett." />
        <Campo label="Ore giornaliere" value={sim.oreGiorno} onChange={sim.setOreGiorno} min={0} max={16} suffix="ore/gg" />
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Totale ore (calcolato)</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold" style={{ color: PAF.petrol }}>
            {totaleOre.toLocaleString("it-IT")} ore
          </div>
        </div>
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
        />
        <span className="text-xs text-slate-400">{suffix}</span>
      </div>
    </div>
  );
}

/* ===================== OUTPUT SIMULATORE ==================== */
function OutputSimulatore({ nav, sim }: { nav: Nav; sim: SimState }) {
  const [popInfo, setPopInfo] = React.useState(false);
  const snr = sim.dpiSelezionato?.snr ?? 25;
  const r = calcolaLex({
    sforzo: sim.sforzo || "alta",
    oreGiorno: sim.oreGiorno,
    usaDPI: !!sim.usaDPI,
    attenuazioneDPI: Math.max(0, snr - 4), // il sistema sottrae 4 dB all'SNR del DPI (slide 12)
    proporzioneDPI: sim.proporzioneDPI / 100,
  });

  return (
    <div>
      <div className="text-center text-sm font-bold" style={{ color: PAF.petrol }}>Sezione Lavoro</div>
      <SectionTitle>Output del simulatore</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Stima della tua <Kw>esposizione annua equivalente</Kw> al rumore
        {sim.professione ? <> per la professione: <Kw>{sim.professione}</Kw></> : null}.
      </p>

      {/* Due badge: senza / con attenuazione DPI — solo valore LEX, nessuna classe */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CardLex titolo="Senza attenuazione DPI" lex={r.lexSenza} />
        {sim.usaDPI ? (
          <CardLex titolo="Con attenuazione DPI" lex={r.lexCon} highlight />
        ) : (
          <div className="grid flex-1 place-items-center rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            Non hai indicato l'uso dei DPI: nessuna attenuazione applicata.
          </div>
        )}
      </div>

      {sim.usaDPI && (
        <p className="mt-3 text-center text-xs text-slate-500">
          {sim.dpiSelezionato ? <>Con <Kw>{sim.dpiSelezionato.marca} {sim.dpiSelezionato.modello}</Kw> (SNR {sim.dpiSelezionato.snr} dB, −4 dB applicati), </> : null}
          indossato per una proporzione di <Kw>{(sim.proporzioneDPI / 100).toFixed(2)}</Kw>, l'esposizione si riduce di{" "}
          <Kw>{Math.max(0, Math.round((r.lexSenza - r.lexCon) * 10) / 10)} dB(A)</Kw>.
        </p>
      )}

      <div className="mt-5">
        <AlertBox title="Attenzione: risultato soggettivo">
          I livelli di rumore riportati derivano da <Kw>stime soggettive</Kw> basate sulla tua percezione e{" "}
          <Kw>non derivano da misurazioni strumentali</Kw> né dal calcolo di un indice oggettivo di esposizione.
          Le informazioni hanno finalità <Kw>preventive e non certificative</Kw>: per una valutazione
          professionale rivolgiti a esperti con strumentazione idonea.
        </AlertBox>
      </div>

      <button
        onClick={() => setPopInfo(true)}
        className="mt-4 flex items-center gap-1 text-sm font-semibold underline"
        style={{ color: PAF.petrol }}
      >
        Per approfondire clicca qui: Valutazione del Rischio del Rumore <ChevronRight size={15} />
      </button>

      <div className="mt-6 text-center">
        <PrimaryButton onClick={() => nav.go("areaOperativa")}>Torna all'area operativa</PrimaryButton>
      </div>

      {popInfo && (
        <Modal title="Valutazione del rischio rumore — D.Lgs 81/08, art. 189" onClose={() => setPopInfo(false)}>
          <p className="mb-3">
            Il <Kw>D.Lgs 81/08, art. 189</Kw> fissa, in funzione del LEX,8h, i valori di azione e il valore
            limite di esposizione al rumore:
          </p>
          <ul className="grid gap-1.5 text-[13px]">
            <li>· <Kw>Valori inferiori di azione</Kw>: LEX,8h = 80 dB(A); ppeak = 112 Pa (135 dB(C)).</li>
            <li>· <Kw>Valori superiori di azione</Kw>: LEX,8h = 85 dB(A); ppeak = 140 Pa (137 dB(C)).</li>
            <li>· <Kw>Valori limite di esposizione</Kw>: LEX,8h = 87 dB(A); ppeak = 200 Pa (140 dB(C)).</li>
          </ul>
          <div className="mt-4">
            <AlertBox>
              I valori hanno scopo <Kw>informativo</Kw>. La classificazione di legge presuppone misurazioni
              strumentali eseguite da personale qualificato.
            </AlertBox>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CardLex({ titolo, lex, highlight }: { titolo: string; lex: number; highlight?: boolean }) {
  return (
    <div className="flex-1 rounded-lg border p-4" style={{ borderColor: highlight ? PAF.green : PAF.line, background: highlight ? "#F0FDF4" : "#fff" }}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titolo}</div>
      <div className="mt-2 text-[11px] text-slate-400">Esposizione annua equivalente stimata</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold" style={{ color: PAF.petrol }}>{lex.toFixed(1)}</span>
        <span className="text-sm font-bold text-slate-500">dB(A)</span>
      </div>
      <div className="mt-1 text-[11px] text-slate-400">LEX,8h annuo stimato</div>
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
            Qualità (JBI): {studio.q}
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

/* ===================== QUALITA EVIDENZE (JBI) ============== */
function QualitaEvidenze() {
  return (
    <div>
      <SectionTitle>Qualità delle evidenze</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        La <Kw>qualità delle evidenze</Kw> esprime quanto possiamo essere <Kw>fiduciosi</Kw> che il
        risultato di uno studio sia corretto e affidabile. Per valutarla utilizziamo gli strumenti del{" "}
        <Kw>Joanna Briggs Institute (JBI)</Kw>.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
        <div className="mb-1 flex items-center gap-2 font-bold" style={{ color: PAF.petrol }}>
          <BookOpen size={15} /> Lo strumento JBI
        </div>
        Il JBI mette a disposizione delle <Kw>checklist di valutazione critica</Kw> (critical appraisal)
        specifiche per il <Kw>disegno dello studio</Kw> (studi randomizzati, di coorte, caso-controllo,
        trasversali, ecc.). Ogni studio viene esaminato voce per voce per stimarne la{" "}
        <Kw>qualità metodologica</Kw> e il <Kw>rischio di bias</Kw>.
      </div>

      <h3 className="mt-6 text-sm font-bold" style={{ color: PAF.petrol }}>Cosa valutano le checklist JBI</h3>
      <ul className="mt-2 grid gap-2">
        {[
          ["Validità del campione", "Criteri di inclusione chiari e popolazione rappresentativa."],
          ["Misurazione dell'esposizione e degli esiti", "Strumenti validi e affidabili, applicati in modo uniforme."],
          ["Controllo dei fattori di confondimento", "Identificazione e gestione delle variabili che possono distorcere il risultato."],
          ["Adeguatezza dell'analisi statistica", "Metodi appropriati al disegno e ai dati."],
          ["Completezza del follow-up", "Gestione di abbandoni e dati mancanti."],
        ].map(([t, d]) => (
          <li key={t} className="rounded-md border border-slate-200 px-4 py-3 text-sm">
            <span className="font-bold">{t}</span>
            <span className="block text-xs text-slate-500">{d}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-bold" style={{ color: PAF.petrol }}>Dal punteggio JBI al livello di qualità</h3>
      <p className="mt-2 text-sm text-slate-600">
        In base alla quota di criteri soddisfatti nella checklist, allo studio viene attribuito un livello:
      </p>
      <div className="mt-2 grid gap-2">
        <ClasseRiga c={{ nome: "ALTA", color: PAF.green, descrizione: "La maggior parte dei criteri JBI è soddisfatta: basso rischio di bias." }} />
        <ClasseRiga c={{ nome: "MEDIA", color: PAF.amber, descrizione: "Criteri soddisfatti solo in parte: rischio di bias moderato." }} />
        <ClasseRiga c={{ nome: "BASSA", color: PAF.orange, descrizione: "Pochi criteri soddisfatti: rischio di bias elevato, risultato incerto." }} />
      </div>
      <p className="mt-3 text-[11px] italic text-slate-400">Rif.: Joanna Briggs Institute (JBI) Critical Appraisal Tools.</p>
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
  const MAIL = "info@hsantalucia.it"; // slide 25
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
          title="Interroga il database"
          desc={<>Poni al database le <Kw>queries</Kw> predefinite e scopri <Kw>come viene fatto il calcolo</Kw>, con esempio sul foglio Excel.</>}
          onClick={() => nav.go("domandeEsperti")}
        />
      </div>
    </div>
  );
}

function EspertiEsplora() {
  const [open, setOpen] = React.useState<string | null>("pop");
  const [pop, setPop] = React.useState<{ titolo: string; testo: string } | null>(null);

  const Param = ({ v }: { v: Voce }) => {
    const def = v.info || v.note;
    if (!def) {
      return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{v.label}</span>;
    }
    return (
      <span className="relative inline-block">
        <button
          onClick={() => setPop({ titolo: v.label, testo: def })}
          className="group inline-flex cursor-help items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200"
        >
          {v.label}
          <Info size={12} className="text-slate-400" />
          {/* pop-up a comparsa al passaggio del mouse */}
          <span className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-72 rounded-lg border border-slate-200 bg-white p-3 text-left text-[11px] font-normal leading-relaxed text-slate-600 shadow-lg group-hover:block">
            <span className="mb-1 block font-bold" style={{ color: PAF.petrol }}>{v.label}</span>
            {def}
          </span>
        </button>
      </span>
    );
  };

  return (
    <div>
      <SectionTitle>Esplora dati</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Attraverso questa piattaforma puoi <Kw>selezionare i criteri</Kw> con cui visualizzare i dati
        raccolti finora da ricercatori e tecnici. Seleziona una delle opzioni nei menù a tendina
        (<Kw>input</Kw>); l'output mostra i dati corrispondenti.
      </p>
      <p className="mx-auto mt-2 max-w-lg text-center text-[11px] text-slate-400">
        Le voci con <Info size={11} className="inline" /> mostrano una spiegazione al passaggio del mouse.
      </p>

      <div className="mt-6 grid gap-2">
        {MENU_ESPERTI.map((m) => (
          <div key={m.id} className="rounded-md border border-slate-200">
            <button onClick={() => setOpen(open === m.id ? null : m.id)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold" style={{ color: PAF.petrol }}>
              {m.label}
              <ChevronDown size={16} className={`transition ${open === m.id ? "rotate-180" : ""}`} />
            </button>
            {open === m.id && (
              <div className="border-t border-slate-100 px-4 py-3">
                {m.caption && <div className="mb-2 text-[11px] italic text-slate-400">{m.caption}</div>}
                <div className="flex flex-wrap gap-2">
                  {m.voci.map((v) => <Param key={v.label} v={v} />)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Output: anteprima del database */}
      <h3 className="mb-2 mt-6 flex items-center gap-2 text-sm font-bold" style={{ color: PAF.petrol }}>
        <FileSpreadsheet size={16} /> Output — anteprima dei dati
      </h3>
      <ExcelPreview />

      {pop && (
        <Modal title={pop.titolo} onClose={() => setPop(null)}>
          {pop.testo}
        </Modal>
      )}
    </div>
  );
}

/* Tabella in stile foglio Excel */
function ExcelPreview() {
  const head = ["ID", "Gruppo", "LEX,8h", "MMSE", "BEPTA", "MTA"];
  const rows = [
    ["S001", "Sani", "78,4", "29", "18", "0"],
    ["S002", "SCD", "84,1", "27", "26", "1"],
    ["S003", "MCI", "86,7", "24", "34", "2"],
    ["S004", "Demenza Lieve", "88,2", "20", "41", "3"],
  ];
  return (
    <div className="overflow-x-auto rounded-md border border-slate-300">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-slate-200 bg-slate-100 px-2 py-1 text-left font-bold text-slate-600"> </th>
            {head.map((h) => (
              <th key={h} className="border border-slate-200 bg-slate-100 px-3 py-1.5 text-left font-bold text-slate-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-slate-200 bg-slate-50 px-2 py-1 text-center font-semibold text-slate-400">{i + 1}</td>
              {r.map((c, j) => (
                <td key={j} className="border border-slate-200 px-3 py-1.5 text-slate-700">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DomandeEsperti() {
  const [open, setOpen] = React.useState<number | null>(1);
  return (
    <div>
      <SectionTitle>Interroga il database</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        L'esperto interroga il database a partire dalle <Kw>queries</Kw> proposte. Le analisi sono{" "}
        <Kw>descrittive</Kw> (conteggi e percentuali per gruppo, confronto tra proporzioni in punti
        percentuali): seleziona una domanda per vedere come viene fatto il calcolo, con l'<Kw>esempio del
        risultato sul foglio Excel</Kw> dove disponibile.
      </p>
      <div className="mt-6 grid gap-2">
        {DOMANDE_ESPERTI.map((d, i) => (
          <div key={i} className="rounded-md border border-slate-200">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-semibold">
              <span><span className="mr-1.5" style={{ color: PAF.petrol }}>{i + 1}.</span>{d.q}</span>
              <ChevronDown size={16} className={`mt-0.5 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-xs font-bold" style={{ color: PAF.petrol }}>
                  <Info size={14} /> Come viene fatto il calcolo
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{d.calcolo}</p>

                {d.excel && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold" style={{ color: PAF.petrol }}>
                      <FileSpreadsheet size={14} /> Esempio del risultato — {ESEMPIO_EXCEL_MMSE.titolo}
                    </div>
                    <div className="overflow-x-auto rounded-md border border-slate-300">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            {ESEMPIO_EXCEL_MMSE.intestazioni.map((h) => (
                              <th key={h} className="border border-slate-200 bg-slate-100 px-3 py-1.5 text-left font-bold text-slate-700">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ESEMPIO_EXCEL_MMSE.righe.map((r, ri) => (
                            <tr key={ri}>
                              {r.map((c, ci) => (
                                <td key={ci} className="border border-slate-200 px-3 py-1.5 text-slate-700">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-xs font-semibold" style={{ color: PAF.petrol }}>{ESEMPIO_EXCEL_MMSE.esito}</p>
                    <p className="mt-1 text-[11px] italic text-slate-400">Valori dimostrativi: il calcolo reale è eseguito da una macro sul database sperimentale.</p>
                  </div>
                )}
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
        <input placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500" />
        <input placeholder="Password" type="password" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500" />
        <PrimaryButton full onClick={() => nav.go("ricercatoriMenu")}>Accedi</PrimaryButton>
        <button onClick={() => nav.go("creaAccount")} className="text-xs font-semibold underline" style={{ color: PAF.petrol }}>
          Non hai un account? Creane uno
        </button>
      </div>
    </div>
  );
}

function CreaAccount({ nav }: { nav: Nav }) {
  const [privacy, setPrivacy] = React.useState(false);
  return (
    <div>
      <SectionTitle>Crea un account</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Per visualizzare i dati caricati finora o caricare a tua volta i dati raccolti in precedenti
        indagini, crea un account utente.
      </p>
      <div className="mx-auto mt-6 grid max-w-md gap-3">
        {[
          "Nome *",
          "Cognome *",
          "E-mail (nome utente) *",
          "Numero di iscrizione all'Albo di appartenenza",
          "Università / Ente di afferenza",
          "Titolo",
        ].map((ph) => (
          <input key={ph} placeholder={ph} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500" />
        ))}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>PhD:</span>
          <label className="flex items-center gap-1"><input type="radio" name="phd" /> Sì</label>
          <label className="flex items-center gap-1"><input type="radio" name="phd" /> No</label>
        </div>
        <input placeholder="Password *" type="password" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500" />
        <p className="text-[11px] text-slate-400">* dato obbligatorio</p>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          I dati saranno mostrati in forma <Kw>aggregata</Kw> e non saranno visibili informazioni sensibili
          agli altri utenti.
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold underline" style={{ color: PAF.petrol }}>
          <Download size={15} /> Scarica il pdf del documento «Privacy»
        </button>
        <button onClick={() => setPrivacy(!privacy)} className="flex items-center gap-2 text-left text-sm text-slate-700">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded border" style={{ borderColor: privacy ? PAF.petrol : "#cbd5e1", background: privacy ? PAF.petrol : "#fff" }}>
            {privacy && <span className="text-[11px] font-bold text-white">✓</span>}
          </span>
          Ho letto e accetto le condizioni di utilizzo
        </button>

        <button
          onClick={() => nav.go("ricercatoriMenu")}
          disabled={!privacy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition disabled:opacity-50"
          style={{ background: PAF.orange }}
        >
          CREA ACCOUNT
        </button>
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

/* ===================== DATABASE: VARIABILI (slide 39) ========== */
const DB_TREE: { gruppo: string; sotto: { nome: string; test: string[] }[] }[] = [
  {
    gruppo: "Valutazione Neuropsichiatrica e Neuropsicologica",
    sotto: [
      { nome: "Quadro Cognitivo Globale", test: ["Clinical Dementia Rating scale (Morris, 1997)", "Mini Mental State Examination (Measso et al., 1993)", "T.I.B. — Test di Intelligenza Breve (Sartori et al., 2002)"] },
      { nome: "Memoria", test: ["FCSRT (Frasson et al., 2011) — rievoc. imm./diff.", "Figura di Rey-Osterrieth (Caffarra et al., 2002) — diff."] },
      { nome: "Attenzione e Funzioni Esecutive", test: ["TMT A-B (Siciliano et al., 2019)"] },
      { nome: "Linguaggio", test: ["Fluenza verbale fonologica (Costa et al., 2013)", "Fluenza verbale semantica (Costa et al., 2013)", "Completamento frasi del BAC (De Beni et al., 2008)"] },
      { nome: "Prassia costruttiva complessa", test: ["Figura di Rey-Osterrieth (Caffarra et al., 2002) — copia"] },
    ],
  },
  {
    gruppo: "Valutazione Audiometrica",
    sotto: [{ nome: "Audiometria", test: ["Timpanometria (curva A-D)", "Riflesso stapediale (500–2000 Hz)", "Audiometria (125–8000 Hz)", "Valore BEPTA (Better Ear Pure Tone Average)"] }],
  },
  {
    gruppo: "Valutazione Funzionale e Comportamentale",
    sotto: [
      { nome: "Valutazione funzionale", test: ["Independent Living Skills Survey (Wallace et al., 2000)"] },
      { nome: "Scale comportamentali", test: ["Neuropsychiatric Inventory (Cummings et al., 1994)", "Starkstein Apathy Scale (Starkstein et al., 1998)", "Beck Depression Inventory (Cummings et al., 2002)", "Beck Cognitive Insight Scale (Beck et al., 2004)"] },
    ],
  },
  {
    gruppo: "Neuroimaging",
    sotto: [
      { nome: "Indici Neuroradiologici", test: ["Scala di Fazekas (iperintensità sostanza bianca)", "MTA (Medial Temporal lobe Atrophy score)", "ERICA (Entorhinal Cortex Atrophy score)"] },
      { nome: "Analisi Morfometrica MRI", test: ["Volume MRI (segmentazione sottocorticale)", "Spessore Corticale MRI (Cortical Thickness)"] },
    ],
  },
  {
    gruppo: "Wellbeing e Consapevolezza",
    sotto: [
      { nome: "Wellbeing", test: ["Cri-q (Nucci et al., 2012)", "SF-DEM (Sommerlad et al., 2017)", "Domande questionario SiRene (Brink et al., 2019)", "Loneliness (De Jong & Van Tilburg, 2006)"] },
      { nome: "Consapevolezza", test: ["Cognitive Function Instrument (Chipi et al., 2019)", "Anosognosia Questionnaire-Dementia (Gambina et al., 2015)", "General Self-Efficacy Scale (Schwarzer et al., 1995)"] },
    ],
  },
  {
    gruppo: "Valutazione Noise Related",
    sotto: [{ nome: "Esposizione al rumore", test: ["Hearing Self-Assessment Questionnaire (Bonetti et al., 2017)", "NESI — Noise Exposure Structured Interview (Guest et al., 2018)"] }],
  },
];

/* Conteggio delle variabili/test foglia nel database */
const DB_COUNT = DB_TREE.reduce((tot, g) => tot + g.sotto.reduce((s, x) => s + x.test.length, 0), 0);

/* DOI per ciascun test: inserire qui il codice DOI (es. "10.1234/abcd").
 * Finché un DOI non è presente, il link rimanda a una ricerca della reference. */
const DOI_MAP: Record<string, string> = {
  // "Mini Mental State Examination (Measso et al., 1993)": "10.xxxx/yyyy",
};
function refHref(label: string): string {
  const d = DOI_MAP[label];
  return d ? `https://doi.org/${d}` : `https://search.crossref.org/?q=${encodeURIComponent(label)}`;
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Dati per la markmap (stessa struttura del file markmap.html) */
function buildMarkmapData() {
  return {
    content: "Database QuietBrain",
    children: DB_TREE.map((g) => ({
      content: g.gruppo,
      children: g.sotto.map((s) => ({
        content: s.nome,
        children: s.test.map((t) => ({
          // nodo foglia come link al DOI
          content: `<a href="${refHref(t)}" target="_blank" rel="noopener noreferrer" title="Apri reference (DOI)">${escapeHtml(t)}</a>`,
          children: [] as unknown[],
        })),
      })),
    })),
  };
}

/* Mappa mentale interattiva delle variabili (markmap-view via CDN) */
function DatabaseMindmap() {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const ensureScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = Array.from(document.scripts).find((s) => s.src === src);
        if (existing) {
          if ((existing as HTMLScriptElement).dataset.loaded === "1") resolve();
          else existing.addEventListener("load", () => resolve());
          return;
        }
        const el = document.createElement("script");
        el.src = src;
        el.dataset.loaded = "0";
        el.onload = () => { el.dataset.loaded = "1"; resolve(); };
        el.onerror = () => reject(new Error("load error: " + src));
        document.head.appendChild(el);
      });

    (async () => {
      try {
        await ensureScript("https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js");
        await ensureScript("https://cdn.jsdelivr.net/npm/markmap-view@0.18.12/dist/browser/index.js");
        if (cancelled || !svgRef.current) return;
        const markmap = (window as unknown as {
          markmap?: {
            Markmap: { create: (svg: SVGSVGElement, opts: unknown, data: unknown) => unknown };
            deriveOptions?: (o: unknown) => unknown;
          };
        }).markmap;
        if (!markmap) { setFailed(true); return; }
        svgRef.current.innerHTML = "";
        const colors = { color: ["#0E6E73", "#C8102E", "#16A34A", "#D97706"] };
        const opts = markmap.deriveOptions ? markmap.deriveOptions(colors) : null;
        markmap.Markmap.create(svgRef.current, opts, buildMarkmapData());
      } catch {
        setFailed(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (failed) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        Mappa interattiva non disponibile in questo contesto. L'elenco completo delle variabili è
        riportato qui sotto.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <svg ref={svgRef} style={{ display: "block", width: "100%", height: 520 }} />
    </div>
  );
}

function FlowchartDatabase() {
  return (
    <div>
      <SectionTitle>Scarica e consulta i dati</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Il <Kw>flow chart</Kw> mostra le variabili presenti nel file Excel del database. Cliccando sul
        singolo test (nell'elenco sotto) sarai reindirizzato alla <Kw>reference</Kw> tramite il <Kw>DOI</Kw>.
        Poi puoi scaricare l'intero database.
      </p>

      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ background: PAF.petrol }}>
          <Database size={15} /> {DB_COUNT} variabili nel database
        </span>
      </div>

      <p className="mt-4 text-sm font-bold" style={{ color: PAF.petrol }}>Mappa delle variabili</p>
      <p className="mb-2 text-xs text-slate-500">Trascina per spostarti, usa la rotellina per lo zoom e clicca sui nodi per espandere o comprimere i rami.</p>
      <DatabaseMindmap />

      <p className="mt-6 text-sm font-bold" style={{ color: PAF.petrol }}>Elenco completo con riferimenti (DOI)</p>
      <div className="mt-3 grid gap-3">
        {DB_TREE.map((g) => (
          <div key={g.gruppo} className="rounded-lg border border-slate-200 p-4">
            <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>{g.gruppo}</div>
            <div className="mt-2 grid gap-2">
              {g.sotto.map((s) => (
                <div key={s.nome}>
                  <div className="text-xs font-bold text-slate-600">{s.nome}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {s.test.map((t) => (
                      <a
                        key={t}
                        href={refHref(t)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={DOI_MAP[t] ? `Apri DOI: ${DOI_MAP[t]}` : "Apri la reference (DOI da collegare)"}
                        className="group inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 transition hover:bg-slate-200 hover:text-[#0E6E73] hover:underline"
                      >
                        {t}
                        <span className="text-slate-400 group-hover:text-[#0E6E73]">· DOI ↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <PrimaryButton><Download size={16} /> Scarica il database</PrimaryButton>
        <p className="mt-2 text-[11px] text-slate-400">Segnaposto: collegare il file/endpoint reale.</p>
      </div>
    </div>
  );
}

/* ===================== CARICA I TUOI DATI (slide 42) =========== */
function CaricaDati() {
  const [accPipeline, setAccPipeline] = React.useState(false);
  const [accAnon, setAccAnon] = React.useState(false);
  const MAIL = "info@hsantalucia.it";
  const Scarica = ({ label }: { label: string }) => (
    <button className="flex items-center gap-2 text-sm font-semibold underline" style={{ color: PAF.petrol }}>
      <Download size={15} /> {label}
    </button>
  );
  const Check = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <button onClick={() => set(!on)} className="flex items-center gap-2 text-left text-sm text-slate-700">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded border" style={{ borderColor: on ? PAF.petrol : "#cbd5e1", background: on ? PAF.petrol : "#fff" }}>
        {on && <span className="text-[11px] font-bold text-white">✓</span>}
      </span>
      {label}
    </button>
  );
  return (
    <div>
      <div className="text-center text-sm font-bold" style={{ color: PAF.petrol }}>Sezione Ricerca</div>
      <SectionTitle>Carica i tuoi dati</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Scegliendo di <Kw>condividere i tuoi dati</Kw> aiuterai a identificare come l'esposizione a rumore
        in ambiente lavorativo influisce sulle capacità cognitive, fornendo dati essenziali per{" "}
        <Kw>proteggere la salute dei lavoratori</Kw> e migliorare le strategie di prevenzione.
      </p>

      {/* Passi: scarica file di interscambio, accetta condizioni, anonimizza */}
      <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 p-5">
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">1 · Pipeline</div>
          <Scarica label="Scarica pipeline IRCCS Fondazione Santa Lucia" />
          <div className="mt-2"><Check on={accPipeline} set={setAccPipeline} label="Ho letto e accetto la pipeline" /></div>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">2 · File di interscambio</div>
          <div className="grid gap-2">
            <Scarica label="Scarica File Excel annotato con i campi selezionati" />
            <Scarica label="Scarica NESI tradotta in italiano" />
            <Scarica label="Scarica script «anonimizza soggetti e ricercatore»" />
            <Scarica label="Scarica script «anonimizza soggetti»" />
          </div>
          <div className="mt-3"><Check on={accAnon} set={setAccAnon} label="Ho letto e dichiaro di aver anonimizzato i miei dati" /></div>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">3 · Ricarica</div>
          <div className="grid place-items-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Trascina o seleziona il File Excel con i tuoi dati
          </div>
        </div>
        <PrimaryButton full onClick={() => {}}>
          <FileSpreadsheet size={16} /> Invia i dati per la validazione
        </PrimaryButton>
        {(!accPipeline || !accAnon) && (
          <p className="text-center text-[11px] text-slate-400">Per inviare devi accettare la pipeline e dichiarare l'anonimizzazione.</p>
        )}
      </div>

      <p className="mt-4 text-center text-xs italic text-slate-500">
        Se hai dubbi o domande per il caricamento dei dati, puoi contattare <Kw>{MAIL}</Kw>.
      </p>
      <p className="mt-1 text-center text-[11px] text-slate-400">I download e l'upload sono segnaposto: collegare i file/endpoint reali.</p>
    </div>
  );
}