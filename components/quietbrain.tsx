"use client";

/* ==================================================================
 * QuietBrain — interfaccia su Portale Agenti Fisici (PAF)
 * Progetto BRIC INAIL ID07 2024 — Fondazione Santa Lucia IRCCS
 * Federica Piras · Caterina Spada · Ilaria Donato
 * FILE UNICO pronto per v0 / Vercel: incollalo e basta.
 * Dipendenze: React, Tailwind, lucide-react (già in v0).
 *
 * Dove mettere mano:
 *  - PAF (colori)   -> oggetto qui sotto
 *  - calcola()      -> motore LEX,8h (formule indicative)
 *  - LOGHI          -> /public/loghi/*.png
 *  - File Excel     -> metti esempio-database-esperti.xlsx in /public
 * ================================================================== */

import React from "react";
import {
  ArrowLeft, Users, GraduationCap, FlaskConical, Search, Download, Upload,
  ChevronRight, ShieldCheck, Volume2, Ear, Check, X, Mail, FileText, Eye, EyeOff,
  ExternalLink, Info, Gauge, BookOpen, Database, ListFilter, Brain, HeartPulse,
  FileSpreadsheet, AlertTriangle, Activity, Waves,
} from "lucide-react";

/* ----------------------------- TEMA PAF ---------------------------- */
const PAF = {
  petrol: "#15788C", petrolDark: "#0f5a69", petrolSoft: "#e8f3f5",
  red: "#C8102E", redDark: "#a30d26",
  green: "#2f9e44", greenDark: "#2b8a3e",
  ink: "#0f172a", slate: "#475569", line: "#e2e8f0", bg: "#f1f5f9",
  amber: "#e8a33d", orange: "#e8590c", orangeSoft: "#fff3e9",
};

/* nome del file Excel d'esempio (mettilo in /public) */
const FILE_DB = "/esempio-database-esperti.xlsx";

/* ------------------------------ TIPI ------------------------------- */
type Screen =
  | "mappa" | "home" | "categorie" | "selezionaLavoro" | "lavoratoriMenu"
  | "candidati" | "schedaCandidatura" | "areaOperativa" | "simIntro"
  | "sforzoVocale" | "usoDPI" | "compilaCampi" | "outputSimulatore"
  | "esploraDati" | "effettiDiretti" | "effettiIndiretti"
  | "espertiMenu" | "espertiEsplora" | "queries" | "ricercatoriLogin"
  | "creaAccount" | "ricercatoriMenu" | "flowchartDatabase" | "caricaDati";

interface Professione { label: string; }
interface Campi { anni: string; settimane: string; giorni: string; ore: string; }
interface SimState {
  professione: Professione | null; setProfessione: (p: Professione | null) => void;
  sforzoIdx: number | null; setSforzoIdx: (i: number | null) => void;
  usaDPI: boolean | null; setUsaDPI: (v: boolean | null) => void;
  campi: Campi; setCampi: (c: Campi) => void;
}
interface Nav { go: (s: Screen) => void; back: () => void; }
interface PageProps { nav: Nav; sim: SimState; }

/* ------------------------------ DATI ------------------------------- */
/* Scala dello sforzo vocale (autovalutazione). lvl = L_Aeq stimato dB(A). */
const SFORZO_VOCALE = [
  { label: "Parlare normalmente da 1,2 m", lvl: 50 },
  { label: "Alzare la voce da 1,2 m", lvl: 60 },
  { label: "Parlare a voce alta da 1,2 m", lvl: 66 },
  { label: "Parlare a voce molto alta da 1,2 m", lvl: 72 },
  { label: "Gridare da 1,2 m", lvl: 78 },
  { label: "Gridare da 0,6 m", lvl: 84 },
  { label: "Urlare nell'orecchio del tuo interlocutore", lvl: 90 },
];

/* Esplora dati — Effetti diretti: studi per tipo di esposizione */
const STUDI_DIRETTI: Record<"cronica" | "temporanea", { autore: string; qualita: "ALTA" | "MEDIA" | "BASSA"; riassunto: string }[]> = {
  cronica: [
    {
      autore: "Cheng et al., 2019",
      qualita: "ALTA",
      riassunto:
        "Lo studio di Cheng et al., 2019 ha coinvolto 30 piloti da caccia esposti a lungo termine al rumore aeronautico e 30 controlli, valutando memoria di lavoro e attività cerebrale tramite test neurocognitivi, risonanza strutturale e rs-fMRI. I piloti hanno mostrato prestazioni inferiori nei test di memoria verbale e visiva, indicando un deficit di memoria di lavoro. Le analisi di neuroimaging hanno rivelato riduzioni significative del volume di sostanza grigia e dell'attività locale nell'ippocampo sinistro, suggerendo disfunzione neuronale. Alterazioni funzionali sono emerse anche in amigdala, talamo, giro temporale superiore e regioni frontali. Inoltre, le misure strutturali e funzionali dell'ippocampo correlavano direttamente con l'accuratezza nei test di memoria, dimostrando il legame tra danno cerebrale e prestazioni cognitive. In sintesi, l'esposizione cronica al rumore in cabina di pilotaggio degli aerei da combattimento sembra compromettere la memoria di lavoro dei piloti, probabilmente attraverso una disfunzione dell'ippocampo e di altre aree cognitive collegate.",
    },
  ],
  temporanea: [],
};

const ESPERTI_MENU = [
  { titolo: "Popolazione", voci: ["Soggetti Sani", "Subjective Cognitive Decline", "Mild Cognitive Impairment", "Demenza Lieve"] },
  { titolo: "Dati demografici", voci: ["Età", "Sesso", "Professione", "Esposizione al rumore lavoro-correlato"] },
  { titolo: "Dati psicometrici", voci: ["Quadro cognitivo globale", "Attenzione e Funzioni Esecutive", "Memoria", "Linguaggio", "Prassia", "Scale comportamentali", "Consapevolezza", "Benessere psicosociale", "NESI"] },
  { titolo: "Dati audiometrici", voci: ["Perdita di udito rumore-correlata", "Nessuna perdita di udito rumore-correlata"] },
  { titolo: "Dati di neuroimaging", voci: ["Fazekas", "ERICA", "MTA"] },
];

/* Queries (slide 33) — ordine con la nº2 e la nº4 invertite, come da PPT */
const QUERIES = [
  "Come varia l'esposizione al rumore lavoro-correlato in funzione della tipologia (industriale, aviazione, parlato, edile ecc.) nella popolazione studiata?",
  "I diversi livelli di esposizione al rumore discriminano tra punteggi sopra e sotto il cut-off del MMSE (Mini Mental State Examination, test standardizzato che valuta la cognizione globale)?",
  "I diversi livelli di esposizione al rumore discriminano tra presenza o assenza di perdita di acuità uditiva?",
  "La tipologia del rumore a cui è esposto il lavoratore ha effetti diversi su rapidità, inibizione degli stimoli non rilevanti, facilità nel passare da un compito all'altro e memoria?",
  "Alti livelli di esposizione al rumore lavoro-correlato predicono la perdita di volume dell'ippocampo, espresso come MTA (Medial Temporal Atrophy) maggiore o uguale a 2?",
];

