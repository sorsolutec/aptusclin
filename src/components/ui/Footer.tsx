// src/components/ui/Footer.tsx
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#071224] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              (11) 4000-0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              contato@aptusclin.com.br
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              São Paulo – SP
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Links</h3>
          <ul className="space-y-2">
  <li>
    <Link href="/" className="hover:underline">Home</Link>
  </li>
  <li>
    <Link href="#servicos" className="hover:underline">Serviços</Link>
  </li>
  <li>
    <Link href="#sobre" className="hover:underline">Sobre</Link>
  </li>
  <li>
    <Link href="/contato" className="hover:underline">Contato</Link>
  </li>
  <li>
    <Link href="/clinica/boa-esperanca" className="hover:underline">Unidade Boa Esperança do Norte</Link>
  </li>
</ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
          <p>/* Ícones de redes sociais podem ser adicionados aqui */</p>
        </div>
      </div>
      <div className="mt-8 text-center text-slate-400">
        © 2025 Aptusclin – Medicina Ocupacional. Todos os direitos reservados.
      </div>
    </footer>
  );
}
