export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo à Aptusclin
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de agendamento de eventos
        </p>
        <a
          href="/portal/agenda"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Acessar Agenda
        </a>
      </div>
    </div>
  );
}
