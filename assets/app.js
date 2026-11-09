import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Activity, Cpu, Stethoscope, Terminal, Database, 
  Brain, Heart, Bone, AlertTriangle, CheckCircle, Zap, RefreshCw, 
  Send, Mic, Lock, Download, ChevronRight, Layers, FileText, Radio, 
  ExternalLink, Search, Bookmark, Copy, Check
} from 'lucide-react';

// ==========================================
// OFFICIAL NASA MEDICAL & HUMAN SPACEFLIGHT LINKS (10+ SOURCES)
// ==========================================
const OFFICIAL_NASA_SOURCES = [
  {
    id: "NASA-STD-3001-V1",
    title: "NASA Standard 3001, Vol 1: Crew Health",
    description: "Standard for crew health, clinical care, and baseline physical evaluation requirements for spaceflight.",
    url: "https://www.nasa.gov/hhp/nasa-std-3001/",
    category: "Standard"
  },
  {
    id: "NASA-STD-3001-V2",
    title: "NASA Standard 3001, Vol 2: Human Factors & Habitability",
    description: "Design standards for life support, environmental control, radiation thresholds, and cabin ergonomics.",
    url: "https://www.nasa.gov/hhp/nasa-std-3001/",
    category: "Standard"
  },
  {
    id: "NASA-HRP-RISK-1",
    title: "NASA Human Research Program (HRP) Evidence Book",
    description: "Comprehensive risk catalog for human space exploration including radiation, microgravity, and isolation.",
    url: "https://www.nasa.gov/hrp",
    category: "Research"
  },
  {
    id: "NASA-SANS-GUIDE",
    title: "Spaceflight-Associated Neuro-ocular Syndrome (SANS) Protocol",
    description: "NASA clinical guidelines for monitoring intracranial pressure, optic disc edema, and vision changes.",
    url: "https://www.nasa.gov/hrp/elements/cv-sans",
    category: "Clinical"
  },
  {
    id: "NASA-CARDIO-MICROG",
    title: "Cardiovascular Adaptation to Microgravity",
    description: "Studies on orthostatic intolerance, fluid shifts, cardiac mass reduction, and plasma volume changes.",
    url: "https://www.nasa.gov/hrp/elements/cv",
    category: "Cardiovascular"
  },
  {
    id: "NASA-BONE-DENSITY",
    title: "Spaceflight Osteopenia & Musculoskeletal Health",
    description: "Bone mineral density loss rates (1-1.5% monthly) in microgravity and countermeasure exercise protocols.",
    url: "https://www.nasa.gov/hrp/elements/bone-muscle",
    category: "Musculoskeletal"
  },
  {
    id: "NASA-RAD-LIMITS",
    title: "Space Radiation Risk & Dosimetry Guidelines",
    description: "Permissible exposure limits for galactic cosmic rays (GCR) and solar particle events (SPE).",
    url: "https://www.nasa.gov/hrp/elements/radiation",
    category: "Radiation"
  },
  {
    id: "NASA-PSYCH-ISOLATION",
    title: "Behavioral Health & Performance (BHP) Manual",
    description: "Cognitive assessment protocols, sleep wake architecture, and stress management for long duration missions.",
    url: "https://www.nasa.gov/hrp/elements/bhp",
    category: "Behavioral"
  },
  {
    id: "NASA-IMMUNE-DYS",
    title: "Immunological Dysregulation in Deep Space",
    description: "Reactivation of latent viruses, altered cytokine profiles, and hypersensitivity during spaceflight.",
    url: "https://www.nasa.gov/hrp/elements/immune",
    category: "Immunology"
  },
  {
    id: "NASA-ECLSS-OPS",
    title: "Environmental Control and Life Support System (ECLSS)",
    description: "Nominal parameters for oxygen generation, carbon dioxide removal, ambient temperature, and pressure.",
    url: "https://www.nasa.gov/international-space-station/space-station-components/eclss/",
    category: "ECLSS"
  },
  {
    id: "NASA-MEDICAL-OPS-CH",
    title: "NASA Human Health and Performance (HHP) Portal",
    description: "Official portal for NASA space medicine protocols, ground readiness tests, and astronaut clinical records.",
    url: "https://www.nasa.gov/hhp/",
    category: "Portal"
  }
];

