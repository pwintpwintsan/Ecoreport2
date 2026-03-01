export type AuditCategory = 'Environmental' | 'Social' | 'Economic';

export type GraphPurpose = 
  | 'Trend Analysis'
  | 'Category Comparison'
  | 'Composition / Breakdown'
  | 'Relationship / Correlation'
  | 'Distribution / Data Spread'
  | 'Performance & Target Tracking'
  | 'Multi-Dimensional Comparison'
  | 'Ranking & Hierarchy'
  | 'Timeline & Planning'
  | 'Flow & Process Visualization';

export interface AuditData {
  [key: string]: any;
}

export interface AuditFormData {
  general: {
    buildingName: string;
    address: string;
    buildingType: 'Office' | 'Hotel' | 'Mixed-use' | 'Institutional' | 'Industrial' | '';
    grossFloorArea: number | '';
    airConditionedArea: number | '';
    yearConstructed: number | '';
    lastAuditDate: string;
    operatingHours: string;
  };
  coolingPlant: {
    numChillers: number | '';
    totalCapacity: number | '';
    chillerType: ('Water-cooled' | 'Air-cooled' | 'Centrifugal' | 'Screw')[];
    ratedEfficiency: number | '';
    variableSpeed: boolean;
    chwSupplySetpoint: number | '';
    chwReturnTemp: number | '';
  };
  pumpSystem: {
    numChwPumps: number | '';
    pumpsVsd: boolean;
    chwDeltaT: number | '';
    numCwPumps: number | '';
    ctApproachTemp: number | '';
    ctFanVsd: boolean;
  };
  controlStrategy: {
    sequencing: 'load-based' | 'temperature-based' | 'time-based' | '';
    chwTempReset: boolean;
    dpControl: boolean;
    cwFlowOptimized: boolean;
    otherStrategies: string;
  };
  instrumentation: {
    loggingInterval: '1 min' | '5 min' | '15 min' | '';
    sensorsCalibrated: boolean;
    flowMetersHeader: boolean;
    powerMeters: ('Chillers' | 'CHW Pumps' | 'CW Pumps' | 'Cooling Towers' | 'AHUs')[];
    bmsVerified: boolean;
  };
  performance: {
    avgCoolingLoad: number | '';
    peakCoolingLoad: number | '';
    avgChillerEfficiency: number | '';
    overallPlantEfficiency: number | '';
    totalSystemEfficiency: number | '';
    heatBalanceWithin5Percent: number | '';
  };
  airSide: {
    totalPowerConsumption: number | '';
    efficiency: number | '';
    co2LevelsAcceptable: boolean;
    comfortStatus: 'Over-cooled' | 'Under-cooled' | 'Optimal' | '';
  };
  spaceConditions: {
    avgTemp: number | '';
    avgHumidity: number | '';
    comfortComplaints: string;
  };
  compliance: {
    chwDeltaTGreaterThan5_5: boolean;
    pumpEfficiencyOk: boolean;
    airSideEfficiencyOk: boolean;
    ctApproachOk: boolean;
    oseCompliant: boolean;
  };
  recommendations: {
    performanceGaps: string;
    correctiveMeasures: string;
    energySavingOpportunities: string;
    estimatedSavingsPercent: number | '';
  };
}

export interface GraphConfig {
  purpose: GraphPurpose;
  type: string;
  xAxis: string;
  yAxis: string;
  category: AuditCategory;
}

export interface ReportSection {
  title: string;
  content: string;
  category: AuditCategory;
}
