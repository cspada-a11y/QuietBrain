"use client";

/* ==================================================================
 * QuietBrain — interfaccia su Portale Agenti Fisici (PAF)
 * Progetto BRIC INAIL ID07 2024 — Fondazione Santa Lucia IRCCS
 * FILE UNICO pronto per v0 / Vercel: incollalo e basta.
 * Dipendenze: React, Tailwind, lucide-react (già disponibili in v0).
 *
 * Dove mettere mano:
 *  - PAF (colori)        -> oggetto qui sotto
 *  - PROFESSIONI_ISTAT   -> elenco professioni (estratto: aggiungi le 648 ISTAT)
 *  - calcola()           -> motore LEX,8h (formule indicative)
 *  - LOGHI               -> /public/loghi/*.png (segnaposto se mancanti)
 * ================================================================== */

import React from "react";
import {
  ArrowLeft, Users, GraduationCap, FlaskConical, Search, Download, Upload,
  ChevronRight, ShieldCheck, Volume2, Ear, Check, X, Mail, FileText, Eye, EyeOff,
  ExternalLink, Info, Activity,
} from "lucide-react";

/* ----------------------------- TEMA PAF ---------------------------- */
const PAF = {
  petrol: "#15788C", petrolDark: "#0f5a69", petrolSoft: "#e8f3f5",
  red: "#C8102E", redDark: "#a30d26",
  green: "#2f9e44", greenDark: "#2b8a3e",
  ink: "#0f172a", slate: "#475569", line: "#e2e8f0", bg: "#f1f5f9",
  amber: "#e8a33d", orange: "#e8590c",
};

/* ------------------------------ TIPI ------------------------------- */
type Screen =
  | "mappa" | "home" | "categorie" | "selezionaLavoro" | "lavoratoriMenu"
  | "candidati" | "schedaCandidatura" | "areaOperativa" | "simIntro"
  | "sforzoVocale" | "usoDPI" | "selezionaDPI" | "tempoDPI" | "compilaCampi"
  | "outputSimulatore" | "esploraDati" | "effettiDiretti" | "effettiIndiretti"
  | "espertiMenu" | "espertiEsplora" | "queries" | "ricercatoriLogin"
  | "creaAccount" | "ricercatoriMenu" | "flowchartDatabase" | "caricaDati";

interface Professione { label: string; }
interface Campi { anni: string; settimane: string; giorni: string; ore: string; }
interface SimState {
  professione: Professione | null; setProfessione: (p: Professione | null) => void;
  sforzoIdx: number | null; setSforzoIdx: (i: number | null) => void;
  usaDPI: boolean | null; setUsaDPI: (v: boolean | null) => void;
  dpiIdx: number | null; setDpiIdx: (i: number | null) => void;
  dpiTempo: number; setDpiTempo: (n: number) => void;
  campi: Campi; setCampi: (c: Campi) => void;
}
interface Nav { go: (s: Screen) => void; back: () => void; }
interface PageProps { nav: Nav; sim: SimState; }

/* ------------------------------ DATI ------------------------------- */
const PROFESSIONI_ISTAT: Professione[] = [
  { label: "Infermieri e professioni sanitarie infermieristiche" },
  { label: "Medici" }, { label: "Tecnici biologi e biochimici" },
  { label: "Odontoiatri e igienisti dentali" }, { label: "Operai edili e di cantiere" },
  { label: "Carpentieri e muratori" }, { label: "Operai metalmeccanici" },
  { label: "Saldatori e tagliatori a fiamma" }, { label: "Addetti a presse e macchine utensili" },
  { label: "Falegnami e operatori del legno" }, { label: "Personale aeroportuale di rampa" },
  { label: "Macchinisti e operatori ferroviari" }, { label: "Addetti a impianti tessili" },
  { label: "Operatori di call center" }, { label: "Insegnanti di scuola primaria" },
  { label: "Docenti universitari e ricercatori" }, { label: "Impiegati amministrativi" },
  { label: "Baristi e operatori della ristorazione" }, { label: "Musicisti e tecnici del suono" },
  { label: "Addetti a cave e attività estrattive" }, { label: "Agricoltori e operatori di trattori" },
  { label: "Giardinieri e operatori del verde" }, { label: "Autisti di mezzi pesanti" },
  { label: "Addetti alle pulizie industriali" },
];

const SFORZO_VOCALE = [
  { label: "Parlare normalmente da 1,2 m", lvl: 50 },
  { label: "Alzare la voce da 1,2 m", lvl: 60 },
  { label: "Parlare a voce alta da 1,2 m", lvl: 66 },
  { label: "Parlare a voce molto alta da 1,2 m", lvl: 72 },
  { label: "Gridare da 1,2 m", lvl: 78 },
  { label: "Gridare da 0,6 m", lvl: 84 },
  { label: "Urlare nell'orecchio del tuo interlocutore", lvl: 90 },
];