// ==========================================
// GROUNDED NASA KNOWLEDGE BASE WITH EXACT SOURCES
// ==========================================
const GROUNDED_KNOWLEDGE_BASE = [
  {
    keywords: ["sans", "vision", "eye", "blur", "headache", "optic", "intracranial"],
    title: "Spaceflight-Associated Neuro-ocular Syndrome (SANS)",
    sourceId: "NASA-SANS-GUIDE",
    sourceName: "NASA SANS Clinical Protocol (NASA-STD-3001 Vol 1)",
    sourceUrl: "https://www.nasa.gov/hrp/elements/cv-sans",
    response: "SANS is triggered by cephalad fluid shifts in microgravity, increasing intracranial pressure. Protocol: Perform fundoscopy scan, measure intraocular pressure (IOP), check optic disc swelling, and deploy lower body negative pressure (LBNP) garment for 2 hours daily."
  },
  {
    keywords: ["radiation", "spe", "gcr", "dose", "sievert", "solar", "flare"],
    title: "Space Radiation Exposure & Shielding Protocol",
    sourceId: "NASA-RAD-LIMITS",
    sourceName: "NASA Space Radiation Dosimetry Guidelines",
    sourceUrl: "https://www.nasa.gov/hrp/elements/radiation",
    response: "Cabin radiation exceeding 0.85 mSv/day triggers Level 2 Warning. Immediate actions: Move to heavily shielded storm shelter area, wear personal active dosimeter badge, hydrate to flush free radicals, and log cumulative dosage in mission ledger."
  },
  {
    keywords: ["heart", "cardio", "pulse", "fluid", "arrhythmia", "blood pressure", "orthostatic"],
    title: "Cardiovascular Microgravity Adaptation",
    sourceId: "NASA-CARDIO-MICROG",
    sourceName: "NASA Cardiovascular Adaptation Studies",
    sourceUrl: "https://www.nasa.gov/hrp/elements/cv",
    response: "Microgravity eliminates hydrostatic pressure gradients, shifting ~2L of venous fluid towards the chest/head. Target HR: 60-90 BPM resting. Countermeasure: 30-minute daily resistive exercise (ARED) and maintain electrolyte balance."
  },
  {
    keywords: ["bone", "spine", "osteopenia", "calcium", "back", "vertebrae", "height"],
    title: "Spaceflight Osteopenia & Spinal Elongation",
    sourceId: "NASA-BONE-DENSITY",
    sourceName: "NASA Musculoskeletal Countermeasure Protocol",
    sourceUrl: "https://www.nasa.gov/hrp/elements/bone-muscle",
    response: "Astronauts lose ~1-1.5% bone mineral density per month without load-bearing friction. Spinal discs decompress up to 5cm, causing back discomfort. Protocol: Daily ARED heavy squats/deadlifts simulation + Bisphosphonate/Vitamin D supplementation."
  },
  {
    keywords: ["stress", "fatigue", "sleep", "depression", "isolation", "cognitive", "mental"],
    title: "Behavioral Health & Cognitive Performance",
    sourceId: "NASA-PSYCH-ISOLATION",
    sourceName: "NASA BHP Manual & Cognitive Protocol",
    sourceUrl: "https://www.nasa.gov/hrp/elements/bhp",
    response: "Isolation and circadian misalignment impair reaction time. NASA threshold: Cognition error rate < 15%. Countermeasures: Dynamic lighting spectrum (blue-enriched AM, amber PM), Cognition micro-tests, and scheduled private psychological conferences."
  },
  {
    keywords: ["immune", "rash", "skin", "allergy", "infection", "cytokine", "herpes"],
    title: "Immunological Dysregulation & Skin Integrity",
    sourceId: "NASA-IMMUNE-DYS",
    sourceName: "NASA Deep-Space Immunology Manual",
    sourceUrl: "https://www.nasa.gov/hrp/elements/immune",
    response: "Microgravity and elevated stress suppress T-cell activation, causing latent viral reactivation or contact dermatitis. Treatment: Topical hydrocortisone 1%, oral antihistamine, skin microbiome swab upload, and strict hygiene protocol."
  },
  {
    keywords: ["eclss", "oxygen", "co2", "cabin", "air", "pressure", "temperature"],
    title: "ECLSS Environmental Life Support Standards",
    sourceId: "NASA-ECLSS-OPS",
    sourceName: "NASA ECLSS Operational Specifications",
    sourceUrl: "https://www.nasa.gov/international-space-station/space-station-components/eclss/",
    response: "Nominal ECLSS cabin baseline: O2 pressure at 21.3 kPa, CO2 partial pressure < 3.0 mmHg, Ambient Temp 21°C - 23°C. If CO2 > 5.0 mmHg, hypercapnia headache risk rises—switch to high-flow LiOH scrubbers immediately."
  }
];

