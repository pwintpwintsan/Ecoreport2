import React, { useState } from 'react';
import { AuditFormData } from '../types';
import { 
  Building2, 
  Thermometer, 
  Wind, 
  Settings, 
  Activity, 
  ClipboardCheck, 
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_DATA: AuditFormData = {
  general: {
    buildingName: '',
    address: '',
    buildingType: '',
    grossFloorArea: '',
    airConditionedArea: '',
    yearConstructed: '',
    lastAuditDate: '',
    operatingHours: '',
  },
  coolingPlant: {
    numChillers: '',
    totalCapacity: '',
    chillerType: [],
    ratedEfficiency: '',
    variableSpeed: false,
    chwSupplySetpoint: '',
    chwReturnTemp: '',
  },
  pumpSystem: {
    numChwPumps: '',
    pumpsVsd: false,
    chwDeltaT: '',
    numCwPumps: '',
    ctApproachTemp: '',
    ctFanVsd: false,
  },
  controlStrategy: {
    sequencing: '',
    chwTempReset: false,
    dpControl: false,
    cwFlowOptimized: false,
    otherStrategies: '',
  },
  instrumentation: {
    loggingInterval: '',
    sensorsCalibrated: false,
    flowMetersHeader: false,
    powerMeters: [],
    bmsVerified: false,
  },
  performance: {
    avgCoolingLoad: '',
    peakCoolingLoad: '',
    avgChillerEfficiency: '',
    overallPlantEfficiency: '',
    totalSystemEfficiency: '',
    heatBalanceWithin5Percent: '',
  },
  airSide: {
    totalPowerConsumption: '',
    efficiency: '',
    co2LevelsAcceptable: false,
    comfortStatus: '',
  },
  spaceConditions: {
    avgTemp: '',
    avgHumidity: '',
    comfortComplaints: '',
  },
  compliance: {
    chwDeltaTGreaterThan5_5: false,
    pumpEfficiencyOk: false,
    airSideEfficiencyOk: false,
    ctApproachOk: false,
    oseCompliant: false,
  },
  recommendations: {
    performanceGaps: '',
    correctiveMeasures: '',
    energySavingOpportunities: '',
    estimatedSavingsPercent: '',
  },
};

interface Props {
  onComplete: (data: AuditFormData) => void;
}

export const AuditForm: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<AuditFormData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    { id: 'general', title: 'General Building Information', icon: Building2 },
    { id: 'coolingPlant', title: 'Cooling Plant Overview', icon: Thermometer },
    { id: 'pumpSystem', title: 'Pump & Cooling Tower', icon: Settings },
    { id: 'controlStrategy', title: 'Control Strategy', icon: Activity },
    { id: 'instrumentation', title: 'Instrumentation', icon: ClipboardCheck },
    { id: 'performance', title: 'Performance Data', icon: Activity },
    { id: 'airSide', title: 'Air-Side System', icon: Wind },
    { id: 'spaceConditions', title: 'Space Conditions', icon: Thermometer },
    { id: 'compliance', title: 'Compliance', icon: ClipboardCheck },
    { id: 'recommendations', title: 'Findings', icon: Lightbulb },
  ];

  const updateField = (section: keyof AuditFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleArrayField = (section: keyof AuditFormData, field: string, value: any) => {
    const currentArray = (formData[section] as any)[field] as any[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    updateField(section, field, newArray);
  };

  const renderSection = () => {
    const section = sections[activeTab].id as keyof AuditFormData;
    
    switch (section) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Building Name</label>
              <input 
                type="text" 
                value={formData.general.buildingName}
                onChange={e => updateField('general', 'buildingName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter building name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <input 
                type="text" 
                value={formData.general.address}
                onChange={e => updateField('general', 'address', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Building Type</label>
              <select 
                value={formData.general.buildingType}
                onChange={e => updateField('general', 'buildingType', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Type</option>
                <option value="Office">Office</option>
                <option value="Hotel">Hotel</option>
                <option value="Mixed-use">Mixed-use</option>
                <option value="Institutional">Institutional</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gross Floor Area (m²)</label>
              <input 
                type="number" 
                value={formData.general.grossFloorArea}
                onChange={e => updateField('general', 'grossFloorArea', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Air-Conditioned Area (m²)</label>
              <input 
                type="number" 
                value={formData.general.airConditionedArea}
                onChange={e => updateField('general', 'airConditionedArea', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Year Constructed</label>
              <input 
                type="number" 
                value={formData.general.yearConstructed}
                onChange={e => updateField('general', 'yearConstructed', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Last Audit Date</label>
              <input 
                type="date" 
                value={formData.general.lastAuditDate}
                onChange={e => updateField('general', 'lastAuditDate', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Operating Hours</label>
              <input 
                type="text" 
                value={formData.general.operatingHours}
                onChange={e => updateField('general', 'operatingHours', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 8:00 AM - 6:00 PM"
              />
            </div>
          </div>
        );
      case 'coolingPlant':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Number of Chillers</label>
              <input 
                type="number" 
                value={formData.coolingPlant.numChillers}
                onChange={e => updateField('coolingPlant', 'numChillers', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total Cooling Capacity (RT)</label>
              <input 
                type="number" 
                value={formData.coolingPlant.totalCapacity}
                onChange={e => updateField('coolingPlant', 'totalCapacity', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-semibold text-slate-700">Chiller Types</label>
              <div className="flex flex-wrap gap-4">
                {['Water-cooled', 'Air-cooled', 'Centrifugal', 'Screw'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.coolingPlant.chillerType.includes(type as any)}
                      onChange={() => toggleArrayField('coolingPlant', 'chillerType', type)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-slate-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Rated Chiller Efficiency (kW/RT)</label>
              <input 
                type="number" step="0.01"
                value={formData.coolingPlant.ratedEfficiency}
                onChange={e => updateField('coolingPlant', 'ratedEfficiency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.coolingPlant.variableSpeed}
                onChange={e => updateField('coolingPlant', 'variableSpeed', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Variable Speed Control?</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">CHW Supply Setpoint (°C)</label>
              <input 
                type="number" step="0.1"
                value={formData.coolingPlant.chwSupplySetpoint}
                onChange={e => updateField('coolingPlant', 'chwSupplySetpoint', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">CHW Return Temp (°C)</label>
              <input 
                type="number" step="0.1"
                value={formData.coolingPlant.chwReturnTemp}
                onChange={e => updateField('coolingPlant', 'chwReturnTemp', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        );
      case 'pumpSystem':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Number of CHW Pumps</label>
              <input 
                type="number" 
                value={formData.pumpSystem.numChwPumps}
                onChange={e => updateField('pumpSystem', 'numChwPumps', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.pumpSystem.pumpsVsd}
                onChange={e => updateField('pumpSystem', 'pumpsVsd', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Pumps Variable Speed (VSD)?</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">CHW ΔT (°C)</label>
              <input 
                type="number" step="0.1"
                value={formData.pumpSystem.chwDeltaT}
                onChange={e => updateField('pumpSystem', 'chwDeltaT', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Number of CW Pumps</label>
              <input 
                type="number" 
                value={formData.pumpSystem.numCwPumps}
                onChange={e => updateField('pumpSystem', 'numCwPumps', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Cooling Tower Approach Temp (°C)</label>
              <input 
                type="number" step="0.1"
                value={formData.pumpSystem.ctApproachTemp}
                onChange={e => updateField('pumpSystem', 'ctApproachTemp', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.pumpSystem.ctFanVsd}
                onChange={e => updateField('pumpSystem', 'ctFanVsd', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CT Fan Variable Speed?</label>
            </div>
          </div>
        );
      case 'controlStrategy':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Chiller Sequencing</label>
              <select 
                value={formData.controlStrategy.sequencing}
                onChange={e => updateField('controlStrategy', 'sequencing', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Strategy</option>
                <option value="load-based">Load-based</option>
                <option value="temperature-based">Temperature-based</option>
                <option value="time-based">Time-based</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.controlStrategy.chwTempReset}
                onChange={e => updateField('controlStrategy', 'chwTempReset', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CHW Temp Reset Used?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.controlStrategy.dpControl}
                onChange={e => updateField('controlStrategy', 'dpControl', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">DP Control for Pumps?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.controlStrategy.cwFlowOptimized}
                onChange={e => updateField('controlStrategy', 'cwFlowOptimized', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CW Flow Optimized (gpm/RT)?</label>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-semibold text-slate-700">Other Optimization Strategies</label>
              <textarea 
                value={formData.controlStrategy.otherStrategies}
                onChange={e => updateField('controlStrategy', 'otherStrategies', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                placeholder="Describe any other strategies..."
              />
            </div>
          </div>
        );
      case 'instrumentation':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Data Logging Interval</label>
              <select 
                value={formData.instrumentation.loggingInterval}
                onChange={e => updateField('instrumentation', 'loggingInterval', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Interval</option>
                <option value="1 min">1 min</option>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.instrumentation.sensorsCalibrated}
                onChange={e => updateField('instrumentation', 'sensorsCalibrated', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Sensors Calibrated?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.instrumentation.flowMetersHeader}
                onChange={e => updateField('instrumentation', 'flowMetersHeader', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Flow Meters at Header Level?</label>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-semibold text-slate-700">Power Meters Installed For:</label>
              <div className="flex flex-wrap gap-4">
                {['Chillers', 'CHW Pumps', 'CW Pumps', 'Cooling Towers', 'AHUs'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.instrumentation.powerMeters.includes(item as any)}
                      onChange={() => toggleArrayField('instrumentation', 'powerMeters', item)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-slate-600">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.instrumentation.bmsVerified}
                onChange={e => updateField('instrumentation', 'bmsVerified', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">BMS Data Verified Against Meters?</label>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Avg Cooling Load (RT)</label>
              <input 
                type="number" 
                value={formData.performance.avgCoolingLoad}
                onChange={e => updateField('performance', 'avgCoolingLoad', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Peak Cooling Load (RT)</label>
              <input 
                type="number" 
                value={formData.performance.peakCoolingLoad}
                onChange={e => updateField('performance', 'peakCoolingLoad', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Avg Chiller Efficiency (kW/RT)</label>
              <input 
                type="number" step="0.01"
                value={formData.performance.avgChillerEfficiency}
                onChange={e => updateField('performance', 'avgChillerEfficiency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Overall Plant Efficiency (kW/RT)</label>
              <input 
                type="number" step="0.01"
                value={formData.performance.overallPlantEfficiency}
                onChange={e => updateField('performance', 'overallPlantEfficiency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total System Efficiency (kW/RT)</label>
              <input 
                type="number" step="0.01"
                value={formData.performance.totalSystemEfficiency}
                onChange={e => updateField('performance', 'totalSystemEfficiency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Heat Balance within ±5% (%)</label>
              <input 
                type="number" 
                value={formData.performance.heatBalanceWithin5Percent}
                onChange={e => updateField('performance', 'heatBalanceWithin5Percent', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        );
      case 'airSide':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total Air-Side Power (kWh)</label>
              <input 
                type="number" 
                value={formData.airSide.totalPowerConsumption}
                onChange={e => updateField('airSide', 'totalPowerConsumption', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Air-Side Efficiency (kW/RT)</label>
              <input 
                type="number" step="0.01"
                value={formData.airSide.efficiency}
                onChange={e => updateField('airSide', 'efficiency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                checked={formData.airSide.co2LevelsAcceptable}
                onChange={e => updateField('airSide', 'co2LevelsAcceptable', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CO₂ Levels Acceptable?</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Space Comfort Status</label>
              <select 
                value={formData.airSide.comfortStatus}
                onChange={e => updateField('airSide', 'comfortStatus', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Status</option>
                <option value="Over-cooled">Over-cooled</option>
                <option value="Under-cooled">Under-cooled</option>
                <option value="Optimal">Optimal</option>
              </select>
            </div>
          </div>
        );
      case 'spaceConditions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Avg Indoor Temp (°C)</label>
              <input 
                type="number" step="0.1"
                value={formData.spaceConditions.avgTemp}
                onChange={e => updateField('spaceConditions', 'avgTemp', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Avg Relative Humidity (%)</label>
              <input 
                type="number" step="1"
                value={formData.spaceConditions.avgHumidity}
                onChange={e => updateField('spaceConditions', 'avgHumidity', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-semibold text-slate-700">Comfort Complaints</label>
              <textarea 
                value={formData.spaceConditions.comfortComplaints}
                onChange={e => updateField('spaceConditions', 'comfortComplaints', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                placeholder="Describe any complaints..."
              />
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.compliance.chwDeltaTGreaterThan5_5}
                onChange={e => updateField('compliance', 'chwDeltaTGreaterThan5_5', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CHW ΔT &gt; 5.5°C?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.compliance.pumpEfficiencyOk}
                onChange={e => updateField('compliance', 'pumpEfficiencyOk', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Pump Efficiency in Range?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.compliance.airSideEfficiencyOk}
                onChange={e => updateField('compliance', 'airSideEfficiencyOk', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Air-Side Efficiency ≤ 0.20 kW/RT?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.compliance.ctApproachOk}
                onChange={e => updateField('compliance', 'ctApproachOk', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">CT Approach ≤ 2°C?</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.compliance.oseCompliant}
                onChange={e => updateField('compliance', 'oseCompliant', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label className="text-sm font-semibold text-slate-700">Meets OSE Compliance Standard?</label>
            </div>
          </div>
        );
      case 'recommendations':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Key Performance Gaps</label>
              <textarea 
                value={formData.recommendations.performanceGaps}
                onChange={e => updateField('recommendations', 'performanceGaps', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Corrective Measures Implemented</label>
              <textarea 
                value={formData.recommendations.correctiveMeasures}
                onChange={e => updateField('recommendations', 'correctiveMeasures', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Energy-Saving Opportunities</label>
              <textarea 
                value={formData.recommendations.energySavingOpportunities}
                onChange={e => updateField('recommendations', 'energySavingOpportunities', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Estimated Potential Savings (%)</label>
              <input 
                type="number" 
                value={formData.recommendations.estimatedSavingsPercent}
                onChange={e => updateField('recommendations', 'estimatedSavingsPercent', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isLastTab = activeTab === sections.length - 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(index)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${activeTab === index 
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
                `}
              >
                <Icon className={`w-4 h-4 ${activeTab === index ? 'text-emerald-600' : 'text-slate-400'}`} />
                {section.title}
                {index < activeTab && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 flex flex-col min-h-[600px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{sections[activeTab].title}</h3>
            <p className="text-sm text-slate-500">Please provide the necessary details for this section.</p>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className="flex items-center gap-2 px-6 py-2 text-slate-600 font-semibold hover:text-slate-900 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {isLastTab ? (
              <button
                onClick={() => onComplete(formData)}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Save className="w-5 h-5" />
                Complete Audit Entry
              </button>
            ) : (
              <button
                onClick={() => setActiveTab(prev => Math.min(sections.length - 1, prev + 1))}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Next Section
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
