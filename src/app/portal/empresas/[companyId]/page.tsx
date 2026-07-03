import UnitHomePage from '@/components/UnitHomePage';

export default async function CompanyHome({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  return <UnitHomePage companyId={companyId} />;
}
