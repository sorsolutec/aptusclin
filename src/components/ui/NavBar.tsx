"use client";
// src/components/ui/NavBar.tsx
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Aptusclin" className="h-8 w-auto" />
          <span className="font-semibold text-xl text-[#004080]">Aptusclin</span>
        </Link>
        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 text-[#004080] font-medium">
          <li>
            <Link href="#servicos" className="hover:text-[#00A3E0]">Serviços</Link>
          </li>
          <li>
            <Link href="#sobre" className="hover:text-[#00A3E0]">Sobre</Link>
          </li>
          <li>
            <Link href="#equipe" className="hover:text-[#00A3E0]">Equipe</Link>
          </li>
          <li>
            <Link href="#contato" className="hover:text-[#00A3E0]">Contato</Link>
          </li>
          <li className="relative group">
            <Link href="/admin/unidades" className="hover:text-[#00A3E0]">Clínicas</Link>
            <ul className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md">
              <li>
                <Link href="/clinica/boa-esperanca" className="block px-4 py-2 text-[#004080] hover:bg-[#f0f4ff]">Unidade Boa Esperança do Norte</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/portal/agenda" className="bg-[#004080] text-white px-4 py-2 rounded-md hover:bg-[#003366]">
              Área do Cliente
            </Link>
          </li>
        </ul>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#004080]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 p-4 text-[#004080] font-medium">
            <li>
              <Link href="#servicos" onClick={() => setOpen(false)} className="block hover:text-[#00A3E0]">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="#sobre" onClick={() => setOpen(false)} className="block hover:text-[#00A3E0]">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="#equipe" onClick={() => setOpen(false)} className="block hover:text-[#00A3E0]">
                Equipe
              </Link>
            </li>
            <li>
              <Link href="#contato" onClick={() => setOpen(false)} className="block hover:text-[#00A3E0]">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/portal/agenda" onClick={() => setOpen(false)} className="block bg-[#004080] text-white px-4 py-2 rounded-md text-center hover:bg-[#003366]">
                Área do Cliente
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