const DPI_BANCA = [
  { label: "Inserti auricolari espandibili", snr: 33 },
  { label: "Inserti preformati riutilizzabili", snr: 28 },
  { label: "Cuffia antirumore standard", snr: 27 },
  { label: "Cuffia antirumore ad alta attenuazione", snr: 35 },
  { label: "Archetto con cuscinetti", snr: 23 },
];

const ESPERTI_MENU = [
  { titolo: "Popolazione", voci: ["Soggetti Sani", "Subjective Cognitive Decline", "Mild Cognitive Impairment", "Demenza Lieve"] },
  { titolo: "Dati demografici", voci: ["Età", "Sesso", "Professione", "Esposizione al rumore lavoro-correlato"] },
  { titolo: "Dati psicometrici", voci: ["Quadro cognitivo globale", "Attenzione e Funzioni Esecutive", "Memoria", "Linguaggio", "Prassia", "Scale comportamentali", "Consapevolezza", "Benessere psicosociale", "NESI"] },
  { titolo: "Dati audiometrici", voci: ["Perdita di udito rumore-correlata", "Nessuna perdita di udito rumore-correlata"] },
  { titolo: "Dati di neuroimaging", voci: ["Fazekas", "ERICA", "MTA"] },
];

const QUERIES = [
  "Come varia l'esposizione al rumore lavoro-correlato in funzione della tipologia (industriale, aviazione, parlato, edile…) nella popolazione studiata?",
  "I diversi livelli di esposizione discriminano tra punteggi sopra e sotto il cut-off del MMSE?",
  "La tipologia del rumore ha effetti diversi su rapidità, inibizione, flessibilità e memoria?",
  "I diversi livelli di esposizione discriminano tra presenza o assenza di perdita di acuità uditiva?",
  "Alti livelli di esposizione predicono una perdita di volume dell'ippocampo (MTA ≥ 2)?",
];

