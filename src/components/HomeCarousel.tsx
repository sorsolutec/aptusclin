'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  url: string;
  caption?: string;
}

export function HomeCarousel({ slides }: { slides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const hasSlides = slides && slides.length > 0;

  const nextSlide = () => {
    if (hasSlides) setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (hasSlides) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!hasSlides || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [hasSlides, slides.length]);

  if (!hasSlides) {
    return (
      <div className="bg-slate-950 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative aspect-[4/3] flex items-center justify-center">
        <p className="text-white/50 text-sm">Nenhuma imagem configurada</p>
      </div>
    );
  }

  const current = slides[currentSlide];

  return (
    <div className="bg-slate-950 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative aspect-[4/3] group">
      <Image
        src={current.url}
        alt={current.caption || "Aptusclin"}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="w-full h-full object-cover opacity-85 transition-opacity duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 text-white">
        <p className="text-xs text-blue-300 font-semibold uppercase tracking-widest">Aptusclin</p>
        <p className="text-sm font-bold mt-0.5">{current.caption || "Medicina Ocupacional"}</p>
      </div>
      
      {slides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-1.5 h-1.5 rounded-full transition shadow-sm ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