const DEFINIZIONI = [
  { sigla: "SCD", titolo: "Subjective Cognitive Decline (Declino Cognitivo Soggettivo)", testo: "Il termine Declino Cognitivo Soggettivo (SCD) indica l'esperienza soggettiva di un peggioramento delle proprie capacità cognitive (in particolare della memoria) che persiste nel tempo in persone con capacità oggettive conservate. Si ritiene che possa rappresentare una fase preclinica della malattia di Alzheimer: uno stadio molto precoce che precede la comparsa di sintomi clinicamente evidenti." },
  { sigla: "MCI", titolo: "Mild Cognitive Impairment (Disturbo Cognitivo Lieve)", testo: "Il Mild Cognitive Impairment (MCI) rappresenta una fase intermedia tra il normale invecchiamento e la demenza. Comporta lievi difficoltà nella memoria, nell'attenzione o nel linguaggio che, pur riscontrabili tramite test clinici, non compromettono l'autonomia quotidiana del soggetto in compiti di facile attuazione." },
  { sigla: "Demenza Lieve", titolo: "Demenza Lieve", testo: "Con il termine Demenza Lieve si intende una mancanza di indipendenza nelle attività quotidiane e una compromissione moderata delle capacità cognitive." },
  { sigla: "Fazekas", titolo: "Scala di Fazekas", testo: "La scala di Fazekas viene utilizzata per quantificare l'estensione delle lesioni in aree profonde del cervello, solitamente esito di micro-eventi ischemici. Tali lesioni sono conseguenza di una malattia dei piccoli vasi: possono non determinare sintomi oppure associarsi a un rallentamento nell'elaborazione cognitiva e nel funzionamento esecutivo." },
  { sigla: "ERICA", titolo: "Punteggio ERICA", testo: "I punteggi ERICA aiutano a identificare visivamente i pazienti con malattia di Alzheimer, valutando la perdita di volume della corteccia entorinale (sintomo prodromico). Il punteggio varia da 0 a 3: valori più alti indicano maggiore atrofia e maggiore probabilità di malattia di Alzheimer." },
  { sigla: "MTA", titolo: "Punteggio MTA", testo: "Il punteggio MTA (atrofia del lobo temporale mediale) distingue i pazienti con disturbo cognitivo lieve (MCI) o morbo di Alzheimer da quelli senza problemi, con una precisione di circa il 75% nella diagnosi e dell'85% nel confermare la malattia di Alzheimer." },
];

const DB_VARIABILI = [
  { gruppo: "Quadro cognitivo globale", test: ["Clinical Dementia Rating scale (Morris, 1997)", "Mini Mental State Examination (Measso et al., 1993)", "T.I.B. (Sartori et al., 2002)"] },
  { gruppo: "Memoria", test: ["FCSRT (Frasson et al., 2011)", "Figura di Rey-Osterrieth — rievocazione (Caffarra, 2002)"] },
  { gruppo: "Attenzione e Funzioni Esecutive", test: ["TMT A-B (Siciliano et al., 2019)"] },
  { gruppo: "Linguaggio", test: ["Fluenza verbale fonologica (Costa et al., 2013)", "Fluenza verbale semantica (Costa et al., 2013)"] },
  { gruppo: "Valutazione Audiometrica", test: ["Timpanometria", "Riflesso stapediale (500–3000 Hz)", "Audiometria (125–8000 Hz)", "BEPTA (Better Ear Pure Tone Average)"] },
  { gruppo: "Indici Neuroradiologici", test: ["Scala di Fazekas", "MTA (Medial Temporal lobe Atrophy)", "ERICA (Entorhinal Cortex Atrophy score)"] },
  { gruppo: "Esposizione al rumore", test: ["NESI (Noise Exposure Structured Interview, Guest et al., 2018)"] },
];

/* anteprima tabellare del database d'esempio (rispecchia il file .xlsx) */
const DB_PREVIEW_COLS = ["id_soggetto", "età", "sesso", "professione", "esposizione", "MMSE", "MTA", "NESI LEX,8h"];
const DB_PREVIEW_ROWS = [
  ["S001", "60-64", "F", "Operai metalmeccanici", "alta", "27", "1", "84.2"],
  ["S002", "65-69", "M", "Saldatori", "alta", "24", "2", "87.5"],
  ["S003", "70-74", "M", "Impiegati amministrativi", "bassa", "28", "0", "72.0"],
];

/* --------------------- MOTORE SIMULATORE LEX,8h -------------------- */
type LivelloClasse = "BASSA" | "MEDIA" | "ALTA" | "MOLTO ALTA";
interface Valutazione { lex: number; livello: LivelloClasse; color: string; titolo: string; sintesi: string; raccomandazione: string; }
const round1 = (n: number) => Math.round(n * 10) / 10;

function valuta(lex: number): Valutazione {
  const v = round1(lex);
  if (lex < 80) return { lex: v, livello: "BASSA", color: PAF.green, titolo: "Esposizione contenuta", sintesi: "Sotto i valori inferiori di azione (LEX < 80 dB(A)).", raccomandazione: "Mantieni le buone pratiche. Ripeti la stima se cambia la tua attività lavorativa." };
  if (lex < 85) return { lex: v, livello: "MEDIA", color: PAF.amber, titolo: "Attenzione consigliata", sintesi: "Tra valore inferiore e superiore di azione (80–85 dB(A)).", raccomandazione: "Sono raccomandati informazione e formazione sui rischi e la disponibilità di DPI uditivi." };
  if (lex < 87) return { lex: v, livello: "ALTA", color: PAF.orange, titolo: "Esposizione elevata", sintesi: "Oltre il valore superiore di azione (85–87 dB(A)).", raccomandazione: "È previsto l'uso dei DPI uditivi e la sorveglianza sanitaria. Valuta misure tecniche di riduzione del rumore." };
  return { lex: v, livello: "MOLTO ALTA", color: PAF.red, titolo: "Esposizione critica", sintesi: "Oltre il valore limite di esposizione (≥ 87 dB(A)).", raccomandazione: "Superato il valore limite: necessari interventi immediati di riduzione e protezione, con valutazione specialistica." };
}

function calcola(p: { sforzoIdx: number; campi: Campi }): Valutazione {
  const lAmbiente = SFORZO_VOCALE[p.sforzoIdx]?.lvl ?? 0;
  const ore = Number(p.campi.ore) || 8;
  const giorni = Number(p.campi.giorni) || 5;
  const settimane = Number(p.campi.settimane) || 46;
  const lexGiorno = lAmbiente + 10 * Math.log10(Math.max(ore, 0.5) / 8);
  const fattoreAnno = (giorni * settimane) / (5 * 46);
  const lex = lexGiorno + 10 * Math.log10(Math.max(fattoreAnno, 0.05));
  return valuta(lex);
}

/* --------------------------- UI PRIMITIVE -------------------------- */
function GreenBtn({ children, onClick, disabled, className = "" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-md px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{ background: PAF.green }}
      onMouseOver={(e) => !disabled && (e.currentTarget.style.background = PAF.greenDark)}
      onMouseOut={(e) => (e.currentTarget.style.background = PAF.green)}>
      {children}
    </button>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-center text-base font-bold uppercase tracking-wide" style={{ color: PAF.petrol }}>{children}</h2>;
}
/* Parola chiave in grassetto per i temi chiave */
function Kw({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-slate-900">{children}</strong>;
}
/* Alert di attenzione ARANCIONE con icona di pericolo (per le cose soggettive/cautele) */
function AlertBox({ children, titolo }: { children: React.ReactNode; titolo?: string }) {
  return (
    <div className="flex gap-3 rounded-md border-l-4 p-4" style={{ background: PAF.orangeSoft, borderColor: PAF.orange }}>
      <AlertTriangle size={20} className="mt-0.5 shrink-0" style={{ color: PAF.orange }} />
      <div className="text-xs leading-relaxed text-slate-700">
        {titolo && <div className="mb-1 text-sm font-bold" style={{ color: PAF.orange }}>{titolo}</div>}
        {children}
      </div>
    </div>
  );
}
/* Pillola che ribadisce: esposizione SOGGETTIVA */
function SoggettivaBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{ background: PAF.orangeSoft, color: PAF.orange, border: `1px solid ${PAF.orange}` }}>
      <Waves size={13} /> Esposizione al rumore soggettiva
    </span>
  );
}
function SoundWave({ className = "h-6 w-28" }: { className?: string }) {
  const bars = [6, 12, 20, 14, 24, 10, 18, 8, 22, 12, 6];
  return (
    <svg viewBox="0 0 120 28" className={className} aria-hidden>
      {bars.map((h, i) => <rect key={i} x={i * 11 + 2} y={14 - h / 2} width="5" height={h} rx="2.5" fill={PAF.petrol} opacity={0.85} />)}
    </svg>
  );
}

