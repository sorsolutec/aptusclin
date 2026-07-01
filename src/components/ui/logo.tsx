import React from 'react'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className = 'h-12' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo/Arco Verde */}
        <path
          d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 A 40 40 0 0 1 50 10"
          stroke="#1B8B3A"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="200 40"
        />
        {/* Cruz Verde */}
        <path
          d="M 50 30 V 70 M 30 50 H 70"
          stroke="#1B8B3A"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Parte de cima: Aptus + Símbolo + clin */}
      <div className="flex items-center gap-1 leading-none">
        {/* Texto Aptus em Azul Escuro */}
        <span className="text-3xl font-extrabold text-[#0b3c7d] tracking-tight font-sans">
          Aptus
        </span>

        {/* Ícone Estilizado da Cruz */}
        <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Círculo/Arco Verde */}
            <path
              d="M 50 8 A 42 42 0 1 1 49.9 8"
              stroke="#1B8B3A"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="210 50"
              transform="rotate(-45 50 50)"
            />
            {/* Cruz Verde */}
            <path
              d="M 50 25 V 75 M 25 50 H 75"
              stroke="#1B8B3A"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Texto clin em Verde */}
        <span className="text-3xl font-extrabold text-[#1B8B3A] tracking-tight font-sans">
          clin
        </span>
      </div>

      {/* Subtexto: MEDICINA DO TRABALHO */}
      <div className="text-[8px] sm:text-[9px] font-medium text-[#333333] tracking-[0.22em] text-center sm:text-left mt-1 font-sans uppercase">
        Medicina do Trabalho
      </div>
    </div>
  )
}