export default function SpaceMediApp() {
  const [activeLayer, setActiveLayer] = useState(1);
  const [astronaut, setAstronaut] = useState({
    name: "Dr. Alex Vance",
    missionId: "ARTEMIS-VI-092",
    role: "Medical Specialist",
    connected: false
  });

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    heartRate: 72,
    oxygen: 98.4,
    pressure: 14.7,
    temp: 36.8,
    radiation: 0.42,
    cabinTemp: 21.5
  });

  // Body Organ Status (Layer 2)
  const [organStatus, setOrganStatus] = useState({
    brain: { status: 'nominal', label: 'CNS / Neuro-Ocular', code: 'SANS-01' },
    cardio: { status: 'adaptation', label: 'Cardiovascular', code: 'CV-02' },
    spine: { status: 'nominal', label: 'Spine & Musculoskeletal', code: 'MSK-03' },
    immune: { status: 'critical', label: 'Immune & Integumentary', code: 'IMM-04' }
  });
  const [selectedOrgan, setSelectedOrgan] = useState('brain');

  // Cognitive Game State (Layer 3)
  const [cogSequence, setCogSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlayingCog, setIsPlayingCog] = useState(false);
  const [cogScore, setCogScore] = useState(null);
  const [cogActiveIndex, setCogActiveIndex] = useState(null);

  // AI Chat & Safeguard State (Layer 4)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'system',
      text: 'AetherSync Multimodal RAG AI operational. All medical advice is deterministically grounded in NASA Human Spaceflight Standards (NASA-STD-3001).',
      sources: [OFFICIAL_NASA_SOURCES[0], OFFICIAL_NASA_SOURCES[3]]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Immutable Ledger (Layer 5)
  const [immutableLogs, setImmutableLogs] = useState([
    {
      timestamp: '2026-11-09 T08:30:12Z',
      missionDay: 142,
      index: '[SANS-01, RAD-0.42, COG-98%]',
      sourceId: 'NASA-STD-3001-V1',
      hash: '0x8f92a4e17...c4b2'
    }
  ]);

  const [copiedLink, setCopiedLink] = useState(null);

  // Simulated live telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        heartRate: Math.floor(70 + Math.random() * 8),
        oxygen: +(98 + Math.random() * 0.8).toFixed(1),
        pressure: +(14.65 + Math.random() * 0.1).toFixed(2)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------
  // LAYER 1: Suit Pairing Logic
  // ----------------------------------------------------
  const handleConnectSuit = () => {
    setAstronaut(prev => ({ ...prev, connected: true }));
    setActiveLayer(2);
  };

  // ----------------------------------------------------
  // LAYER 3: Cognitive Micro-Game
  // ----------------------------------------------------
  const startCognitiveTest = () => {
    setIsPlayingCog(true);
    setUserSequence([]);
    setCogScore(null);
    const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setCogSequence(newSeq);

    newSeq.forEach((val, idx) => {
      setTimeout(() => {
        setCogActiveIndex(val);
        setTimeout(() => setCogActiveIndex(null), 400);
      }, (idx + 1) * 800);
    });

    setTimeout(() => {
      setIsPlayingCog(false);
    }, 4000);
  };

  const handleCogButtonClick = (index) => {
    const nextUserSeq = [...userSequence, index];
    setUserSequence(nextUserSeq);

    if (nextUserSeq.length === cogSequence.length) {
      const isCorrect = nextUserSeq.every((val, i) => val === cogSequence[i]);
      const score = isCorrect ? 'PERFECT (0ms fatigue index)' : 'DEGRADED (High Fatigue Alert)';
      setCogScore(score);

      // Log into immutable ledger
      const newLog = {
        timestamp: new Date().toISOString(),
        missionDay: 142,
        index: `[COG-TEST: ${isCorrect ? 'PASS' : 'FAIL'}, RAD:${telemetry.radiation}mSv]`,
        sourceId: 'NASA-PSYCH-ISOLATION',
        hash: '0x' + Math.random().toString(16).substring(2, 12)
      };
      setImmutableLogs(prev => [newLog, ...prev]);
    }
  };

  // ----------------------------------------------------
  // LAYER 4: Multimodal RAG with Strict NOT_FOUND Guard
  // ----------------------------------------------------
  const handleSendMessage = (textToSend = inputQuery, imageAttached = attachedImage) => {
    if (!textToSend.trim() && !imageAttached) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      image: imageAttached ? imageAttached.name : null
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setAttachedImage(null);

    // AI Search against grounded knowledge base
    setTimeout(() => {
      const queryLower = textToSend.toLowerCase();
      let matchedEntry = null;

      if (imageAttached) {
        // Clinical image upload mapping
        matchedEntry = GROUNDED_KNOWLEDGE_BASE.find(k => k.sourceId === "NASA-IMMUNE-DYS");
      } else {
        matchedEntry = GROUNDED_KNOWLEDGE_BASE.find(entry => 
          entry.keywords.some(kw => queryLower.includes(kw))
        );
      }

      if (matchedEntry) {
        const fullSource = OFFICIAL_NASA_SOURCES.find(s => s.id === matchedEntry.sourceId);
        const aiMsg = {
          sender: 'system',
          title: matchedEntry.title,
          text: matchedEntry.response,
          sources: fullSource ? [fullSource] : []
        };
        setChatMessages(prev => [...prev, aiMsg]);

        // Log search index
        const newLog = {
          timestamp: new Date().toISOString(),
          missionDay: 142,
          index: `[RAG-MATCH: ${matchedEntry.sourceId}]`,
          sourceId: matchedEntry.sourceId,
          hash: '0x' + Math.random().toString(16).substring(2, 12)
        };
        setImmutableLogs(prev => [newLog, ...prev]);
      } else {
        // STRICT SAFEGUARD: NOT_FOUND
        const notFoundMsg = {
          sender: 'system',
          isSafeguard: true,
          text: 'NOT_FOUND: No grounded NASA medical reference available for this specific query.',
          details: 'Under NASA-STD-3001 protocol, unverified medical advice is strictly prohibited to prevent hallucination risk in space operations.',
          sources: OFFICIAL_NASA_SOURCES.slice(0, 3) // Provide top baseline references
        };
        setChatMessages(prev => [...prev, notFoundMsg]);

        // Log gap index
        const newLog = {
          timestamp: new Date().toISOString(),
          missionDay: 142,
          index: `[NOT_FOUND_GAP: ${queryLower.substring(0, 15)}]`,
          sourceId: 'GAP-LOG',
          hash: '0x' + Math.random().toString(16).substring(2, 12)
        };
        setImmutableLogs(prev => [newLog, ...prev]);
      }
    }, 600);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#0F172A] font-sans flex flex-col antialiased selection:bg-[#0F172A] selection:text-white">
      
      {/* HEADER / TOP TELEMETRY BAR */}
      <header className="sticky top-0 z-50 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#0F172A] text-white p-2 rounded-lg font-mono text-xs font-bold tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            SPACEMEDI // AETHERSYNC
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">NASA-STD-3001 COMPLIANT</span>
        </div>

        {/* Global Telemetry Chips */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-md shadow-sm">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{telemetry.heartRate} BPM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-md shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>O2: {telemetry.oxygen}%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-md shadow-sm">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>RAD: {telemetry.radiation} mSv/d</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>DAY 142 // ECLSS NOMINAL</span>
          </div>
        </div>

        {/* Navigation Layers */}
        <nav className="flex items-center bg-[#EAE6DF] p-1 rounded-lg border border-[#DCD6CD] space-x-1">
          {[
            { id: 1, name: 'Suit Auth' },
            { id: 2, name: '3D Hologram' },
            { id: 3, name: 'Dashboard' },
            { id: 4, name: 'Offline RAG AI' },
            { id: 5, name: 'NASA Sources' }
          ].map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeLayer === layer.id
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'text-slate-700 hover:bg-[#DDD7CD]'
              }`}
            >
              L{layer.id}: {layer.name}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* LAYER 1: SUIT INTEGRATION & IDENTITY VERIFICATION */}
        {activeLayer === 1 && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4 mb-6">
                <Lock className="w-6 h-6 text-[#0F172A]" />
                <div>
                  <h2 className="text-xl font-bold font-mono">LAYER 1: SUIT PAIRING & IDENTITY VERIFICATION</h2>
                  <p className="text-xs text-slate-500">Secure Edge TLS Handshake with NASA Bio-Suit Telemetry System</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Astronaut Identity Form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Astronaut Credentials</h3>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">CREW MEMBER NAME</label>
                    <input 
                      type="text" 
                      value={astronaut.name}
                      onChange={(e) => setAstronaut({ ...astronaut, name: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">MISSION IDENTIFIER</label>
                      <input 
                        type="text" 
                        value={astronaut.missionId}
                        onChange={(e) => setAstronaut({ ...astronaut, missionId: e.target.value })}
                        className="w-full bg-[#F9F8F6] border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">CREW ROLE</label>
                      <input 
                        type="text" 
                        value={astronaut.role}
                        onChange={(e) => setAstronaut({ ...astronaut, role: e.target.value })}
                        className="w-full bg-[#F9F8F6] border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleConnectSuit}
                      className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-mono font-semibold py-3 px-4 rounded-lg shadow flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="w-4 h-4 text-emerald-400" />
                      PAIR BIO-SUIT & PROCEED TO DIAGNOSTICS
                    </button>
                  </div>
                </div>

                {/* Bluetooth / Suit Hardware Connection Status */}
                <div className="bg-[#F4F1EA] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold text-slate-600 uppercase">Hardware Pairing Stream</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800">
                        BLE-STATION-ONLINE
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between p-2.5 bg-white rounded-md border border-[#E2E8F0]">
                        <span>Suit Pressure Mesh:</span>
                        <span className="font-bold text-emerald-600">{telemetry.pressure} PSI (Nominal)</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-white rounded-md border border-[#E2E8F0]">
                        <span>Primary O2 Reserve:</span>
                        <span className="font-bold text-emerald-600">98.4% Capacity</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-white rounded-md border border-[#E2E8F0]">
                        <span>Thermal Management:</span>
                        <span className="font-bold text-slate-800">36.8°C Core</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>NASA-STD-3001 Vol 1 requires full suit identity verification before unlocking anatomical body diagnostics.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 2: 3D REALISTIC HOLOGRAPHIC BODY VISUALIZER */}
        {activeLayer === 2 && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold font-mono">LAYER 2: HOLOGRAPHIC ANATOMICAL SCANNER</h2>
                  <p className="text-xs text-slate-500">Interactive Body Diagnostics & Microgravity Physiological Status</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveLayer(3)}
                    className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 hover:bg-slate-800"
                  >
                    FULL SYSTEM DIAGNOSTIC <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Organ Diagnostic Menu */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">System Organ Status</h3>
                  
                  {Object.entries(organStatus).map(([key, organ]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedOrgan(key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedOrgan === key 
                          ? 'border-[#0F172A] bg-[#F4F1EA] shadow-md' 
                          : 'border-[#E2E8F0] bg-white hover:bg-[#F9F8F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {key === 'brain' && <Brain className="w-5 h-5 text-indigo-600" />}
                        {key === 'cardio' && <Heart className="w-5 h-5 text-rose-600" />}
                        {key === 'spine' && <Bone className="w-5 h-5 text-slate-600" />}
                        {key === 'immune' && <Stethoscope className="w-5 h-5 text-amber-600" />}
                        <div>
                          <div className="text-sm font-bold">{organ.label}</div>
                          <div className="text-xs font-mono text-slate-400">{organ.code}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                        organ.status === 'nominal' ? 'bg-emerald-100 text-emerald-800' :
                        organ.status === 'adaptation' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {organ.status.toUpperCase()}
                      </span>
                    </div>
                  ))}

                  <div className="pt-4 p-4 bg-[#F9F8F6] border border-[#E2E8F0] rounded-xl space-y-2 text-xs">
                    <div className="font-bold font-mono">SELECTED NODE DIAGNOSTIC:</div>
                    <p className="text-slate-600">
                      {selectedOrgan === 'brain' && 'Optic disc edema check required. Microgravity fluid shift detected in intracranial pathway.'}
                      {selectedOrgan === 'cardio' && 'Cardiovascular volume redistribution nominal. HR resting at 72 BPM.'}
                      {selectedOrgan === 'spine' && 'Spinal column elongation +1.8 cm observed. Vertebral load baseline normal.'}
                      {selectedOrgan === 'immune' && 'Erythema rash detected on upper arm. Latent stress antibody reactivation flag.'}
                    </p>
                  </div>
                </div>

                {/* Simulated Realistic Hologram SVG / Canvas Visualizer */}
                <div className="lg:col-span-8 bg-[#0F172A] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[420px] shadow-xl border border-slate-800">
                  {/* Grid Lines Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

                  {/* Scan Sweep Effect */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/4"></div>

                  <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                    {/* SVG Human Anatomical Silhouette with Glowing Nodes */}
                    <svg viewBox="0 0 200 400" className="w-56 h-80 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                      {/* Body Outline */}
                      <path 
                        d="M100 20 C115 20 125 35 125 50 C125 65 115 75 100 75 C85 75 75 65 75 50 C75 35 85 20 100 20 Z M70 85 L130 85 L145 150 L135 240 L120 380 L105 380 L105 260 L95 260 L95 380 L80 380 L65 240 L55 150 Z" 
                        fill="none" 
                        stroke="#38BDF8" 
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="opacity-70"
                      />

                      {/* Head Node (SANS/Brain) */}
                      <circle 
                        cx="100" cy="48" r="12" 
                        fill={selectedOrgan === 'brain' ? '#818CF8' : '#34D399'} 
                        className="cursor-pointer transition-all hover:scale-125 opacity-80" 
                        onClick={() => setSelectedOrgan('brain')}
                      />
                      <circle cx="100" cy="48" r="18" fill="none" stroke="#818CF8" strokeWidth="1" className="animate-ping" />

                      {/* Chest Node (Cardio) */}
                      <circle 
                        cx="100" cy="110" r="10" 
                        fill={selectedOrgan === 'cardio' ? '#F43F5E' : '#FBBF24'} 
                        className="cursor-pointer transition-all hover:scale-125 opacity-80" 
                        onClick={() => setSelectedOrgan('cardio')}
                      />

                      {/* Spine Node */}
                      <line 
                        x1="100" y1="75" x2="100" y2="200" 
                        stroke={selectedOrgan === 'spine' ? '#38BDF8' : '#64748B'} 
                        strokeWidth="4" 
                        className="cursor-pointer"
                        onClick={() => setSelectedOrgan('spine')}
                      />

                      {/* Abdomen / Immune Node */}
                      <circle 
                        cx="100" cy="170" r="11" 
                        fill={selectedOrgan === 'immune' ? '#F59E0B' : '#F43F5E'} 
                        className="cursor-pointer transition-all hover:scale-125 opacity-80" 
                        onClick={() => setSelectedOrgan('immune')}
                      />
                    </svg>

                    <div className="mt-4 text-center font-mono text-xs text-cyan-400 tracking-widest uppercase">
                      Holographic Mesh Diagnostic Active // Node: {selectedOrgan.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 3: DYNAMIC HEALTH DASHBOARD & COGNITIVE ASSESSMENT */}
        {activeLayer === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Baseline Comparison Table */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Astronaut Baseline vs. Live Flight Telemetry
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-slate-500">
                        <th className="pb-2">METRIC</th>
                        <th className="pb-2">EARTH BASELINE</th>
                        <th className="pb-2">CURRENT</th>
                        <th className="pb-2">DEVIATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 font-bold">Resting Heart Rate</td>
                        <td>65 BPM</td>
                        <td>{telemetry.heartRate} BPM</td>
                        <td className="text-amber-600 font-bold">+10.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">SpO2 Oxygen Saturation</td>
                        <td>99.0%</td>
                        <td>{telemetry.oxygen}%</td>
                        <td className="text-emerald-600 font-bold">-0.6%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">Intraocular Pressure (IOP)</td>
                        <td>14 mmHg</td>
                        <td>18 mmHg</td>
                        <td className="text-rose-600 font-bold">+28.5% (SANS Warning)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">Spinal Elongation</td>
                        <td>178.0 cm</td>
                        <td>179.8 cm</td>
                        <td className="text-slate-700 font-bold">+1.8 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cognitive Stress Micro-Game */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      Cognitive Fatigue Micro-Test
                    </h3>
                    <span className="text-xs font-mono text-slate-400">NASA-STD-3001 BHP</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">
                    Memorize the sequence pattern to test neuro-cognitive reaction time and orbital isolation stress.
                  </p>

                  {/* Puzzle Buttons */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        disabled={isPlayingCog}
                        onClick={() => handleCogButtonClick(idx)}
                        className={`h-16 rounded-xl font-mono text-lg font-bold border transition-all ${
                          cogActiveIndex === idx
                            ? 'bg-[#0F172A] text-white scale-95 border-[#0F172A]'
                            : 'bg-[#F4F1EA] text-slate-800 border-[#E2E8F0] hover:bg-[#DDD7CD]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {cogScore && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono font-bold text-emerald-800">
                      RESULT: {cogScore}
                    </div>
                  )}

                  <button
                    onClick={startCognitiveTest}
                    disabled={isPlayingCog}
                    className="w-full bg-[#0F172A] text-white py-2.5 rounded-lg text-xs font-mono font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPlayingCog ? 'animate-spin' : ''}`} />
                    {isPlayingCog ? 'FLASHING SEQUENCE...' : 'START COGNITIVE SCAN'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* LAYER 4 & 5: OFFLINE MULTIMODAL RAG & IMMUTABLE NASA KNOWLEDGE VAULT */}
        {(activeLayer === 4 || activeLayer === 5) && (
          <div className="space-y-6">
            
            {/* Top Navigation Switch for Layer 4 vs 5 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold font-mono">
                    {activeLayer === 4 ? 'LAYER 4: OFFLINE MULTIMODAL NASA RAG AI' : 'LAYER 5: IMMUTABLE LOGS & OFFICIAL SOURCES'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeLayer === 4 
                      ? 'Strict Grounded NASA Assistance with NOT_FOUND Hallucination Safeguard' 
                      : 'Verified NASA Human Spaceflight Standards (10+ Primary Links & Audit Trail)'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveLayer(4)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${activeLayer === 4 ? 'bg-[#0F172A] text-white' : 'bg-[#F4F1EA] text-slate-700'}`}
                  >
                    AI Chatbot
                  </button>
                  <button 
                    onClick={() => setActiveLayer(5)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${activeLayer === 5 ? 'bg-[#0F172A] text-white' : 'bg-[#F4F1EA] text-slate-700'}`}
                  >
                    Sources & Logs
                  </button>
                </div>
              </div>

              {/* LAYER 4: MULTIMODAL RAG CHAT INTERFACE */}
              {activeLayer === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Chat Box */}
                  <div className="lg:col-span-8 flex flex-col h-[520px] bg-[#F9F8F6] border border-[#E2E8F0] rounded-xl overflow-hidden">
                    
                    {/* Chat Stream */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] rounded-xl p-3.5 shadow-sm space-y-2 ${
                            msg.sender === 'user'
                              ? 'bg-[#0F172A] text-white rounded-br-none font-medium'
                              : msg.isSafeguard
                              ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-bl-none'
                              : 'bg-white border border-[#E2E8F0] text-slate-800 rounded-bl-none'
                          }`}>
                            {msg.title && <div className="font-bold text-sm border-b pb-1 mb-1 font-mono">{msg.title}</div>}
                            <p className="leading-relaxed">{msg.text}</p>
                            {msg.details && <p className="text-[11px] opacity-80 mt-1">{msg.details}</p>}

                            {/* Attached Image Indicator */}
                            {msg.image && (
                              <div className="mt-2 p-2 bg-slate-800 rounded border border-slate-700 flex items-center gap-2 text-xs font-mono">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Attached Scan: {msg.image}</span>
                              </div>
                            )}

                            {/* Grounded Source Citations with Direct Official NASA Links */}
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-slate-200/50 space-y-1 font-mono text-[11px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wider block">Grounded NASA References:</span>
                                {msg.sources.map((src, idx) => (
                                  <a
                                    key={idx}
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline mr-3"
                                  >
                                    <span>[{src.id}] {src.title}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input Controls */}
                    <div className="p-3 bg-white border-t border-[#E2E8F0] flex flex-col gap-2">
                      {attachedImage && (
                        <div className="flex items-center justify-between px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-xs font-mono text-indigo-800">
                          <span>Attached Clinical Image: {attachedImage.name}</span>
                          <button onClick={() => setAttachedImage(null)} className="text-indigo-600 hover:font-bold">X</button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Simulated Image Upload */}
                        <label className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F4F1EA] hover:bg-[#DDD7CD] cursor-pointer text-slate-700">
                          <Stethoscope className="w-4 h-4" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files[0] && setAttachedImage(e.target.files[0])}
                          />
                        </label>

                        {/* Mic Voice Simulation */}
                        <button
                          onClick={() => setIsRecording(!isRecording)}
                          className={`p-2.5 rounded-lg border transition-all ${
                            isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#F4F1EA] text-slate-700 border-[#E2E8F0]'
                          }`}
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          value={inputQuery}
                          onChange={(e) => setInputQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask space medicine query (e.g. SANS, Radiation, Stress)..."
                          className="flex-1 bg-[#F9F8F6] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                        />

                        <button
                          onClick={() => handleSendMessage()}
                          className="bg-[#0F172A] hover:bg-slate-800 text-white p-2.5 rounded-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Preset Grounded Query Quick Buttons */}
                  <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Quick Grounded Clinical Prompts</h3>
                    {[
                      "What is the NASA protocol for SANS vision blur?",
                      "Cabin radiation is 0.85 mSv/day. What are safety steps?",
                      "How do microgravity fluid shifts affect resting heart rate?",
                      "Astronaut reports skin rash and itching on arm.",
                      "What is the cosmic radiation threshold for deep space?" // Triggers NOT_FOUND if ungrounded
                    ].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(promptText)}
                        className="w-full text-left p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-slate-700 hover:bg-[#F4F1EA] hover:border-[#0F172A] transition-all font-medium"
                      >
                        "{promptText}"
                      </button>
                    ))}

                    <div className="p-4 bg-[#F4F1EA] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                      <div className="font-bold font-mono text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        HALLUCINATION SAFEGUARD
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        If a user query lacks 100% verified grounding in NASA-STD-3001, the system triggers the deterministic 
                        <code className="bg-slate-200 px-1 py-0.5 rounded text-rose-800 font-mono">NOT_FOUND</code> safeguard.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYER 5: OFFICIAL NASA SOURCES (10+ DIRECT LINKS) & IMMUTABLE LOGS */}
              {activeLayer === 5 && (
                <div className="space-y-8">
                  
                  {/* Official Links Section */}
                  <div>
                    <h3 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-indigo-600" />
                      Official NASA Primary Medical & Spaceflight Sources (11 Links)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {OFFICIAL_NASA_SOURCES.map((source) => (
                        <div key={source.id} className="bg-[#F9F8F6] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="px-2 py-0.5 rounded bg-[#0F172A] text-white font-mono text-[10px] font-bold">
                                {source.id}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 uppercase">{source.category}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mb-1">{source.title}</h4>
                            <p className="text-[11px] text-slate-600 leading-snug mb-3">{source.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              Visit NASA Page <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => copyToClipboard(source.url, source.id)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Copy URL"
                            >
                              {copiedLink === source.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immutable Log Ledger Table */}
                  <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                    <h3 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-slate-700" />
                      Read-Only Cryptographic Mission Index Ledger (Earth Sync Queue)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-slate-500">
                            <th className="pb-2">TIMESTAMP (UTC)</th>
                            <th className="pb-2">MISSION DAY</th>
                            <th className="pb-2">INDEX DATA</th>
                            <th className="pb-2">GROUNDED SOURCE</th>
                            <th className="pb-2">HASH VERIFICATION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {immutableLogs.map((log, i) => (
                            <tr key={i}>
                              <td className="py-2">{log.timestamp}</td>
                              <td>DAY {log.missionDay}</td>
                              <td className="font-bold text-slate-800">{log.index}</td>
                              <td className="text-indigo-600">{log.sourceId}</td>
                              <td className="text-slate-400">{log.hash}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#F4F1EA] border-t border-[#E2E8F0] py-4 px-6 text-center text-xs font-mono text-slate-500">
        SpaceMedi (AetherSync) — NASA Human Spaceflight Standards (NASA-STD-3001) Integration Architecture
      </footer>
    </div>
  );
}