/* ----------------------------- LOGHI ------------------------------- */
const LOGHI = [
  { src: "/loghi/inail.png", alt: "INAIL" },
  { src: "/loghi/regionelazio.png", alt: "Regione Lazio" },
  { src: "/loghi/cnr.png", alt: "CNR" },
  { src: "/loghi/educa.png", alt: "EDUCA" },
  { src: "/loghi/santalucia.png", alt: "Fondazione Santa Lucia IRCCS" },
];
function LogoSlot({ src, alt }: { src: string; alt: string }) {
  const [errore, setErrore] = React.useState(false);
  if (errore) return <span className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">{alt}</span>;
  return <img src={src} alt={alt} title={alt} onError={() => setErrore(true)} className="h-9 w-auto object-contain opacity-90" />;
}
function LogoBar() {
  return <div className="flex flex-wrap items-center justify-center gap-5 py-2">{LOGHI.map((l) => <LogoSlot key={l.alt} {...l} />)}</div>;
}

/* --------------------------- CHROME PAF ---------------------------- */
function PortalTopBar() {
  return (
    <div className="w-full text-white" style={{ background: PAF.petrol }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md font-black" style={{ background: PAF.red }}>PÄF</span>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Portale Agenti Fisici</div>
            <div className="text-[11px] opacity-80">INAIL · Regioni · Coordinamento Tecnico</div>
          </div>
        </div>
        <nav className="hidden gap-5 text-sm opacity-90 sm:flex">
          <span>Rumore</span><span>Banche dati</span><span>Calcolatori</span>
          <span className="rounded bg-white/15 px-2 py-0.5 font-semibold">QuietBrain</span>
        </nav>
      </div>
    </div>
  );
}
function AppHeader({ onHome }: { onHome: () => void }) {
  return (
    <button onClick={onHome} className="flex w-full items-center gap-3 rounded-t-xl border border-b-0 border-slate-200 bg-white px-6 py-4 text-left">
      <span className="grid h-8 w-8 place-items-center rounded font-black text-white" style={{ background: PAF.red }}>PÄF</span>
      <div>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">QuietBrain</span>
        <span className="ml-2 align-middle text-xs font-medium" style={{ color: PAF.petrol }}>proteggi la tua mente dal rumore in ambito lavorativo</span>
      </div>
    </button>
  );
}

/* --------------------------- BREADCRUMB ---------------------------- */
const SIM = "Simulatore di esposizione al rumore soggettiva";
const TRAIL: Record<Screen, string> = {
  mappa: "HOME / Mappa del sito", home: "HOME", categorie: "HOME / Categorie",
  selezionaLavoro: "Categorie / Lavoratori e pensionati / Seleziona lavoro",
  lavoratoriMenu: "Categorie / Lavoratori e pensionati",
  candidati: "… / Lavoratori e pensionati / Candidati",
  schedaCandidatura: "… / Candidati / Scheda candidatura",
  areaOperativa: "… / Lavoratori e pensionati / Area operativa",
  simIntro: "… / Area operativa / " + SIM,
  sforzoVocale: "… / Simulatore / Sforzo vocale",
  usoDPI: "… / Simulatore / Uso dei DPI",
  compilaCampi: "… / Simulatore / Dati esposizione",
  outputSimulatore: "… / Simulatore / Risultato",
  esploraDati: "… / Area operativa / Esplora dati",
  effettiDiretti: "… / Esplora dati / Effetti diretti dell'esposizione al rumore",
  effettiIndiretti: "… / Esplora dati / Effetti indiretti dell'esposizione al rumore",
  espertiMenu: "Categorie / Esperti",
  espertiEsplora: "Categorie / Esperti / Esplora dati",
  queries: "Categorie / Esperti / Interroga il database",
  ricercatoriLogin: "Categorie / Ricercatori ed enti / Accedi",
  creaAccount: "Categorie / Ricercatori ed enti / Crea account",
  ricercatoriMenu: "Categorie / Ricercatori ed enti",
  flowchartDatabase: "… / Ricercatori ed enti / Scarica e consulta i dati",
  caricaDati: "… / Ricercatori ed enti / Carica i tuoi dati",
};
function Breadcrumb({ screen, onBack, canBack }: { screen: Screen; onBack: () => void; canBack: boolean; }) {
  return (
    <div className="flex items-center gap-3 border-x border-slate-200 bg-slate-50 px-6 py-2.5 text-xs text-slate-500">
      {canBack && <button onClick={onBack} className="flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-slate-600 hover:bg-slate-200"><ArrowLeft size={13} /> Indietro</button>}
      <span className="truncate italic">{TRAIL[screen]}</span>
    </div>
  );
}

/* ===================================================================
 *                              PAGINE
 * =================================================================== */

/* Slide 3 — Mappa del sito */
function MappaSito({ nav }: PageProps) {
  const rami = [
    { icon: Users, titolo: "Lavoratori e pensionati", voci: ["Seleziona lavoro", "Candidati → Scheda", "Area operativa → Simulatore", "Esplora dati"] },
    { icon: GraduationCap, titolo: "Esperti", voci: ["Esplora dati (5 dimensioni)", "Interroga il database", "Query predefinite"] },
    { icon: FlaskConical, titolo: "Ricercatori ed enti", voci: ["Accedi / Crea account", "Scarica e consulta i dati", "Flow chart database", "Carica i tuoi dati"] },
  ];
  return (
    <div>
      <SectionTitle>Mappa del sito</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">Tre percorsi utente, un'unica piattaforma. Seleziona la categoria per iniziare.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {rami.map((r) => (
          <div key={r.titolo} className="rounded-lg border border-slate-200 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><r.icon size={20} /></span>
            <div className="mt-2 text-sm font-extrabold">{r.titolo}</div>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">{r.voci.map((v) => <li key={v}>· {v}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => nav.go("home")} className="text-sm font-semibold" style={{ color: PAF.petrol }}>Vai alla home →</button>
      </div>
    </div>
  );
}

/* Slide 4 — Homepage */
function Home({ nav }: PageProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <LogoBar />
      <SoundWave className="mt-3 h-6 w-28" />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">QuietBrain</h1>
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: PAF.petrol }}>Proteggi la tua mente dal rumore in ambito lavorativo</p>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600">
        Questa applicazione è stata sviluppata nell'ambito del <Kw>Progetto BRIC INAIL ID07 2024</Kw> ed è
        destinata a lavoratori, pensionati, ricercatori ed enti impegnati nello studio della relazione tra{" "}
        <Kw>esposizione al rumore occupazionale</Kw> e rischio di sviluppo del <Kw>declino cognitivo</Kw>.
      </p>
      <div className="mt-5 max-w-xl text-left">
        <AlertBox>
          Le informazioni fornite dall'applicazione hanno esclusivamente <Kw>scopo informativo e indicativo</Kw> e
          non sono da considerarsi esaustive né sostitutive di valutazioni tecniche, strumentali, cliniche o
          specialistiche. Gli output si basano sulle conoscenze scientifiche attualmente disponibili e sulle analisi
          statistiche effettuate sui dati raccolti nel campione di studio. Per la valutazione accurata dell'esposizione
          al rumore e per qualsiasi approfondimento sanitario e cognitivo, è necessario rivolgersi a{" "}
          <Kw>professionisti esperti</Kw>.
        </AlertBox>
      </div>
      <div className="mt-7"><GreenBtn onClick={() => nav.go("categorie")}>ACCEDI AI SERVIZI</GreenBtn></div>
    </div>
  );
}

