'use client';

import React from 'react';
import UnitModernPage from './UnitModernPage';
import { TenantConfig } from '@/lib/tenant';

export interface SorrisoUnitPageProps {
  initialData?: Partial<TenantConfig>;
}

export default function SorrisoUnitPage({ initialData }: SorrisoUnitPageProps) {
  return <UnitModernPage unitId="sorriso" initialData={initialData} />;
}
