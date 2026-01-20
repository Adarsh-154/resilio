
import { Supplier } from './types';

export const SAMPLE_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Global Circuits Ltd', location: 'Shenzhen, China', category: 'Semiconductors', spend: 4500000, criticality: 'Critical', leadTimeDays: 45 },
  { id: '2', name: 'Precision Alloy Co', location: 'Kaohsiung, Taiwan', category: 'Raw Materials', spend: 1200000, criticality: 'High', leadTimeDays: 30 },
  { id: '3', name: 'Euro Logistics AG', location: 'Hamburg, Germany', category: 'Logistics', spend: 800000, criticality: 'Medium', leadTimeDays: 14 },
  { id: '4', name: 'AmeriParts Inc', location: 'Austin, USA', category: 'Mechanical Components', spend: 2100000, criticality: 'High', leadTimeDays: 21 },
  { id: '5', name: 'V-Tech Sensors', location: 'Seoul, South Korea', category: 'Electronics', spend: 3200000, criticality: 'Critical', leadTimeDays: 60 }
];

export const CATEGORIES = ['Semiconductors', 'Raw Materials', 'Logistics', 'Electronics', 'Mechanical Components', 'Packaging'];
export const CRITICALITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
