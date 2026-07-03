"use client";

import React, { useState, useEffect, use } from 'react';
import ExamDownloadModal from '@/components/ui/ExamDownloadModal';

interface Exam {
  id: string;
  title: string;
  description?: string;
  date: string;
}

export default function ExamsPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/exames?companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error('Failed to load exams', err));
  }, [companyId]);

  const handleDownload = (exam: Exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  return (
    <section className="p-6 bg-page rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Exames Disponíveis</h2>
      <ul className="space-y-4">
        {exams.map((exam) => (
          <li key={exam.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-primary">{exam.title}</h3>
            {exam.description && <p className="text-muted">{exam.description}</p>}
            <p className="text-sm text-muted">{new Date(exam.date).toLocaleDateString()}</p>
            <button
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              onClick={() => handleDownload(exam)}
            >
              Baixar
            </button>
          </li>
        ))}
      </ul>
      {showModal && selectedExam && (
        <ExamDownloadModal
          exam={selectedExam}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
