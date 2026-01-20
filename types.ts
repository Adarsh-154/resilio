
export interface Supplier {
  id: string;
  name: string;
  location: string;
  category: string;
  spend: number;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  leadTimeDays: number;
}

export interface RiskAnalysis {
  overallScore: number;
  categories: {
    geopolitical: number;
    operational: number;
    financial: number;
    environmental: number;
  };
  keyInsights: string[];
  vulnerabilities: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

export interface ScenarioResult {
  scenarioName: string;
  impactOnOperations: string;
  financialRiskEstimate: string;
  mitigationSteps: string[];
}

export interface ProjectState {
  suppliers: Supplier[];
  analysis: RiskAnalysis | null;
  currentScenario: string;
  scenarioResult: ScenarioResult | null;
  loading: boolean;
  error: string | null;
}