const DEFINIZIONI = [
  { sigla: "SCD", titolo: "Subjective Cognitive Decline", testo: "Il Declino Cognitivo Soggettivo (SCD) indica l'esperienza soggettiva di un peggioramento delle proprie capacità cognitive (in particolare della memoria) che persiste nel tempo in persone con capacità oggettive conservate. Può rappresentare una fase preclinica della malattia di Alzheimer." },
  { sigla: "MCI", titolo: "Mild Cognitive Impairment", testo: "Il Disturbo Cognitivo Lieve (MCI) rappresenta una fase intermedia tra il normale invecchiamento e la demenza: lievi difficoltà di memoria, attenzione o linguaggio riscontrabili ai test clinici, che non compromettono l'autonomia quotidiana." },
  { sigla: "Demenza Lieve", titolo: "Demenza Lieve", testo: "Mancanza di indipendenza nelle attività quotidiane e compromissione moderata delle capacità cognitive." },
  { sigla: "Fazekas", titolo: "Scala di Fazekas", testo: "Quantifica l'estensione delle lesioni in aree profonde del cervello, solitamente esito di micro-eventi ischemici da malattia dei piccoli vasi; può associarsi a rallentamento dell'elaborazione cognitiva e del funzionamento esecutivo." },
  { sigla: "ERICA", titolo: "Punteggio ERICA", testo: "Valuta la perdita di volume della corteccia entorinale (segno prodromico). Varia da 0 a 3: valori più alti indicano maggiore atrofia e maggiore probabilità di malattia di Alzheimer." },
  { sigla: "MTA", titolo: "Punteggio MTA", testo: "L'atrofia del lobo temporale mediale distingue pazienti con MCI o Alzheimer da soggetti senza problemi, con accuratezza di circa il 75% nella diagnosi e dell'85% nel confermare la malattia di Alzheimer." },
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

/* --------------------- MOTORE SIMULATORE LEX,8h -------------------- */
const DERATING_DPI = 4;
type LivelloClasse = "BASSA" | "MEDIA" | "ALTA" | "MOLTO ALTA";
interface Valutazione {
  lex: number; livello: LivelloClasse; color: string;
  titolo: string; sintesi: string; raccomandazione: string;
}
interface Risultato {
  senzaDPI: Valutazione; conDPI: Valutazione; riduzioneDPI: number; unitsNoiseExposure: number;
}
const round1 = (n: number) => Math.round(n * 10) / 10;
function sommaEnergetica(a: number, b: number, pa: number, pb: number) {
  return 10 * Math.log10(pa * Math.pow(10, a / 10) + pb * Math.pow(10, b / 10));
}
function valuta(lex: number): Valutazione {
  const v = round1(lex);
  if (lex < 80) return { lex: v, livello: "BASSA", color: PAF.green, titolo: "Esposizione contenuta", sintesi: "Sotto i valori inferiori di azione (LEX < 80 dB(A)).", raccomandazione: "Mantieni le buone pratiche. Ripeti la stima se cambia la tua attività lavorativa." };
  if (lex < 85) return { lex: v, livello: "MEDIA", color: PAF.amber, titolo: "Attenzione consigliata", sintesi: "Tra valore inferiore e superiore di azione (80–85 dB(A)).", raccomandazione: "Sono raccomandati informazione e formazione sui rischi e la disponibilità di DPI uditivi." };
  if (lex < 87) return { lex: v, livello: "ALTA", color: PAF.orange, titolo: "Esposizione elevata", sintesi: "Oltre il valore superiore di azione (85–87 dB(A)).", raccomandazione: "È previsto l'uso dei DPI uditivi e la sorveglianza sanitaria. Valuta misure tecniche di riduzione del rumore." };
  return { lex: v, livello: "MOLTO ALTA", color: PAF.red, titolo: "Esposizione critica", sintesi: "Oltre il valore limite di esposizione (≥ 87 dB(A)).", raccomandazione: "Superato il valore limite: necessari interventi immediati di riduzione e protezione, con valutazione specialistica." };
}
function calcola(p: { sforzoIdx: number; campi: Campi; usaDPI: boolean; dpiIdx: number | null; dpiTempo: number; }): Risultato {
  const lAmbiente = SFORZO_VOCALE[p.sforzoIdx]?.lvl ?? 0;
  const ore = Number(p.campi.ore) || 8;
  const giorni = Number(p.campi.giorni) || 5;
  const settimane = Number(p.campi.settimane) || 46;
  const lexGiorno = lAmbiente + 10 * Math.log10(Math.max(ore, 0.5) / 8);
  const fattoreAnno = (giorni * settimane) / (5 * 46);
  const lexSenza = lexGiorno + 10 * Math.log10(Math.max(fattoreAnno, 0.05));
  let lexCon = lexSenza;
  if (p.usaDPI && p.dpiIdx !== null && p.dpiTempo > 0) {
    const snrEff = Math.max(DPI_BANCA[p.dpiIdx].snr - DERATING_DPI, 0);
    const frazione = Math.min(Math.max(p.dpiTempo / 100, 0), 1);
    lexCon = sommaEnergetica(lexSenza, lexSenza - snrEff, 1 - frazione, frazione);
  }
  const une = Math.pow(10, ((p.usaDPI ? lexCon : lexSenza) - 80) / 10) * (giorni * settimane * (Number(p.campi.anni) || 1)) / 1000;
  return { senzaDPI: valuta(lexSenza), conDPI: valuta(lexCon), riduzioneDPI: round1(lexSenza - lexCon), unitsNoiseExposure: round1(une) };
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
function Disclaimer({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md bg-slate-50 p-4 text-left text-xs leading-relaxed text-slate-500">{children}</div>;
}
/* Parola chiave evidenziata in grassetto */
function Kw({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-slate-900">{children}</strong>;
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
            <div className="text-[11px] opacity-80">INAIL · Regione Toscana · Coordinamento Tecnico Regioni</div>
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
const TRAIL: Record<Screen, string> = {
  mappa: "HOME / Mappa del sito", home: "HOME", categorie: "HOME / Categorie",
  selezionaLavoro: "Categorie / Lavoratori e pensionati / Seleziona lavoro",
  lavoratoriMenu: "Categorie / Lavoratori e pensionati",
  candidati: "… / Lavoratori e pensionati / Candidati",
  schedaCandidatura: "… / Candidati / Scheda candidatura",
  areaOperativa: "… / Lavoratori e pensionati / Area operativa",
  simIntro: "… / Area operativa / Noise Exposure Simulator",
  sforzoVocale: "… / Simulator / Sforzo vocale",
  usoDPI: "… / Simulator / Uso dei DPI",
  selezionaDPI: "… / Simulator / Selezione DPI",
  tempoDPI: "… / Simulator / Tempo d'uso DPI",
  compilaCampi: "… / Simulator / Dati esposizione",
  outputSimulatore: "… / Simulator / Risultato",
  esploraDati: "… / Area operativa / Esplora dati",
  effettiDiretti: "… / Esplora dati / Effetti diretti",
  effettiIndiretti: "… / Esplora dati / Effetti indiretti",
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
 * (una funzione per ogni pagina del PowerPoint)
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
            <r.icon size={22} style={{ color: PAF.petrol }} />
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
        Applicazione sviluppata nell'ambito del <Kw>Progetto BRIC INAIL ID07 2024</Kw>, destinata a
        lavoratori, pensionati, ricercatori ed enti impegnati nello studio della relazione tra{" "}
        <Kw>esposizione al rumore occupazionale</Kw> e rischio di sviluppo del <Kw>declino cognitivo</Kw>.
      </p>
      <div className="mt-5 max-w-xl">
        <Disclaimer>
          Le informazioni fornite hanno esclusivamente <Kw>scopo informativo e indicativo</Kw> e non
          sono da considerarsi sostitutive di valutazioni tecniche, strumentali, cliniche o
          specialistiche. Gli output si basano sulle conoscenze scientifiche disponibili e sulle
          analisi statistiche del campione di studio. Per una valutazione accurata rivolgersi a professionisti esperti.
        </Disclaimer>
      </div>
      <div className="mt-7"><GreenBtn onClick={() => nav.go("categorie")}>ACCEDI AI SERVIZI</GreenBtn></div>
    </div>
  );
}

/* Slide 5 — Categorie */
function Categorie({ nav }: PageProps) {
  const cards: { title: string; desc: string; icon: any; to: Screen }[] = [
    { title: "LAVORATORI E PENSIONATI", desc: "Stima la tua esposizione al rumore e candidati alle sperimentazioni in corso.", icon: Users, to: "selezionaLavoro" },
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

/* Slide 6 — Seleziona lavoro (l'utente scrive la professione) */
function SelezionaLavoro({ nav, sim }: PageProps) {
  const [testo, setTesto] = React.useState(sim.professione?.label ?? "");
  const [aperto, setAperto] = React.useState(false);
  const suggerimenti = testo.trim().length >= 2 ? PROFESSIONI_ISTAT.filter((p) => p.label.toLowerCase().includes(testo.toLowerCase())).slice(0, 6) : [];
  const conferma = (label: string) => { const v = label.trim(); if (!v) return; sim.setProfessione({ label: v }); nav.go("lavoratoriMenu"); };
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Le seguenti domande servono a valutare il <Kw>rischio di alterazioni e/o declino cognitivo</Kw>{" "}
        associate all'<Kw>esposizione al rumore</Kw> specifico per la tua attività lavorativa.
      </p>
      <label className="mb-1 block text-xs font-semibold text-slate-600">Scrivi la tua professione</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input value={testo} onChange={(e) => { setTesto(e.target.value); setAperto(true); }} onFocus={() => setAperto(true)}
          onKeyDown={(e) => e.key === "Enter" && conferma(testo)}
          placeholder="Inizia a digitare… (es. saldatore, infermiere, falegname)"
          className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500" autoComplete="off" />
        {aperto && suggerimenti.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
            {suggerimenti.map((p) => <button key={p.label} onClick={() => conferma(p.label)} className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-slate-50">{p.label}</button>)}
          </div>
        )}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">I suggerimenti si basano sull'elenco delle professioni ISTAT (648 voci). Se non trovi la tua professione esatta, puoi confermare il testo digitato.</p>
      <div className="mt-6"><GreenBtn onClick={() => conferma(testo)} disabled={testo.trim().length < 2}>CONFERMA PROFESSIONE</GreenBtn></div>
    </div>
  );
}

/* Slide 7 — Lavoratori: Candidati / Area operativa */
function LavoratoriMenu({ nav, sim }: PageProps) {
  return (
    <div>
      <SectionTitle>Sezione lavoro</SectionTitle>
      {sim.professione && <p className="mt-2 text-center text-xs text-slate-500">Professione selezionata: <b>{sim.professione.label}</b></p>}
      <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">Attraverso questa piattaforma potrai:</p>
      <ul className="mx-auto mt-2 max-w-lg list-disc space-y-1 pl-6 text-sm text-slate-600">
        <li><Kw>candidarti</Kw> e partecipare alle sperimentazioni in corso sull'esposizione al rumore occupazionale e il rischio di declino cognitivo;</li>
        <li><Kw>esplorare i dati</Kw> in letteratura sugli effetti diretti e indiretti del rumore occupazionale sul rischio cognitivo.</li>
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
      <FileText className="mx-auto text-slate-400" size={40} />
      <h2 className="mt-3 text-base font-bold">Candidati alle sperimentazioni</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Scarica la scheda di candidatura, compilala e inviala all'indirizzo associato.</p>
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
      <h2 className="text-center text-base font-bold">Scheda di candidatura</h2>
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
      <div className="mt-5 text-center"><GreenBtn>SCARICA SCHEDA COMPILATA (PDF)</GreenBtn></div>
    </div>
  );
}

/* Slide 8 — Area operativa */
function AreaOperativa({ nav }: PageProps) {
  return (
    <div className="grid gap-4">
      <button onClick={() => nav.go("simIntro")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide" style={{ color: PAF.petrol }}><Activity size={18} /> Self Estimated Noise Exposure Simulator</div>
        <p className="mt-1 text-xs text-slate-500">Stima il tuo LEX,8h annuo a partire da poche informazioni sulla tua attività.</p>
      </button>
      <button onClick={() => nav.go("esploraDati")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide" style={{ color: PAF.petrol }}><Search size={18} /> Esplora dati</div>
        <p className="mt-1 text-xs text-slate-500">Effetti diretti e indiretti dell'esposizione al rumore, sintetizzati dalla letteratura.</p>
      </button>
    </div>
  );
}

/* Slide 9 — Simulatore intro */
function SimulatoreIntro({ nav }: PageProps) {
  return (
    <div className="text-center">
      <SoundWave className="mx-auto h-6 w-28" />
      <h2 className="mt-3 text-base font-bold">Self Estimated Noise Exposure</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
        Le domande si riferiscono all'attività lavorativa svolta <Kw>nell'ultimo anno</Kw>: rispondi
        facendo riferimento a ciò che hai sperimentato abitualmente. Al termine riceverai il{" "}
        <Kw>LEX,8h annuo stimato</Kw>, un valore medio calcolato sulle 8 ore lavorative giornaliere.
        È un valore <Kw>puramente indicativo</Kw>, non sostitutivo di misurazioni professionali.
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
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Immagina di essere al lavoro e di dover parlare con una persona a circa <Kw>1,2 m</Kw> di
        distanza, con udito normale e senza protezioni acustiche. In base allo <Kw>sforzo vocale</Kw>{" "}
        che dovresti fare per farti capire, scegli il livello corrispondente.
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

/* Slide 11 — Uso dei DPI (chiesto direttamente all'utente) */
function UsoDPI({ nav, sim }: PageProps) {
  const rispondi = (usa: boolean) => { sim.setUsaDPI(usa); if (!usa) { sim.setDpiIdx(null); sim.setDpiTempo(0); } nav.go(usa ? "selezionaDPI" : "compilaCampi"); };
  return (
    <div className="text-center">
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: PAF.petrolSoft }}><Ear size={26} style={{ color: PAF.petrol }} /></span>
      <h2 className="text-base font-bold">Utilizzi i dispositivi di protezione individuale?</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        Durante la tua attività lavorativa indossi <Kw>DPI uditivi</Kw> (inserti auricolari, cuffie antirumore o archetti) per proteggerti dal rumore?
      </p>
      <div className="mt-7 flex justify-center gap-4">
        <button onClick={() => rispondi(true)} className="flex w-36 flex-col items-center gap-2 rounded-lg border-2 p-5 transition hover:shadow-md" style={{ borderColor: sim.usaDPI === true ? PAF.green : PAF.line }}>
          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: PAF.green }}><Check size={18} /></span>
          <span className="text-sm font-bold">Sì, li uso</span>
        </button>
        <button onClick={() => rispondi(false)} className="flex w-36 flex-col items-center gap-2 rounded-lg border-2 p-5 transition hover:shadow-md" style={{ borderColor: sim.usaDPI === false ? PAF.petrol : PAF.line }}>
          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: PAF.slate }}><X size={18} /></span>
          <span className="text-sm font-bold">No, non li uso</span>
        </button>
      </div>
      <p className="mx-auto mt-6 max-w-md text-[11px] text-slate-400">Se usi i DPI, al termine vedrai <Kw>due valutazioni a confronto</Kw>: la tua esposizione con e senza protezione, così da capire quanto i DPI ti proteggono.</p>
    </div>
  );
}

/* Slide 12 — Selezione DPI */
function SelezionaDPI({ nav, sim }: PageProps) {
  return (
    <div>
      <div className="mb-4 rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Seleziona il <Kw>DPI uditivo</Kw> che usi in ambiente lavorativo dalla banca DPI del portale
        PAF. Il sistema applica un <Kw>derating di −4 dB</Kw> sull'SNR del dispositivo selezionato per stimare la protezione reale.
      </div>
      <p className="mb-3 text-sm font-semibold text-slate-700">Seleziona il DPI utilizzato</p>
      <div className="grid gap-2">
        {DPI_BANCA.map((d, i) => (
          <button key={d.label} onClick={() => { sim.setDpiIdx(i); nav.go("tempoDPI"); }}
            className={`flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition ${sim.dpiIdx === i ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:bg-slate-50"}`}>
            <span className="font-medium">{d.label}</span>
            <span className="text-xs text-slate-500">SNR {d.snr} dB → eff. {d.snr - 4} dB</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Slide 13 — Tempo d'uso DPI */
function TempoDPI({ nav, sim }: PageProps) {
  return (
    <div>
      <p className="mb-5 text-sm text-slate-600">Indica la proporzione di tempo in cui il DPI è stato effettivamente utilizzato durante l'esposizione al rumore.</p>
      <div className="rounded-lg border border-slate-200 p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-slate-700">Tempo d'uso del DPI</span>
          <span className="text-2xl font-extrabold" style={{ color: PAF.petrol }}>{sim.dpiTempo}%</span>
        </div>
        <input type="range" min={0} max={100} step={5} value={sim.dpiTempo} onChange={(e) => sim.setDpiTempo(Number(e.target.value))} className="w-full" style={{ accentColor: PAF.petrol }} />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>Mai</span><span>Sempre</span></div>
      </div>
      <div className="mt-6 flex justify-end"><GreenBtn onClick={() => nav.go("compilaCampi")}>CONTINUA</GreenBtn></div>
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
      <p className="mb-5 text-sm text-slate-600">Compila gli spazi con tutte le informazioni richieste, inserendo i dati in modo completo e accurato.</p>
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

/* Slide 17/18 — Output con i due badge di attenzione */
function BadgeAttenzione({ etichetta, v, protetto }: { etichetta: string; v: Valutazione; protetto?: boolean; }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: v.color }}>
      <div className="px-5 py-4 text-white" style={{ background: v.color }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest opacity-90">{protetto && <ShieldCheck size={13} />} {etichetta}</div>
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
  );
}
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
function OutputSimulatore({ sim }: PageProps) {
  if (sim.sforzoIdx === null) return <p className="text-sm text-slate-500">Completa prima la simulazione.</p>;
  const usaDPI = sim.usaDPI === true && sim.dpiIdx !== null;
  const res = calcola({ sforzoIdx: sim.sforzoIdx, campi: sim.campi, usaDPI: sim.usaDPI === true, dpiIdx: sim.dpiIdx, dpiTempo: sim.dpiTempo });
  return (
    <div>
      <div className="mb-1 flex items-center gap-2"><Volume2 style={{ color: PAF.petrol }} /><h2 className="text-base font-bold">Risultato della tua stima</h2></div>
      <p className="mb-5 text-sm text-slate-600">Ecco la tua <Kw>esposizione annua equivalente</Kw> (LEX,8h) e la relativa <Kw>classe di rischio</Kw> secondo il <Kw>D.Lgs 81/08, art. 189</Kw>.</p>
      <div className={`grid gap-4 ${usaDPI ? "sm:grid-cols-2" : ""}`}>
        <BadgeAttenzione etichetta={usaDPI ? "Senza DPI" : "La tua esposizione"} v={res.senzaDPI} />
        {usaDPI && <BadgeAttenzione etichetta="Con DPI" v={res.conDPI} protetto />}
      </div>
      {usaDPI && (
        <p className="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          <ShieldCheck size={18} className="shrink-0" />
          <span>L'uso dei DPI riduce la tua esposizione di <Kw>{res.riduzioneDPI.toFixed(1)} dB</Kw>: dalla classe <Kw>{res.senzaDPI.livello}</Kw> alla classe <Kw>{res.conDPI.livello}</Kw>.</span>
        </p>
      )}
      <Legenda />
      <div className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">Units of Noise Exposure (indicatore aggregato): <Kw>{res.unitsNoiseExposure}</Kw></div>
      <div className="mt-5">
        <Disclaimer>
          I livelli di rumore e la classe di rischio derivano da <Kw>stime soggettive</Kw> basate sulla
          tua percezione. La classe è attribuita secondo il <Kw>D.Lgs 81/08, art. 189</Kw>. Questi
          risultati <Kw>non derivano da misurazioni strumentali</Kw>: per una valutazione professionale rivolgiti a esperti.
        </Disclaimer>
      </div>
      <button className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: PAF.petrol }}>Per approfondire: Valutazione del Rischio del Rumore <ChevronRight size={15} /></button>
    </div>
  );
}

/* Slide 20 — Esplora dati */
function EsploraDati({ nav }: PageProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">Indaga rispettivamente gli effetti diretti e indiretti dell'esposizione al rumore.</p>
      <button onClick={() => nav.go("effettiDiretti")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>Effetti diretti dell'esposizione al rumore</div>
        <p className="mt-1 text-xs text-slate-500">Esposizione cronica e temporanea, con la qualità delle evidenze per ciascuno studio.</p>
      </button>
      <button onClick={() => nav.go("effettiIndiretti")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>Effetti indiretti dell'esposizione al rumore</div>
        <p className="mt-1 text-xs text-slate-500">Fino a 10 categorie di effetti indiretti, descritte dai dati aggregati delle evidenze.</p>
      </button>
    </div>
  );
}

/* Slide 21/22 — Effetti diretti */
function EffettiDiretti() {
  const [tab, setTab] = React.useState<"cronica" | "temporanea">("cronica");
  const STUDI: Record<"cronica" | "temporanea", { t: string; q: "Alta" | "Media" | "Bassa" }[]> = {
    cronica: [{ t: "Esposizione cronica e funzioni esecutive", q: "Alta" }, { t: "Esposizione cronica e memoria episodica", q: "Media" }, { t: "Esposizione cronica e velocità di elaborazione", q: "Media" }],
    temporanea: [{ t: "Esposizione temporanea e attenzione", q: "Bassa" }, { t: "Esposizione temporanea e memoria di lavoro", q: "Bassa" }],
  };
  const col = (q: string) => (q === "Alta" ? PAF.green : q === "Media" ? PAF.amber : PAF.orange);
  return (
    <div>
      <div className="mb-4 flex gap-2 text-sm">
        {(["cronica", "temporanea"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 font-semibold ${tab === t ? "text-white" : "bg-slate-100 text-slate-600"}`} style={tab === t ? { background: PAF.petrol } : {}}>Esposizione {t}</button>
        ))}
      </div>
      <div className="grid gap-2">
        {STUDI[tab].map((s) => (
          <div key={s.t} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium">{s.t}</span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: col(s.q) }}>Evidenza {s.q}</span>
          </div>
        ))}
      </div>
      <button className="mt-4 text-xs font-semibold underline" style={{ color: PAF.petrol }}>Clicca qui per approfondire cosa si intende per Qualità delle evidenze</button>
    </div>
  );
}

/* Slide 23 — Effetti indiretti */
function EffettiIndiretti() {
  const VOCI = ["Stress fisiologico", "Disturbi del sonno", "Aumento della pressione arteriosa", "Alterazioni dell'umore", "Ridotta qualità della comunicazione", "Affaticamento e ridotta concentrazione"];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Categorie di effetti indiretti dell'esposizione al rumore in ambiente lavorativo (massimo 10 voci). Per ciascuna vengono fornite informazioni riassuntive sui dati aggregati di più evidenze.</p>
      <div className="grid gap-2 sm:grid-cols-2">{VOCI.map((v) => <div key={v} className="rounded-md border border-slate-200 px-4 py-3 text-sm font-medium">{v}</div>)}</div>
    </div>
  );
}

/* Slide 28 — Esperti menu */
function EspertiMenu({ nav }: PageProps) {
  return (
    <div>
      <SectionTitle>Sezione esperti</SectionTitle>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">Esplora i dati sperimentali sugli effetti cognitivi dell'esposizione al rumore e interroga il database con query predefinite.</p>
      <div className="mt-7 grid gap-4">
        <button onClick={() => nav.go("espertiEsplora")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
          <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>ESPLORA DATI</div>
          <p className="mt-1 text-xs text-slate-500">Filtra per popolazione, demografia, psicometria, audiometria e neuroimaging.</p>
        </button>
        <button onClick={() => nav.go("queries")} className="rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
          <div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>INTERROGA IL DATABASE</div>
          <p className="mt-1 text-xs text-slate-500">Seleziona una delle query predefinite per interrogare direttamente il database.</p>
        </button>
      </div>
    </div>
  );
}

/* Slide 30/31 — Pop-up definizioni cliniche */
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
      <p className="mb-5 text-sm text-slate-600">Seleziona i criteri con cui visualizzare i dati raccolti da ricercatori e tecnici. Ogni menù rappresenta una dimensione del dataset.</p>
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
      <div className="mt-4 text-[11px] text-slate-400">Nota: dati psicometrici = 9 categorie × 20 variabili · esposizione lavoro-correlata su 3 livelli (alta / media / bassa) · professione = 648 voci ISTAT · età in fasce 60-64, 65-69, 70-74, 75-80.</div>
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
      <p className="mb-4 text-xs text-slate-500">L'esperto può interrogare il database a partire dalle query proposte.</p>
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
      <p className="mt-3 text-center text-sm text-slate-600">Benvenuto nella piattaforma di gestione dati sul rischio cognitivo legato all'esposizione al rumore. L'accesso è riservato ai ricercatori autorizzati.</p>
      <div className="mt-6 grid gap-4">
        <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">Indirizzo email istituzionale</span><input type="email" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" /></label>
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
  const FIELDS: [string, string][] = [["Nome *", "text"], ["Cognome *", "text"], ["E-mail (nome utente) *", "email"], ["N. iscrizione all'Albo", "text"], ["Università / Ente di afferenza", "text"], ["Titolo", "text"], ["Password *", "password"]];
  return (
    <div className="mx-auto max-w-md">
      <SectionTitle>Crea account</SectionTitle>
      <p className="mt-2 text-center text-xs text-slate-500">Per visualizzare i dati caricati finora o caricare i tuoi, crea un account utente. I dati saranno mostrati in forma aggregata, senza informazioni sensibili visibili agli altri utenti.</p>
      <div className="mt-5 grid gap-3">
        {FIELDS.map(([label, type]) => <label key={label} className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span><input type={type} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" /></label>)}
        <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" /> PhD</label>
      </div>
      <button className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: PAF.petrol }}><Download size={15} /> Scarica il PDF «Privacy»</button>
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
        <Download style={{ color: PAF.petrol }} />
        <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>SCARICA E CONSULTA I DATI</div><p className="text-xs text-slate-500">Flow chart dinamico delle variabili e download dell'intero database.</p></div>
      </button>
      <button onClick={() => nav.go("caricaDati")} className="flex items-center gap-4 rounded-lg border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-md">
        <Upload style={{ color: PAF.petrol }} />
        <div><div className="text-sm font-extrabold" style={{ color: PAF.petrol }}>CARICA I TUOI DATI</div><p className="text-xs text-slate-500">Scarica il template Excel annotato, compilalo e ricaricalo in piattaforma.</p></div>
      </button>
    </div>
  );
}

/* Slide 39/40 — Flow chart database */
function FlowchartDatabase() {
  return (
    <div>
      <p className="mb-5 text-sm text-slate-600">All'interno del database sono consultabili le seguenti variabili. Cliccando sul singolo test sarai reindirizzato alla reference tramite DOI. Successivamente potrai scaricare l'intero database.</p>
      <div className="space-y-4">
        {DB_VARIABILI.map((g) => (
          <div key={g.gruppo} className="rounded-md border border-slate-200 p-4">
            <div className="text-sm font-bold" style={{ color: PAF.petrol }}>{g.gruppo}</div>
            <ul className="mt-2 space-y-1.5">{g.test.map((t) => <li key={t}><button className="flex items-center gap-1.5 text-left text-xs text-slate-600 hover:underline"><ExternalLink size={12} className="shrink-0 text-slate-400" /> {t}</button></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mt-6"><GreenBtn className="inline-flex items-center gap-2"><Download size={16} /> Scarica il database</GreenBtn></div>
    </div>
  );
}

/* Slide 42-45 — Carica i tuoi dati */
function CaricaDati() {
  const [tipo, setTipo] = React.useState<"soggettiva" | "oggettiva">("soggettiva");
  const checklist = ["Dati demografici *", "Esiti misure audiometriche *", tipo === "soggettiva" ? "Esposizione al rumore soggettiva — NESI *" : "Esposizione al rumore oggettiva acuta *", "Esiti misure psicometriche e/o neuroimaging *"];
  const download = ["Scarica la pipeline IRCCS Fondazione Santa Lucia", "Scarica la NESI tradotta in italiano", "Scarica lo script «anonimizza soggetti»", "Scarica lo script «anonimizza soggetti e ricercatore»", "Scarica il modello di compilazione database"];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Sbarra le sezioni di interesse, scarica il file Excel annotato con i campi selezionati, compilalo e ricaricalo. I campi contrassegnati con * sono obbligatori.</p>
      <div className="mb-4 flex gap-2">
        {(["soggettiva", "oggettiva"] as const).map((t) => <button key={t} onClick={() => setTipo(t)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${tipo === t ? "text-white" : "bg-slate-100 text-slate-600"}`} style={tipo === t ? { background: PAF.petrol } : {}}>{t === "soggettiva" ? "Esposizione soggettiva" : "Esposizione oggettiva acuta"}</button>)}
      </div>
      {tipo === "oggettiva" && <div className="mb-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600"><div className="mb-1 font-semibold">Strumentazione utilizzata</div>Fonometro (marca/modello/classe) · Data taratura fonometro · Calibratore (marca/modello/classe) · Data taratura calibratore.</div>}
      <div className="grid gap-2">{checklist.map((c) => <label key={c} className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm"><input type="checkbox" defaultChecked /> {c}</label>)}</div>
      <div className="mt-5 grid gap-2 text-sm">{download.map((d) => <button key={d} className="flex items-center gap-2 text-left font-semibold" style={{ color: PAF.petrol }}><Download size={15} /> {d}</button>)}</div>
      <div className="mt-5 space-y-2">{["Ho letto e accetto la pipeline", "Ho letto e dichiaro di aver anonimizzato i miei dati", "Ho letto e accetto la dichiarazione di autenticità e conformità", "Ho letto e accetto la licenza per l'uso dei dati caricati"].map((t) => <label key={t} className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" /> {t}</label>)}</div>
      <div className="mt-5 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
        <Upload className="mx-auto text-slate-400" size={28} />
        <p className="mt-2 text-sm font-semibold text-slate-600">Carica il database compilato e anonimizzato</p>
        <p className="text-xs text-slate-400">Formato accettato: .xlsx</p>
      </div>
      <p className="mt-4 text-[11px] text-slate-400">Per dubbi o domande sul caricamento: info@hsantalucia.it</p>
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
  usoDPI: UsoDPI, selezionaDPI: SelezionaDPI, tempoDPI: TempoDPI, compilaCampi: CompilaCampi,
  outputSimulatore: OutputSimulatore, esploraDati: EsploraDati, effettiDiretti: EffettiDiretti,
  effettiIndiretti: EffettiIndiretti, espertiMenu: EspertiMenu, espertiEsplora: EspertiEsplora,
  queries: Queries, ricercatoriLogin: RicercatoriLogin, creaAccount: CreaAccount,
  ricercatoriMenu: RicercatoriMenu, flowchartDatabase: FlowchartDatabase, caricaDati: CaricaDati,
};

export default function QuietBrain() {
  const [storia, setStoria] = React.useState<Screen[]>(["home"]);
  const screen = storia[storia.length - 1];

  const [professione, setProfessione] = React.useState<Professione | null>(null);
  const [sforzoIdx, setSforzoIdx] = React.useState<number | null>(null);
  const [usaDPI, setUsaDPI] = React.useState<boolean | null>(null);
  const [dpiIdx, setDpiIdx] = React.useState<number | null>(null);
  const [dpiTempo, setDpiTempo] = React.useState<number>(0);
  const [campi, setCampi] = React.useState<Campi>({ anni: "", settimane: "", giorni: "", ore: "" });

  const nav: Nav = {
    go: (s) => setStoria((h) => [...h, s]),
    back: () => setStoria((h) => (h.length > 1 ? h.slice(0, -1) : h)),
  };
  const sim: SimState = { professione, setProfessione, sforzoIdx, setSforzoIdx, usaDPI, setUsaDPI, dpiIdx, setDpiIdx, dpiTempo, setDpiTempo, campi, setCampi };

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
          Caterina Spada · Ilaria Donato · Federica Piras — Fondazione Santa Lucia IRCCS
          <br />
          Progetto BRIC INAIL ID07 2024 · Interfaccia su Portale Agenti Fisici (PAF)
        </p>
      </div>
    </div>
  );
}
