import Link from "next/link";
import { MapPin, Phone, Mail, ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Unidade de Boa Esperança do Norte | Aptusclin",
};

const UNIT_ID = "boa-esperanca";

async function getUnitData() {
  try {
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/unidades/${UNIT_ID}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BoaEsperancaPage() {
  const unit = await getUnitData();
  const fotoUrl: string | null = unit?.foto_url ?? null;

  const exams = Array.isArray(unit?.exames_disponiveis) && unit.exames_disponiveis.length > 0
    ? unit.exames_disponiveis
    : [
        "Exame clínico",
        "Acuidade visual",
        "Teste de Ishihara",
        "Audiometria",
        "Espirometria",
        "Eletrocardiograma",
        "Eletroencefalograma",
        "Raio X",
        "Toxicológico",
        "Psicossocial",
        "Exames laboratoriais",
        "Teste de Romberg",
        "Ultrassonografia",
        "Dinamometria palmar / lombar",
      ];


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 flex flex-col justify-between">
      <div>
        {/* TOP BAR */}
        <div className="bg-[#002855] text-white py-2.5 px-4 text-xs font-medium border-b border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Unidade Boa Esperança do Norte</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#1B8B3A]" /> (66) 3544-0000
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-300" /> boaesperanca@aptusclin.com.br
              </span>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Logo className="scale-95" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#002855] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </div>
        </header>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-12 gap-8 items-start">

          {/* LEFT: INFO & FOTO */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <span className="bg-[#1B8B3A]/15 text-[#1B8B3A] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Medicina &amp; Segurança do Trabalho
              </span>
              <h1 className="text-3xl font-black text-[#002855] leading-tight">
                Unidade Boa Esperança do Norte
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Estrutura completa e equipamentos de última geração para atender as demandas
                ocupacionais e de segurança do trabalho de toda a região.
              </p>

              <div className="space-y-3 pt-2 text-sm border-t border-slate-100">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-[#1B8B3A] mt-1 flex-shrink-0" />
                  <span>Rua das Azaleias, 1627 – Centro</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="https://www.instagram.com/aptusclinboaesperanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 text-sm font-semibold transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>@aptusclinboaesperanca</span>
                </Link>
              </div>
            </div>

            {/* FOTO DA UNIDADE */}
            {fotoUrl ? (
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-sm border border-slate-100">
                <img
                  src={fotoUrl}
                  alt="Foto da Unidade Boa Esperança do Norte"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center aspect-[4/3] shadow-inner group hover:border-[#1B8B3A] transition duration-300">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#1B8B3A] transition duration-300">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#002855] text-sm mt-4">Foto da Unidade</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                  Adicione a foto pelo painel administrativo em{" "}
                  <span className="font-semibold">/admin/unidades/boa-esperanca/foto</span>
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: EXAMES */}
          <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#002855] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#1B8B3A] rounded-full" />
              Exames Disponíveis
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1B8B3A] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{exam}</span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#071224] text-white py-8 px-4 border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo className="brightness-0 invert scale-90" />
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Aptusclin Saúde Ocupacional – Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
