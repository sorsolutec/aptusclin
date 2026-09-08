'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UnitOption {
  id: string;
  cidade: string;
  estado: string;
  url: string;
}

const UNITS: UnitOption[] = [
  { id: 'sorriso',         cidade: 'Sorriso',                  estado: 'MT', url: '/unidades/sorriso' },
  { id: 'nova-ubirata',    cidade: 'Nova Ubiratã',             estado: 'MT', url: '/unidades/nova-ubirata' },
  { id: 'boa-esperanca',   cidade: 'Boa Esperança do Norte',   estado: 'MT', url: '/unidades/boa-esperanca' },
  { id: 'nova-mutum',      cidade: 'Nova Mutum',               estado: 'MT', url: '/unidades/nova-mutum' },
];

export function HeroUnitSelector() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length > 0
    ? UNITS.filter(u =>
        u.cidade.toLowerCase().includes(query.toLowerCase()) ||
        u.estado.toLowerCase().includes(query.toLowerCase())
      )
    : UNITS;

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function goToUnit(unit: UnitOption) {
    setQuery('');
    setOpen(false);
    router.push(unit.url);
  }

  function scrollToUnits() {
    const el = document.getElementById('unidades');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Pílulas de cidades */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {UNITS.map(unit => (
          <button
            key={unit.id}
            onClick={() => goToUnit(unit)}
            className="group inline-flex items-center gap-1.5 bg-white/10 hover:bg-[#1B8B3A] border border-white/20 hover:border-[#1B8B3A] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:shadow-lg hover:shadow-[#1B8B3A]/30 hover:-translate-y-0.5"
          >
            <MapPin className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
            {unit.cidade}
          </button>
        ))}
      </div>

      {/* Campo de busca com autocomplete */}
      <div ref={wrapperRef} className="relative max-w-sm md:max-w-md">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-white/50 focus-within:bg-white/15 transition-all">
          <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar cidade ou unidade..."
            className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none min-w-0"
            aria-label="Buscar unidade"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-slate-400 text-sm text-center">
                Nenhuma unidade encontrada
              </div>
            ) : (
              <ul>
                {filtered.map(unit => (
                  <li key={unit.id}>
                    <button
                      onClick={() => goToUnit(unit)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#002855]/8 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-[#002855]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{unit.cidade}</p>
                          <p className="text-[11px] text-slate-400">{unit.estado} · Aptusclin</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1B8B3A] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                ))}
                <li className="border-t border-slate-100">
                  <button
                    onClick={() => { setOpen(false); scrollToUnits(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[#002855] text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Ver todas as unidades
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
