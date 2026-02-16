
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plane, Package, Calculator, Mail, Globe, Clock, MessageCircle,
  ChevronDown, UserPlus, ShoppingBag, Send, X, Menu, Sparkles, MapPin, Phone,
  ArrowRight, Headset, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { SERVICES_DATA, WHATSAPP_LINK, FAQ_DATA } from './constants';

const LogoIcon = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="50" cy="50" rx="15" ry="35" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <ellipse cx="50" cy="50" rx="35" ry="15" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <motion.path
      d="M20 75C25 70 40 50 75 30"
      stroke="#f97316"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
    />
    <motion.g
      transform="translate(75, 30) rotate(-35)"
      animate={{ x: [75, 78, 75], y: [30, 27, 30] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <path d="M0 0L18 6L14 9L0 6L-6 16L-10 14L-5 6L-18 4L-18 0Z" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinejoin="round" />
    </motion.g>
  </svg>
);

const LogoDIJ = ({ inverted = false }) => (
  <div className="flex items-center group cursor-pointer transition-all duration-300">
    <img
      src="/logo-official.svg"
      alt="DIJ LOGISTICS"
      className="h-12 md:h-16 lg:h-20 w-auto object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform"
    />
  </div>
);

const PartnerCarousel = () => (
  <section id="partners" className="py-20 bg-white border-y border-slate-100 overflow-hidden relative">
    <div className="max-w-[1400px] mx-auto px-6 mb-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Mayoristas y marketplaces tecnológicos con los que trabajamos</h2>
      <div className="w-20 h-1 bg-orange-500 mx-auto mt-6 rounded-full opacity-30" />
    </div>

    <div className="relative w-full flex overflow-hidden group">
      <div className="flex animate-scroll-logos hover:[animation-play-state:paused] py-10 items-center">
        {[
          { name: "Ingram Micro", src: "/partners/ingram-micro.svg" },
          { name: "TD SYNNEX", src: "/partners/td-synnex.svg" },
          { name: "Intcomex", src: "/partners/intcomex.svg" },
          { name: "D&H Distributing", src: "/partners/d-and-h.svg" },
          { name: "Amazon", src: "/partners/amazon.svg" },
          { name: "Newegg", src: "/partners/newegg.svg" },
          { name: "eBay", src: "/partners/ebay.svg" },
          { name: "Alibaba", src: "/partners/alibaba.svg" },
          { name: "AliExpress", src: "/partners/aliexpress.svg" },
        ].concat([
          { name: "Ingram Micro", src: "/partners/ingram-micro.svg" },
          { name: "TD SYNNEX", src: "/partners/td-synnex.svg" },
          { name: "Intcomex", src: "/partners/intcomex.svg" },
          { name: "D&H Distributing", src: "/partners/d-and-h.svg" },
          { name: "Amazon", src: "/partners/amazon.svg" },
          { name: "Newegg", src: "/partners/newegg.svg" },
          { name: "eBay", src: "/partners/ebay.svg" },
          { name: "Alibaba", src: "/partners/alibaba.svg" },
          { name: "AliExpress", src: "/partners/aliexpress.svg" },
        ]).map((partner, i) => (
          <div key={i} className="flex-shrink-0 w-[200px] md:w-[280px] px-10 flex items-center justify-center">
            <img
              src={partner.src}
              alt={`Oficial ${partner.name} Logo`}
              loading="lazy"
              className="max-h-12 w-auto object-contain transition-all duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes scroll-logos {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll-logos {
        animation: scroll-logos 40s linear infinite;
      }
      @media (max-width: 768px) {
        .animate-scroll-logos { animation-duration: 25s; }
      }
    `}</style>
  </section>
);

const LeadAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "¡Hola! Soy el asistente virtual de DIJLOGISTICS. 👋 ¿Cómo te llamas? Me encantaría ayudarte a cotizar tu envío hoy mismo." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: "Eres el asistente estrella de DIJLOGISTICS. Tu meta es ser amable y capturar: Nombre, qué envían, origen y destino. Si el usuario ya dio sus datos, invítalo a finalizar en WhatsApp. No hables de precios exactos, di que en WhatsApp le darán el mejor precio del mercado."
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Un segundo, estoy procesando tu solicitud..." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "¡Vaya! Parece que hay mucha demanda. Por favor, contáctanos directamente a WhatsApp para una atención inmediata." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[250]">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] md:w-[420px] h-[500px] md:h-[600px] bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"><Headset size={20} /></div>
                <div>
                  <p className="font-bold text-sm">DIJ Assistant</p>
                  <p className="text-[10px] opacity-60">Soporte Inteligente 24/7</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex gap-1 p-3 bg-white border border-slate-100 rounded-2xl w-max animate-pulse"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div><div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-60"></div><div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-30"></div></div>}
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-2">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-slate-100 rounded-2xl px-5 py-3.5 text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all" placeholder="Escribe tu mensaje..." />
              <button onClick={handleSend} className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-orange-500 transition-all"><Send size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-transform group">
        <MessageCircle size={20} className="text-white" />
        <span className="text-xs font-bold uppercase tracking-wide">¿Necesitas Ayuda?</span>
      </button>
    </div>
  );
};

const CalculatorSection = () => {
  const allRoutes = useMemo(() => SERVICES_DATA.flatMap(cat => cat.rates), []);
  const [idx, setIdx] = useState(0);
  const [dims, setDims] = useState({ l: '', w: '', h: '', we: '' });

  const calculation = useMemo(() => {
    const { l, w, h, we } = dims;
    const rate = allRoutes[idx];
    const len = parseFloat(l) || 0, wid = parseFloat(w) || 0, hei = parseFloat(h) || 0, weight = parseFloat(we) || 0;
    const price = parseFloat(rate.price) || 0;
    if (!len || !wid || !hei) return null;
    const volWeight = (len * wid * hei) / 166;
    const cubicFeet = (len * wid * hei) / 1728;
    const total = rate.type === 'Aéreo' ? Math.max(volWeight, weight) * price : cubicFeet * price;
    return { total: total.toFixed(2), volWeight: volWeight.toFixed(2), cubicFeet: cubicFeet.toFixed(2) };
  }, [dims, idx, allRoutes]);

  return (
    <div id="tarifas" className="max-w-[1200px] mx-auto bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col lg:flex-row overflow-hidden">
      <div className="flex-1 p-10 lg:p-16 bg-slate-50/40">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><Calculator size={28} /></div>
          <h3 className="text-2xl font-bold text-slate-900">Calcula tu Envío</h3>
        </div>
        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3 block">Ruta & Servicio</label>
            <select value={idx} onChange={e => setIdx(Number(e.target.value))} className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:border-orange-500 transition-all outline-none shadow-sm">
              {allRoutes.map((r, i) => <option key={i} value={i}>{r.origin} ➔ {r.destination} ({r.type})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['l', 'w', 'h'].map((d, i) => (
              <div key={d}>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3 block">{['Largo', 'Ancho', 'Alto'][i]} (in)</label>
                <input type="number" placeholder="0" value={dims[d as keyof typeof dims]} onChange={e => setDims({ ...dims, [d]: e.target.value })} className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-bold focus:border-orange-500 transition-all outline-none" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3 block">Peso Real (Libras)</label>
            <input type="number" placeholder="Ej: 5.5" value={dims.we} onChange={e => setDims({ ...dims, we: e.target.value })} className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-bold focus:border-orange-500 transition-all outline-none" />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[420px] p-10 lg:p-16 bg-white border-l border-slate-100 flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Total Estimado</h4>
          {calculation ? (
            <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all"></div>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Flete Proyectado</p>
                <p className="text-6xl font-bold">${calculation.total}<span className="text-sm font-medium opacity-50 ml-1">USD</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Peso Vol.</p>
                  <p className="text-lg font-bold text-slate-900">{calculation.volWeight} lb</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Volumen</p>
                  <p className="text-lg font-bold text-slate-900">{calculation.cubicFeet} ft³</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm border-2 border-dashed border-slate-100 p-8 rounded-[2rem] text-center">
              Ingresa las dimensiones para ver tu tarifa especial.
            </div>
          )}
        </div>
        <a href={WHATSAPP_LINK} target="_blank" className="mt-12 bg-orange-500 text-white py-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-center shadow-xl shadow-orange-500/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
          Cerrar Trato vía WhatsApp <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="faq" className="py-32 bg-slate-50">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Centro de Ayuda</span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Preguntas Frecuentes</h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => setActive(active === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left group">
                <span className="text-lg font-bold text-slate-800 pr-8 group-hover:text-orange-500 transition-colors">{faq.q}</span>
                <ChevronDown className={`text-slate-300 transition-transform duration-500 ${active === i ? 'rotate-180 text-orange-500' : ''}`} size={24} />
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-8 pb-8 pt-0 text-slate-500 font-medium leading-relaxed text-lg border-t border-slate-50 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  const navTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-orange-500/20">
      <LeadAIAssistant />

      {/* Dynamic Header */}
      <header className={`fixed w-full z-[150] transition-all duration-500 ${scrolled ? 'bg-white border-b border-slate-100 py-3 shadow-md' : 'bg-transparent py-5'}`}>
        <nav className="max-w-[1400px] mx-auto px-6 md:px-8 flex justify-between items-center">
          <button onClick={() => navTo('home')} className="relative z-[200]">
            <LogoDIJ inverted={!scrolled && !menuOpen} />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-10 items-center">
            {['Servicios', 'Pasos', 'Tarifas', 'Calculadora'].map(item => (
              <button key={item} onClick={() => navTo(item.toLowerCase())} className={`text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#F97316] transition-all ${scrolled ? 'text-slate-600' : 'text-white'}`}>
                {item}
              </button>
            ))}
            <a href={WHATSAPP_LINK} target="_blank" className="bg-[#F97316] text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 transform">
              WHATSAPP DIRECTO
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden relative z-[210] p-4 rounded-xl transition-all ${menuOpen ? 'text-slate-900 bg-slate-50' : (scrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10')}`}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="lg:hidden fixed inset-0 z-[200] bg-white flex flex-col pt-32 px-10"
          >
            <div className="flex flex-col gap-8 text-left">
              {['Servicios', 'Pasos', 'Tarifas', 'Calculadora', 'FAQ'].map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  key={item}
                  onClick={() => navTo(item.toLowerCase())}
                  className="text-5xl font-black text-slate-900 uppercase tracking-tighter hover:text-[#F97316] transition-all flex items-center justify-between group"
                >
                  {item}
                  <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#F97316]" size={40} />
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-16 space-y-10">
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex flex-col gap-5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Atención Personalizada 24/7</p>
                <a
                  href={WHATSAPP_LINK}
                  className="bg-[#F97316] text-white py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] text-center shadow-2xl shadow-orange-500/30 active:scale-95 transform transition-all flex items-center justify-center gap-4"
                >
                  <MessageCircle size={24} /> WhatsApp Directo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section id="home" className="relative h-screen flex items-center bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-60" alt="Global Logistics" />
            <div className="absolute inset-0 bg-slate-900/60" />
          </div>
          <div className="max-w-[1400px] mx-auto px-8 relative z-10 w-full pt-44 lg:pt-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl text-left">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/20 px-6 py-3 rounded-full mb-10">
                <Package className="text-[#F97316]" size={16} />
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">BODEGAS PROPIAS: MIAMI & CHINA</span>
              </div>
              <h1 className="text-[60px] md:text-[80px] lg:text-[110px] font-black text-white leading-[0.9] tracking-tighter mb-10">
                Tu Carga Global,<br />
                <span className="text-[#F97316]">Simple & Segura.</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-12 max-w-2xl font-medium leading-relaxed">
                Activa tu casillero corporativo GRATIS hoy. Importamos tecnología, maquinaria y retail a Panamá y Venezuela con tarifas fijas garantizadas.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href={WHATSAPP_LINK} className="bg-[#F97316] text-white px-10 py-5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-white hover:text-slate-900 transition-all transform active:scale-95">ABRIR CASILLERO GRATIS</a>
                <button onClick={() => navTo('tarifas')} className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">VER TARIFAS Y RUTAS</button>
              </div>
            </motion.div>
          </div>
        </section>

        <PartnerCarousel />

        {/* Steps */}
        <section id="pasos" className="py-32 bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="text-center mb-24">
              <span className="text-[#F97316] text-[12px] font-bold uppercase tracking-[0.4em] mb-4 block">Logística Simplificada</span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter italic">¿Cómo Funciona?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: UserPlus, t: "1. Regístrate Gratis", d: "Abre tu casillero vía chat o WhatsApp. Te asignamos direcciones en Miami y China sin mensualidades." },
                { icon: ShoppingBag, t: "2. Realiza tus Compras", d: "Envía tus paquetes de Amazon, Alibaba o eBay a nuestras bodegas estratégicas en Miami (Tax-Free)." },
                { icon: Package, t: "3. Recibe en Casa", d: "Gestionamos aduanas y transporte internacional hasta tu puerta en Panamá o Venezuela sin complicaciones." }
              ].map((s, i) => (
                <div key={i} className="group text-center">
                  <div className="mb-8 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-[#F97316] shadow-sm">
                    <s.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{s.t}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Calculator */}
        <section className="py-32 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="text-center mb-24">
              <span className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Transparencia de Costos</span>
              <h2 className="text-5xl font-bold text-slate-900 tracking-tighter">Tarifas 2025 Actualizadas</h2>
            </div>
            <CalculatorSection />
          </div>
        </section>

        {/* Features / Trust */}
        <section className="py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: ShieldCheck, t: "Carga Asegurada", d: "Pólizas de protección contra todo riesgo para tu tranquilidad." },
                  { icon: Zap, t: "Velocidad Extrema", d: "Vuelos diarios y salidas marítimas semanales constantes." },
                  { icon: CheckCircle2, t: "Sin Comisiones", d: "Precios finales por peso o volumen. Sin cargos ocultos." },
                  { icon: Globe, t: "Hub China-Miami", d: "Consolidación profesional en los centros de carga más grandes." }
                ].map((f, i) => (
                  <div key={i} className="space-y-4">
                    <div className="text-orange-600"><f.icon size={32} /></div>
                    <h4 className="text-xl font-bold text-slate-900">{f.t}</h4>
                    <p className="text-slate-500 text-sm font-medium">{f.d}</p>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-orange-500/5 rounded-[4rem] blur-3xl"></div>
                <div className="relative bg-slate-900 p-16 rounded-[4rem] text-white">
                  <h3 className="text-4xl font-bold mb-8 tracking-tighter">¿Listo para importar sin límites?</h3>
                  <p className="text-slate-400 text-lg mb-12 font-medium">Únete a la logística del futuro. Registro rápido y atención personalizada vía WhatsApp.</p>
                  <a href={WHATSAPP_LINK} className="inline-flex items-center gap-4 bg-orange-500 px-10 py-6 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                    Abrir mi Casillero Ahora <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-20 border-b border-white/5 pb-24">
            <div className="lg:col-span-2 space-y-12">
              <LogoDIJ inverted={true} />
              <p className="text-slate-500 text-xl font-medium max-w-sm leading-relaxed">
                Revolucionando la logística internacional con centros de operación en Panamá, Miami y China.
              </p>
              <div className="flex gap-4">
                {[MessageCircle, Mail, MapPin].map((Icon, i) => (
                  <a key={i} href={WHATSAPP_LINK} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Direcciones HUB</h4>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <MapPin className="text-orange-500 shrink-0" size={24} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase">Miami Warehouse</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">7924 NW 66 ST, FLORIDA, 33166</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="text-orange-500 shrink-0" size={24} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase">Línea Directa</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase">+507 6949-1531</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Sitemap</h4>
              <ul className="space-y-4">
                {['Servicios', 'Pasos', 'Tarifas', 'Calculadora', 'FAQ'].map(link => (
                  <li key={link}><button onClick={() => navTo(link.toLowerCase())} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">© 2025 DIJLOGISTICS CORP. GLOBAL LOGISTICS GROUP.</p>
            <div className="flex gap-10">
              {['Términos', 'Privacidad', 'Aduanas'].map(i => <button key={i} className="text-[9px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">{i}</button>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