/* Slide 5 — Categorie */
function Categorie({ nav }: PageProps) {
  const cards: { title: string; desc: string; icon: any; to: Screen }[] = [
    { title: "LAVORATORI E PENSIONATI", desc: "Stima la tua esposizione al rumore soggettiva e candidati alle sperimentazioni in corso.", icon: Users, to: "selezionaLavoro" },
    { title: "ESPERTI", desc: "Esplora i dati sperimentali e interroga il database con query predefinite.", icon: GraduationCap, to: "espertiMenu" },
    { title: "RICERCATORI E ENTI", desc: "Consulta e scarica il database, oppure carica i dati delle tue indagini.", icon: FlaskConical, to: "ricercatoriLogin" },
  ];
  return (
    <div>
      <p className="mb-6 text-center text-sm text-slate-600">Seleziona la categoria di utente</p>
      <div className="grid gap-4">
        {cards.map((c) => (
          <button key={c.title} onClick={() => nav.go(c.to)} className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-md">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.green }}><c.icon size={22} /></span>
            <div className="flex-1">
              <div className="text-sm font-extrabold tracking-tight">{c.title}</div>
              <div className="text-xs text-slate-500">{c.desc}</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-slate-500" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* Slide 6 — Seleziona lavoro: l'utente SCRIVE la professione (nessun suggerimento) */
function SelezionaLavoro({ nav, sim }: PageProps) {
  const [testo, setTesto] = React.useState(sim.professione?.label ?? "");
  const conferma = () => { const v = testo.trim(); if (v.length < 2) return; sim.setProfessione({ label: v }); nav.go("lavoratoriMenu"); };
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Le seguenti domande servono a valutare il <Kw>rischio di alterazioni e/o declino cognitivo</Kw> associate
        all'<Kw>esposizione al rumore</Kw> specifico per la tua attività lavorativa.
      </p>
      <label className="mb-1 block text-xs font-semibold text-slate-600">Scrivi la tua professione</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input value={testo} onChange={(e) => setTesto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && conferma()}
          placeholder="Scrivi qui la tua professione…"
          className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500" autoComplete="off" />
      </div>
      <div className="mt-6"><GreenBtn onClick={conferma} disabled={testo.trim().length < 2}>CONFERMA PROFESSIONE</GreenBtn></div>
    </div>
  );
}

/* Slide 7 — Lavoratori: Candidati / Area operativa */
function LavoratoriMenu({ nav, sim }: PageProps) {
  return (
    <div>
      <SectionTitle>Sezione lavoro</SectionTitle>
      {sim.professione && <p className="mt-2 text-center text-xs text-slate-500">Professione: <b>{sim.professione.label}</b></p>}
      <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">Attraverso questa piattaforma potrai:</p>
      <ul className="mx-auto mt-2 max-w-lg list-disc space-y-1 pl-6 text-sm text-slate-600">
        <li><Kw>candidarti</Kw> e partecipare alle sperimentazioni in corso per lo studio dell'esposizione al rumore in ambito occupazionale e del suo ruolo nel rischio di sviluppare <Kw>declino cognitivo</Kw>;</li>
        <li><Kw>esplorare i dati</Kw> presenti in letteratura sugli effetti diretti e indiretti del rumore occupazionale sul rischio di sviluppare alterazioni o declino cognitivo.</li>
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <GreenBtn onClick={() => nav.go("candidati")}>CANDIDATI</GreenBtn>
        <GreenBtn onClick={() => nav.go("areaOperativa")}>AREA OPERATIVA</GreenBtn>
      </div>
    </div>
  );
}

/* Slide 25 — Candidati */
function Candidati({ nav }: PageProps) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: PAF.petrolSoft }}><FileText style={{ color: PAF.petrol }} size={26} /></span>
      <h2 className="mt-3 text-base font-bold">Scarica la scheda candidatura e inviala</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Scarica la scheda, compilala e inviala alla mail associata.</p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <GreenBtn onClick={() => nav.go("schedaCandidatura")} className="inline-flex items-center gap-2"><Download size={16} /> Scarica la scheda</GreenBtn>
        <a className="flex items-center gap-2 text-sm font-semibold" style={{ color: PAF.petrol }} href="mailto:info@hsantalucia.it"><Mail size={16} /> info@hsantalucia.it</a>
      </div>
    </div>
  );
}

