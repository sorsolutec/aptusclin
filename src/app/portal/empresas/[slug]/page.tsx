import React from 'react';
import EmpresasLayout from '@/app/portal/empresas/layout';
import CompanyDashboard from '@/components/company/Dashboard';

type Params = {
  slug: string;
};

export default function EmpresaPage({ params }: { params: Params }) {
  const companyMap: Record<string, { title: string; imageUrl?: string }> = {
    sorriso: { title: 'Sorriso' },
    ubirata: { title: 'Nova Ubitatã' },
    'boa-esperanca-do-norte': { title: 'Boa Esperança do Norte' },
    mutum: { title: 'Nova Mutum' },
  };

  const data = companyMap[params.slug];

  if (!data) {
    return (
      <EmpresasLayout>
        <h2 className="text-xl text-red-600">Empresa não encontrada</h2>
      </EmpresasLayout>
    );
  }

  return (
    <EmpresasLayout>
      <CompanyDashboard
        slug={params.slug}
        title={data.title}
        imageUrl={data.imageUrl}
      />
    </EmpresasLayout>
  );
}
