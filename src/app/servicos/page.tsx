// src/app/servicos/page.tsx
import { Metadata } from 'next';
import { FileText, Activity, Building2, Shield } from 'lucide-react';
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Serviços | Aptusclin',
  description: 'Conheça os serviços de medicina ocupacional oferecidos pela Aptusclin.',
};

const services = [
  {
    icon: FileText,
    title: 'Exames Ocupacionais',
    desc: 'ASO admissional, periódico, demissional, mudança de função e retorno ao trabalho, com emissão ágil e segura.',
  },
  {
    icon: Activity,
    title: 'Exames Clínicos',
    desc: 'Amplo portfólio de exames laboratoriais, imagem e funcional para suporte à saúde ocupacional e preventiva.',
  },
  {
    icon: Building2,
    title: 'Atendimento In-Company',
    desc: 'Levamos a clínica até a sua empresa com unidades móveis e equipes treinadas para reduzir o absenteísmo.',
  },
  {
    icon: Shield,
    title: 'Programas de SST',
    desc: 'Elaboração e gestão de PGR, PCMSO, LTCAT e envio dos eventos de eSocial de SST para conformidade legal.',
  },
];

export default function ServicosPage() {
  return (
    <>
      <NavBar />
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-[#002855] mb-12">
            Nossos Serviços
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#002855] text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