/* Slide 26 — Scheda candidatura */
function SchedaCandidatura({ sim }: PageProps) {
  const campi = ["Nome", "Cognome", "Data di nascita", "E-mail", "Telefono", "Professione attuale o precedente"];
  return (
    <div className="mx-auto max-w-md">
      <h2 className="text-center text-base font-bold">Scheda candidatura</h2>
      <p className="mt-2 text-center text-xs text-slate-500">Compila i campi, scarica il PDF e invialo a info@hsantalucia.it</p>
      <div className="mt-5 grid gap-3">
        {campi.map((c) => (
          <label key={c} className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">{c}</span>
            <input defaultValue={c === "Professione attuale o precedente" ? sim.professione?.label ?? "" : ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
          </label>
        ))}
        <label className="flex items-start gap-2 text-xs text-slate-600"><input type="checkbox" className="mt-0.5" /> Acconsento al trattamento dei dati per le finalità della ricerca.</label>
      </div>
      <div className="mt-5 text-center"><GreenBtn>SCARICA SCHEDA (PDF)</GreenBtn></div>
    </div>
  );
}

/* Slide 8 — Area operativa */
function AreaOperativa({ nav }: PageProps) {
  return (
    <div className="grid gap-4">
      <button onClick={() => nav.go("simIntro")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><Gauge size={20} /></span>
        <div>
          <div className="text-sm font-extrabold uppercase tracking-wide" style={{ color: PAF.petrol }}>Simulatore di esposizione al rumore soggettiva</div>
          <p className="mt-1 text-xs text-slate-500">Stima il tuo LEX,8h annuo a partire da poche informazioni sulla tua attività.</p>
        </div>
      </button>
      <button onClick={() => nav.go("esploraDati")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><BookOpen size={20} /></span>
        <div>
          <div className="text-sm font-extrabold uppercase tracking-wide" style={{ color: PAF.petrol }}>Esplora dati</div>
          <p className="mt-1 text-xs text-slate-500">Effetti diretti e indiretti dell'esposizione al rumore, sintetizzati dalla letteratura.</p>
        </div>
      </button>
    </div>
  );
}

/* Slide 9 — Simulatore intro */
function SimulatoreIntro({ nav }: PageProps) {
  return (
    <div className="text-center">
      <div className="mb-3 flex justify-center"><SoggettivaBadge /></div>
      <SoundWave className="mx-auto h-6 w-28" />
      <h2 className="mt-3 text-base font-bold">Simulatore di esposizione al rumore soggettiva</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
        Le domande si riferiscono all'attività lavorativa svolta <Kw>nell'ultimo anno</Kw>: rispondi facendo
        riferimento a ciò che hai sperimentato abitualmente. Al termine riceverai il <Kw>LEX,8h annuo stimato</Kw>, un
        valore medio calcolato sulle 8 ore lavorative giornaliere. È un valore <Kw>puramente indicativo</Kw> e{" "}
        <Kw>soggettivo</Kw>, non sostitutivo di misurazioni professionali.
      </p>
      <div className="mt-6"><GreenBtn onClick={() => nav.go("sforzoVocale")}>PROCEDI ALLA SIMULAZIONE</GreenBtn></div>
    </div>
  );
}

/* Slide 10 — Sforzo vocale */
function SforzoVocale({ nav, sim }: PageProps) {
  const scegli = (i: number) => { sim.setSforzoIdx(i); nav.go("usoDPI"); };
  return (
    <div>
      <div className="mb-3"><SoggettivaBadge /></div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Immagina di essere al lavoro e di dover parlare con una persona a circa <Kw>1,2 m</Kw> di distanza, con udito
        normale e senza protezioni acustiche. In base allo <Kw>sforzo vocale</Kw> che dovresti fare per farti capire,
        scegli il livello corrispondente.
      </p>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="bg-violet-100 px-4 py-2 text-sm font-bold text-violet-900">Sforzo vocale richiesto</div>
        {SFORZO_VOCALE.map((s, i) => (
          <button key={s.label} onClick={() => scegli(i)}
            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${sim.sforzoIdx === i ? "bg-violet-50 font-semibold" : "hover:bg-slate-50"} ${i % 2 ? "bg-white" : "bg-violet-50/40"}`}>
            <span>{s.label}</span>
            <span className={`grid h-5 w-5 place-items-center rounded-full border ${sim.sforzoIdx === i ? "border-violet-600 bg-violet-600" : "border-slate-300"}`}>{sim.sforzoIdx === i && <Check size={13} className="text-white" />}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Slide 11/12 — Uso dei DPI: chiesto direttamente. Nessun dato tecnico:
 * i DPI saranno selezionati dalla banca dati DPI del portale PAF. */
function UsoDPI({ nav, sim }: PageProps) {
  const rispondi = (usa: boolean) => { sim.setUsaDPI(usa); nav.go("compilaCampi"); };
  return (
    <div className="text-center">
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: PAF.petrolSoft }}><Ear size={26} style={{ color: PAF.petrol }} /></span>
      <h2 className="text-base font-bold">Utilizzi i dispositivi di protezione individuale?</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        Durante la tua attività lavorativa indossi abitualmente <Kw>DPI uditivi</Kw> (inserti auricolari, cuffie
        antirumore o archetti) per proteggerti dal rumore?
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button onClick={() => rispondi(true)} className="flex w-36 flex-col items-center gap-2 rounded-lg border-2 p-5 transition hover:shadow-md" style={{ borderColor: sim.usaDPI === true ? PAF.green : PAF.line }}>
          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: PAF.green }}><Check size={18} /></span>
          <span className="text-sm font-bold">Sì, li uso</span>
        </button>
        <button onClick={() => rispondi(false)} className="flex w-36 flex-col items-center gap-2 rounded-lg border-2 p-5 transition hover:shadow-md" style={{ borderColor: sim.usaDPI === false ? PAF.petrol : PAF.line }}>
          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: PAF.slate }}><X size={18} /></span>
          <span className="text-sm font-bold">No, non li uso</span>
        </button>
      </div>
      <div className="mt-6 flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
        <Info size={16} className="mt-0.5 shrink-0" style={{ color: PAF.petrol }} />
        <span>Gli specifici <Kw>DPI</Kw> verranno selezionati dalla <Kw>banca dati DPI del Portale Agenti Fisici (PAF)</Kw>.</span>
      </div>
    </div>
  );
}

/* Slide 14 — Compila i campi di esposizione */
function CompilaCampi({ nav, sim }: PageProps) {
  const { campi, setCampi } = sim;
  const FIELDS = [
    { key: "anni", label: "Anni lavorativi", ph: "es. 12" },
    { key: "settimane", label: "Settimane lavorative all'anno", ph: "es. 46" },
    { key: "giorni", label: "Giorni a settimana", ph: "es. 5" },
    { key: "ore", label: "Ore giornaliere", ph: "es. 8" },
  ] as const;
  const totale = (Number(campi.anni) || 0) * (Number(campi.settimane) || 0) * (Number(campi.giorni) || 0) * (Number(campi.ore) || 0);
  const completo = FIELDS.every((f) => (campi as any)[f.key] !== "");
  return (
    <div>
      <p className="mb-5 text-sm text-slate-600">Compila gli spazi bianchi con le informazioni richieste, inserendo i dati in modo completo e accurato.</p>
      <div className="grid gap-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">{f.label}</span>
            <input type="number" min={0} placeholder={f.ph} value={(campi as any)[f.key]} onChange={(e) => setCampi({ ...campi, [f.key]: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
          </label>
        ))}
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm"><span className="text-slate-500">Totale ore stimate: </span><span className="font-bold">{totale.toLocaleString("it-IT")}</span></div>
      </div>
      <div className="mt-6 flex justify-end"><GreenBtn onClick={() => nav.go("outputSimulatore")} disabled={!completo}>CALCOLA L'ESPOSIZIONE</GreenBtn></div>
    </div>
  );
}

/* Legenda visiva delle 4 classi */
function Legenda() {
  const classi = [
    { nome: "BASSA", range: "< 80 dB(A)", color: PAF.green },
    { nome: "MEDIA", range: "80–85 dB(A)", color: PAF.amber },
    { nome: "ALTA", range: "85–87 dB(A)", color: PAF.orange },
    { nome: "MOLTO ALTA", range: "≥ 87 dB(A)", color: PAF.red },
  ];
  return (
    <div className="mt-5">
      <div className="mb-2 text-xs font-semibold text-slate-600">Scala delle classi di esposizione</div>
      <div className="flex overflow-hidden rounded-md">
        {classi.map((c) => (
          <div key={c.nome} className="flex-1 px-2 py-1.5 text-center text-white" style={{ background: c.color }}>
            <div className="text-[10px] font-bold leading-tight">{c.nome}</div>
            <div className="text-[9px] opacity-90">{c.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Slide 17 — Output: badge unico (esposizione SOGGETTIVA) + alert in rilievo */
function OutputSimulatore({ sim }: PageProps) {
  if (sim.sforzoIdx === null) return <p className="text-sm text-slate-500">Completa prima la simulazione.</p>;
  const v = calcola({ sforzoIdx: sim.sforzoIdx, campi: sim.campi });
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2"><Volume2 style={{ color: PAF.petrol }} /><h2 className="text-base font-bold">Risultato della tua stima</h2></div>
        <SoggettivaBadge />
      </div>
      <p className="mb-5 text-sm text-slate-600">Ecco la tua <Kw>esposizione annua equivalente</Kw> (LEX,8h) e la relativa <Kw>classe di rischio</Kw> secondo il <Kw>D.Lgs 81/08, art. 189</Kw>.</p>

      {/* badge unico */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: v.color }}>
        <div className="px-5 py-4 text-white" style={{ background: v.color }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest opacity-90">Classe di esposizione annua</div>
              <div className="mt-0.5 text-2xl font-black leading-tight">Classe {v.livello}</div>
              <div className="text-sm font-medium opacity-95">{v.titolo}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black leading-none">{v.lex.toFixed(1)}</div>
              <div className="text-xs font-bold opacity-90">LEX,8h dB(A)</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 bg-white px-5 py-3">
          <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Cosa significa: </span>{v.sintesi}</p>
          <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Cosa fare: </span>{v.raccomandazione}</p>
        </div>
      </div>

      <Legenda />

      {/* DISCLAIMER in rilievo, arancione con icona pericolo */}
      <div className="mt-5">
        <AlertBox titolo="Attenzione: risultato soggettivo">
          I livelli di rumore e la classe di rischio derivano da <Kw>stime soggettive basate sulla tua percezione</Kw>.
          La classe è attribuita secondo il <Kw>D.Lgs 81/08, art. 189</Kw>. Questi risultati{" "}
          <Kw>non derivano da misurazioni strumentali</Kw>: per una valutazione professionale rivolgiti a esperti.
        </AlertBox>
      </div>

      <button className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: PAF.petrol }}>Per approfondire clicca qui: Valutazione del Rischio del Rumore <ChevronRight size={15} /></button>
    </div>
  );
}

/* Slide 20 — Esplora dati */
function EsploraDati({ nav }: PageProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">Seleziona «Clicca qui» per indagare rispettivamente gli effetti diretti e gli effetti indiretti dell'esposizione al rumore.</p>
      <button onClick={() => nav.go("effettiDiretti")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><Brain size={20} /></span>
        <div>
          <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>Effetti diretti dell'esposizione al rumore</div>
          <p className="mt-1 text-xs text-slate-500">Esposizione cronica e temporanea, con la qualità delle evidenze per ciascuno studio.</p>
        </div>
      </button>
      <button onClick={() => nav.go("effettiIndiretti")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><HeartPulse size={20} /></span>
        <div>
          <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>Effetti indiretti dell'esposizione al rumore</div>
          <p className="mt-1 text-xs text-slate-500">Categorie di effetti indiretti descritte dai dati aggregati delle evidenze.</p>
        </div>
      </button>
    </div>
  );
}

/* Slide 21/22 — Effetti diretti: cronica/temporanea → studio (Cheng et al.) */
function EffettiDiretti() {
  const [tab, setTab] = React.useState<"cronica" | "temporanea">("cronica");
  const [studioIdx, setStudioIdx] = React.useState<number | null>(0);
  const studi = STUDI_DIRETTI[tab];
  const studio = studioIdx !== null ? studi[studioIdx] : null;
  const colQ = (q: string) => (q === "ALTA" ? PAF.green : q === "MEDIA" ? PAF.amber : PAF.orange);
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold">Effetti diretti dell'esposizione al rumore in ambiente lavorativo</h3>
      <div className="mb-4 flex gap-2 text-sm">
        {(["cronica", "temporanea"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setStudioIdx(0); }} className={`rounded-md px-3 py-1.5 font-semibold ${tab === t ? "text-white" : "bg-slate-100 text-slate-600"}`} style={tab === t ? { background: PAF.petrol } : {}}>Esposizione al rumore {t}</button>
        ))}
      </div>

      {studi.length === 0 ? (
        <p className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-500">Studi in aggiornamento: i risultati saranno descritti al termine delle nostre analisi.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {studi.map((s, i) => (
            <button key={s.autore} onClick={() => setStudioIdx(i)} className={`rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${studioIdx === i ? "border-slate-500 bg-slate-50" : "border-slate-200 hover:bg-slate-50"}`} style={{ color: PAF.petrol }}>{s.autore}</button>
          ))}
        </div>
      )}

      {studio && (
        <div className="mt-5">
          <AlertBox>Il contenuto presentato si basa su un <Kw>singolo studio scientifico</Kw>. I risultati devono essere interpretati nel contesto della ricerca disponibile e <Kw>non costituiscono evidenze definitive</Kw>.</AlertBox>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{studio.riassunto}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-md px-3 py-1.5 text-sm font-bold text-white" style={{ background: colQ(studio.qualita) }}>Qualità delle evidenze: {studio.qualita}</span>
          </div>
          <button className="mt-3 text-xs font-semibold underline" style={{ color: PAF.petrol }}>Clicca qui per approfondire cosa si intende per Qualità delle evidenze</button>
        </div>
      )}
    </div>
  );
}

/* Slide 23 — Effetti indiretti */
function EffettiIndiretti() {
  const VOCI = ["Stress fisiologico", "Disturbi del sonno", "Aumento della pressione arteriosa", "Alterazioni dell'umore", "Ridotta qualità della comunicazione", "Affaticamento e ridotta concentrazione"];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Saranno inserite al massimo <Kw>10 voci</Kw> relative alle categorie di effetti indiretti dell'esposizione al rumore in ambiente lavorativo. Gli effetti saranno descritti al termine delle nostre analisi; per ciascuna voce verranno fornite informazioni riassuntive sulla base dei dati aggregati di più evidenze.</p>
      <div className="grid gap-2 sm:grid-cols-2">{VOCI.map((v) => <div key={v} className="rounded-md border border-slate-200 px-4 py-3 text-sm font-medium">{v}</div>)}</div>
    </div>
  );
}

/* Slide 28 — Esperti menu */
function EspertiMenu({ nav }: PageProps) {
  return (
    <div>
      <SectionTitle>Sezione esperti</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">Attraverso questa piattaforma potrai esplorare i <Kw>dati sperimentali</Kw> relativi agli effetti cognitivi dell'esposizione al rumore lavoro-correlata e selezionare delle <Kw>query predefinite</Kw> per interrogare direttamente il database.</p>
      <div className="mt-7 grid gap-4">
        <button onClick={() => nav.go("espertiEsplora")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><Database size={20} /></span>
          <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>ESPLORA DATI</div><p className="mt-1 text-xs text-slate-500">Filtra per popolazione, demografia, psicometria, audiometria e neuroimaging.</p></div>
        </button>
        <button onClick={() => nav.go("queries")} className="flex items-start gap-3 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><ListFilter size={20} /></span>
          <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>INTERROGA IL DATABASE</div><p className="mt-1 text-xs text-slate-500">Seleziona una delle query predefinite per interrogare direttamente il database.</p></div>
        </button>
      </div>
    </div>
  );
}

/* Pop-up definizioni cliniche */
function PopupDefinizione({ sigla, onClose }: { sigla: string; onClose: () => void }) {
  const def = DEFINIZIONI.find((d) => d.sigla === sigla);
  if (!def) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold" style={{ color: PAF.petrol }}>{def.titolo}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{def.testo}</p>
      </div>
    </div>
  );
}

/* Slide 29 — Esperti / Esplora dati (5 menù + pop-up) */
function EspertiEsplora() {
  const SIGLE = DEFINIZIONI.map((d) => d.sigla);
  const [aperto, setAperto] = React.useState<string | null>(null);
  const [sel, setSel] = React.useState<Record<string, string>>({});
  const [popup, setPopup] = React.useState<string | null>(null);
  const apri = (voce: string) => { const m = SIGLE.find((s) => voce.toLowerCase().includes(s.toLowerCase().split(" ")[0])); if (m) setPopup(m); };
  return (
    <div>
      <p className="mb-5 text-sm text-slate-600">Seleziona i criteri con cui visualizzare i dati raccolti. Ogni menù rappresenta una <Kw>dimensione del dataset</Kw> (input → output).</p>
      <div className="grid gap-3">
        {ESPERTI_MENU.map((m) => (
          <div key={m.titolo} className="rounded-md border border-slate-200">
            <button onClick={() => setAperto(aperto === m.titolo ? null : m.titolo)} className="flex w-full items-center justify-between px-4 py-3 text-left">
              <span className="text-sm font-bold" style={{ color: PAF.petrol }}>{m.titolo}</span>
              <div className="flex items-center gap-2">
                {sel[m.titolo] && <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{sel[m.titolo]}</span>}
                <ChevronRight size={16} className={`text-slate-400 transition ${aperto === m.titolo ? "rotate-90" : ""}`} />
              </div>
            </button>
            {aperto === m.titolo && (
              <div className="border-t border-slate-100 p-2">
                {m.voci.map((v) => {
                  const haDef = SIGLE.some((s) => v.toLowerCase().includes(s.toLowerCase().split(" ")[0]));
                  return (
                    <div key={v} className="flex items-center justify-between">
                      <button onClick={() => { setSel({ ...sel, [m.titolo]: v }); setAperto(null); apri(v); }} className="flex-1 rounded px-3 py-1.5 text-left text-sm hover:bg-slate-50">{v}</button>
                      {haDef && <button onClick={() => apri(v)} className="px-2 text-slate-400 hover:text-slate-600" title="Cosa significa?"><Info size={14} /></button>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* anteprima del database d'esempio (.xlsx) */}
      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold" style={{ color: PAF.petrol }}><FileSpreadsheet size={16} /> Esempio di database</div>
          <a href={FILE_DB} download className="flex items-center gap-1 text-xs font-semibold" style={{ color: PAF.green }}><Download size={13} /> Scarica esempio (.xlsx)</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-slate-500">{DB_PREVIEW_COLS.map((c) => <th key={c} className="border-b border-slate-200 px-2 py-1 font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody>
              {DB_PREVIEW_ROWS.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j} className="border-b border-slate-100 px-2 py-1 text-slate-600">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Anteprima di alcune colonne. Il file completo contiene anche i dati audiometrici, gli altri test psicometrici e un foglio "Legenda" con i riferimenti (DOI).</p>
      </div>

      {popup && <PopupDefinizione sigla={popup} onClose={() => setPopup(null)} />}
    </div>
  );
}

/* Slide 33/34 — Query esperto */
function Queries() {
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <div>
      <h3 className="mb-1 text-sm font-extrabold uppercase tracking-wide" style={{ color: PAF.petrol }}>Query esperto</h3>
      <p className="mb-4 text-xs text-slate-500">L'esperto potrà interrogare il database a partire dalle query proposte.</p>
      <div className="grid gap-2">
        {QUERIES.map((q, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)} className={`rounded-md border px-4 py-3 text-left text-sm transition ${active === i ? "border-slate-500 bg-slate-50" : "border-slate-200 hover:bg-slate-50"}`}>
            <span className="mr-2 font-bold" style={{ color: PAF.petrol }}>{i + 1}.</span>{q}
            {active === i && <div className="mt-3 rounded bg-white p-3 text-xs text-slate-500">Esecuzione query sul database… risultati aggregati mostrati in forma anonima. (Anteprima dimostrativa — collegare l'endpoint del database.)</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Slide 36 — Ricercatori login */
function RicercatoriLogin({ nav }: PageProps) {
  const [showPwd, setShowPwd] = React.useState(false);
  return (
    <div className="mx-auto max-w-md">
      <SectionTitle>Accesso ricercatori</SectionTitle>
      <p className="mt-3 text-center text-sm text-slate-600">Compila i campi «e-mail» e «password» e seleziona «ACCEDI». L'accesso è riservato ai ricercatori autorizzati.</p>
      <div className="mt-6 grid gap-4">
        <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">E-mail</span><input type="email" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" /></label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Password</span>
          <div className="relative">
            <input type={showPwd ? "text" : "password"} className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none focus:border-slate-500" />
            <button onClick={() => setShowPwd(!showPwd)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" type="button">{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </label>
        <GreenBtn onClick={() => nav.go("ricercatoriMenu")} className="w-full">ACCEDI</GreenBtn>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-600">Non hai un account?<button onClick={() => nav.go("creaAccount")} className="font-bold" style={{ color: PAF.red }}>Crea account</button></div>
      <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-400"><ShieldCheck size={13} /> Dati protetti e utilizzati esclusivamente per finalità scientifiche.</p>
    </div>
  );
}

/* Slide 37 — Crea account */
function CreaAccount({ nav }: PageProps) {
  const [accept, setAccept] = React.useState(false);
  const FIELDS: [string, string][] = [["Nome *", "text"], ["Cognome *", "text"], ["E-mail (nome utente) *", "email"], ["Numero di iscrizione all'Albo di appartenenza", "text"], ["Università / Ente di afferenza", "text"], ["Titolo", "text"], ["Password *", "password"]];
  return (
    <div className="mx-auto max-w-md">
      <SectionTitle>Crea account</SectionTitle>
      <p className="mt-2 text-center text-xs text-slate-500">Per visualizzare i dati caricati finora o caricare a tua volta i dati raccolti durante precedenti indagini, crea un account utente.</p>
      <div className="mt-5 grid gap-3">
        {FIELDS.map(([label, type]) => <label key={label} className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span><input type={type} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" /></label>)}
        <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" /> PhD</label>
        <p className="text-[11px] text-slate-400">* dato obbligatorio</p>
      </div>
      <div className="mt-3"><AlertBox>I dati saranno mostrati in maniera <Kw>aggregata</Kw> e non saranno visualizzate informazioni sensibili dagli altri utenti.</AlertBox></div>
      <button className="mt-3 flex items-center gap-2 text-sm font-semibold" style={{ color: PAF.petrol }}><Download size={15} /> Scarica il PDF «Privacy»</button>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-600"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5" /> Ho letto e accetto le condizioni di utilizzo</label>
      <button onClick={() => nav.go("ricercatoriMenu")} disabled={!accept} className="mt-5 w-full rounded-md px-6 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40" style={{ background: PAF.orange }}>CREA ACCOUNT</button>
    </div>
  );
}

/* Slide 38 — Ricercatori menu */
function RicercatoriMenu({ nav }: PageProps) {
  return (
    <div className="grid gap-4">
      <button onClick={() => nav.go("flowchartDatabase")} className="flex items-center gap-4 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><Download size={20} /></span>
        <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>SCARICA E CONSULTA I DATI</div><p className="text-xs text-slate-500">Flow chart dinamico delle variabili e download dell'intero database.</p></div>
      </button>
      <button onClick={() => nav.go("caricaDati")} className="flex items-center gap-4 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: PAF.petrol }}><Upload size={20} /></span>
        <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>CARICA I TUOI DATI</div><p className="text-xs text-slate-500">Scarica il modello Excel annotato, compilalo e ricaricalo in piattaforma.</p></div>
      </button>
    </div>
  );
}

/* Slide 39/40 — Flow chart database + esempio Excel + download */
function FlowchartDatabase() {
  return (
    <div>
      <p className="mb-1 text-sm italic text-slate-500">All'interno del database sono consultabili le seguenti variabili:</p>
      <p className="mb-5 text-xs text-slate-500">Cliccando sul singolo test sarai reindirizzato alla reference tramite <Kw>DOI</Kw>. Successivamente potrai scaricare l'intero database.</p>
      <div className="space-y-4">
        {DB_VARIABILI.map((g) => (
          <div key={g.gruppo} className="rounded-md border border-slate-200 p-4">
            <div className="text-sm font-bold" style={{ color: PAF.petrol }}>{g.gruppo}</div>
            <ul className="mt-2 space-y-1.5">{g.test.map((t) => <li key={t}><button className="flex items-center gap-1.5 text-left text-xs text-slate-600 hover:underline"><ExternalLink size={12} className="shrink-0 text-slate-400" /> {t}</button></li>)}</ul>
          </div>
        ))}
      </div>

      {/* anteprima del file Excel d'esempio */}
      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: PAF.petrol }}><FileSpreadsheet size={16} /> Esempio del file Excel del database</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead><tr className="text-slate-500">{DB_PREVIEW_COLS.map((c) => <th key={c} className="border-b border-slate-200 px-2 py-1 font-semibold">{c}</th>)}</tr></thead>
            <tbody>{DB_PREVIEW_ROWS.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j} className="border-b border-slate-100 px-2 py-1 text-slate-600">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={FILE_DB} download><GreenBtn className="inline-flex items-center gap-2"><Download size={16} /> Scarica il database</GreenBtn></a>
        <a href={FILE_DB} download className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-bold" style={{ borderColor: PAF.petrol, color: PAF.petrol }}><FileSpreadsheet size={16} /> Scarica esempio (.xlsx)</a>
      </div>
    </div>
  );
}

/* Slide 42/43/44 — Carica i tuoi dati */
function CaricaDati() {
  const [tipo, setTipo] = React.useState<"soggettiva" | "oggettiva">("soggettiva");
  const checklist = [
    "DATI DEMOGRAFICI *",
    "ESITI MISURE AUDIOMETRICHE *",
    tipo === "soggettiva" ? "ESPOSIZIONE AL RUMORE SOGGETTIVA - NESI *" : "ESPOSIZIONE AL RUMORE OGGETTIVA ACUTA *",
    "ESITI MISURE PSICOMETRICHE e/o ESITI MISURE DI NEUROIMAGING *",
  ];
  const download = [
    "Scarica la pipeline IRCCS Fondazione Santa Lucia",
    "Scarica la NESI tradotta in italiano",
    "Scarica lo script «anonimizza soggetti»",
    "Scarica lo script «anonimizza soggetti e ricercatore»",
  ];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Sbarra le celle relative alle sezioni di interesse, scarica il file Excel annotato con i campi selezionati, compilalo e ricaricalo. I campi con * sono <Kw>obbligatori</Kw>.</p>

      <div className="mb-4 flex gap-2">
        {(["soggettiva", "oggettiva"] as const).map((t) => <button key={t} onClick={() => setTipo(t)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${tipo === t ? "text-white" : "bg-slate-100 text-slate-600"}`} style={tipo === t ? { background: PAF.petrol } : {}}>{t === "soggettiva" ? "Esposizione rumore soggettiva" : "Esposizione rumore oggettiva acuta"}</button>)}
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: PAF.orange }}>{tipo === "soggettiva" ? "Esposizione rumore soggettiva" : "Esposizione rumore oggettiva acuta"}</p>
      <p className="mb-2 text-xs text-slate-500">Relativamente al campione indagato, devi fornire le seguenti informazioni:</p>
      <div className="grid gap-2">{checklist.map((c) => <label key={c} className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm"><input type="checkbox" defaultChecked /> {c}</label>)}</div>

      {tipo === "oggettiva" && (
        <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
          <div className="mb-1 font-semibold">Strumentazione utilizzata</div>
          Fonometro (marca/modello/classe) · Data taratura fonometro · Calibratore (marca/modello/classe) · Data taratura calibratore.
        </div>
      )}

      <div className="mt-5 grid gap-2 text-sm">
        {download.map((d) => <button key={d} className="flex items-center gap-2 text-left font-semibold" style={{ color: PAF.petrol }}><Download size={15} /> {d}</button>)}
        <a href={FILE_DB} download className="flex items-center gap-2 text-left font-semibold" style={{ color: PAF.petrol }}><FileSpreadsheet size={15} /> Scarica il modello di compilazione database ({tipo === "soggettiva" ? "esposizione soggettiva" : "esposizione oggettiva"})</a>
      </div>

      <div className="mt-5 space-y-2">
        {["Ho letto e accetto la pipeline", "Ho letto e dichiaro di aver anonimizzato i miei dati"].map((t) => <label key={t} className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" /> {t}</label>)}
      </div>

      <div className="mt-5 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
        <Upload className="mx-auto text-slate-400" size={28} />
        <p className="mt-2 text-sm font-semibold text-slate-600">Carica i tuoi dati anonimizzati</p>
        <p className="text-xs text-slate-400">Formato accettato: .xlsx</p>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">Se hai dubbi o domande per il caricamento dei dati, puoi contattare info@hsantalucia.it</p>
    </div>
  );
}

/* ===================================================================
 *                       COMPONENTE PRINCIPALE
 * =================================================================== */
const PAGES: Record<Screen, React.ComponentType<any>> = {
  mappa: MappaSito, home: Home, categorie: Categorie, selezionaLavoro: SelezionaLavoro,
  lavoratoriMenu: LavoratoriMenu, candidati: Candidati, schedaCandidatura: SchedaCandidatura,
  areaOperativa: AreaOperativa, simIntro: SimulatoreIntro, sforzoVocale: SforzoVocale,
  usoDPI: UsoDPI, compilaCampi: CompilaCampi, outputSimulatore: OutputSimulatore,
  esploraDati: EsploraDati, effettiDiretti: EffettiDiretti, effettiIndiretti: EffettiIndiretti,
  espertiMenu: EspertiMenu, espertiEsplora: EspertiEsplora, queries: Queries,
  ricercatoriLogin: RicercatoriLogin, creaAccount: CreaAccount, ricercatoriMenu: RicercatoriMenu,
  flowchartDatabase: FlowchartDatabase, caricaDati: CaricaDati,
};

export default function QuietBrain() {
  const [storia, setStoria] = React.useState<Screen[]>(["home"]);
  const screen = storia[storia.length - 1];

  const [professione, setProfessione] = React.useState<Professione | null>(null);
  const [sforzoIdx, setSforzoIdx] = React.useState<number | null>(null);
  const [usaDPI, setUsaDPI] = React.useState<boolean | null>(null);
  const [campi, setCampi] = React.useState<Campi>({ anni: "", settimane: "", giorni: "", ore: "" });

  const nav: Nav = {
    go: (s) => setStoria((h) => [...h, s]),
    back: () => setStoria((h) => (h.length > 1 ? h.slice(0, -1) : h)),
  };
  const sim: SimState = { professione, setProfessione, sforzoIdx, setSforzoIdx, usaDPI, setUsaDPI, campi, setCampi };

  const Page = PAGES[screen];

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 antialiased">
      <PortalTopBar />
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
        <AppHeader onHome={() => setStoria(["home"])} />
        <Breadcrumb screen={screen} onBack={nav.back} canBack={storia.length > 1} />
        <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white px-6 py-8 shadow-sm">
          <Page nav={nav} sim={sim} />
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Federica Piras · Caterina Spada · Ilaria Donato — Fondazione Santa Lucia IRCCS
          <br />
          Progetto BRIC INAIL ID07 2024 · Interfaccia su Portale Agenti Fisici (PAF)
        </p>
      </div>
    </div>
  );
}
