import Link from "next/link";
import { Instagram } from "lucide-react";

export const metadata = {
  title: "Clínica de Boa Esperança do Norte | Aptusclin",
};

export default function BoaEsperancaPage() {
  const exams = [
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#d9e6ff] to-[#b3c7ff] p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Clínica de Boa Esperança do Norte
        </h1>
        <p className="text-center text-gray-600">
          Rua das Azaleias, 1627 – Centro
        </p>
        <div className="flex justify-center">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-56.0835%2C-14.2193%2C-56.0805%2C-14.2163&layer=mapnik"
            style={{ border: 0, borderRadius: "0.5rem" }}
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
        </div>
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Exames Disponíveis</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside text-gray-800">
            {exams.map((exam) => (
              <li key={exam}>{exam}</li>
            ))}
          </ul>
        </section>
        <section className="flex items-center justify-center space-x-4">
          <Link href="https://www.instagram.com/aptusclinboaesperanca" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-pink-600 hover:text-pink-800">
            <Instagram size={24} />
            <span>@aptusclinboaesperanca</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
