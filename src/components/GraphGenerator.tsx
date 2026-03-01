import React, { useState, useMemo, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Sankey
} from 'recharts';
import { AuditData, AuditCategory, GraphConfig, GraphPurpose } from '../types';
import { 
  Settings2, 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Layers, 
  Target, 
  Activity, 
  GitBranch, 
  Clock, 
  HelpCircle,
  ArrowRightLeft,
  Download
} from 'lucide-react';

interface Props {
  data: AuditData[];
  category: AuditCategory;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const PURPOSE_MAP: Record<GraphPurpose, { types: string[]; icon: any; usedFor: string[]; bestWhen: string }> = {
  'Trend Analysis': {
    types: ['Line Chart', 'Area Chart'],
    icon: TrendingUp,
    usedFor: [
      'Monitoring performance over time',
      'Tracking energy, water, or cost trends',
      'Observing seasonal variation',
      'Identifying improvement or decline patterns',
      'Comparing planned vs actual over time'
    ],
    bestWhen: 'Your X-axis is time (hour, day, month, year).'
  },
  'Category Comparison': {
    types: ['Bar Chart', 'Grouped Bar'],
    icon: BarChart3,
    usedFor: [
      'Comparing departments or locations',
      'SDG score comparison',
      'Resource consumption by type',
      'Room or equipment performance',
      'Before vs after comparison'
    ],
    bestWhen: 'You need to compare multiple categories clearly.'
  },
  'Composition / Breakdown': {
    types: ['Pie Chart', 'Donut Chart', 'Stacked Bar'],
    icon: PieIcon,
    usedFor: [
      'Waste breakdown by type',
      'Budget allocation',
      'Energy source mix',
      'Expense structure',
      'Distribution percentage'
    ],
    bestWhen: 'Showing proportion or percentage contribution.'
  },
  'Relationship / Correlation': {
    types: ['Scatter Plot'],
    icon: Activity,
    usedFor: [
      'Cooling load vs energy efficiency',
      'Temperature vs power consumption',
      'Training hours vs performance',
      'Identifying correlations or anomalies'
    ],
    bestWhen: 'Analyzing how one variable affects another.'
  },
  'Distribution / Data Spread': {
    types: ['Histogram'],
    icon: Layers,
    usedFor: [
      'Frequency distribution',
      'Identifying outliers',
      'Understanding variability',
      'Measuring stability of system performance'
    ],
    bestWhen: 'You want to understand how values are spread.'
  },
  'Performance & Target Tracking': {
    types: ['KPI Chart', 'Progress Bar'],
    icon: Target,
    usedFor: [
      'Sustainability targets',
      'Compliance score tracking',
      'Energy reduction goals',
      'Operational KPIs'
    ],
    bestWhen: 'Showing current performance against a goal.'
  },
  'Multi-Dimensional Comparison': {
    types: ['Radar Chart'],
    icon: GitBranch,
    usedFor: [
      'SDG multi-criteria scoring',
      'Audit performance across categories',
      'Risk assessment matrix',
      'Sustainability dashboard overview'
    ],
    bestWhen: 'Comparing multiple metrics at once.'
  },
  'Ranking & Hierarchy': {
    types: ['Sorted Bar Chart'],
    icon: BarChart3,
    usedFor: [
      'Ranking top performers',
      'Identifying major contributors',
      'Showing process conversion stages',
      'Prioritizing risk areas'
    ],
    bestWhen: 'Order and magnitude matter.'
  },
  'Timeline & Planning': {
    types: ['Timeline Chart'],
    icon: Clock,
    usedFor: [
      'Audit schedules',
      'Implementation roadmaps',
      'Maintenance planning',
      'Project milestone tracking'
    ],
    bestWhen: 'Managing projects or operational phases.'
  },
  'Flow & Process Visualization': {
    types: ['Sankey Diagram'],
    icon: ArrowRightLeft,
    usedFor: [
      'Energy flow through systems',
      'Waste streams',
      'Budget allocation movement',
      'Resource transformation'
    ],
    bestWhen: 'Showing movement or transfer between stages.'
  }
};

export const GraphGenerator: React.FC<Props> = ({ data, category }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const columns = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  
  const [selectedUsedFor, setSelectedUsedFor] = useState<string>('');
  const [config, setConfig] = useState<GraphConfig>({
    purpose: 'Trend Analysis',
    type: 'Line Chart',
    xAxis: columns[0] || '',
    yAxis: columns[1] || '',
    category
  });

  const allUsedForOptions = useMemo(() => {
    return Object.entries(PURPOSE_MAP).flatMap(([purpose, info]) => 
      info.usedFor.map(option => ({ option, purpose: purpose as GraphPurpose }))
    );
  }, []);

  const handleUsedForChange = (option: string) => {
    setSelectedUsedFor(option);
    const found = allUsedForOptions.find(o => o.option === option);
    if (found) {
      setConfig({
        ...config,
        purpose: found.purpose,
        type: PURPOSE_MAP[found.purpose].types[0]
      });
    }
  };

  const handlePurposeChange = (purpose: GraphPurpose) => {
    setSelectedUsedFor('');
    setConfig({
      ...config,
      purpose,
      type: PURPOSE_MAP[purpose].types[0]
    });
  };

  const aggregatedData = useMemo(() => {
    if (!config.xAxis || !config.yAxis || data.length === 0) return [];
    
    // Aggregate values by category for specific chart types
    const typesToAggregate = ['Pie Chart', 'Donut Chart', 'Bar Chart', 'Sorted Bar Chart', 'Radar Chart', 'Stacked Bar'];
    if (typesToAggregate.includes(config.type)) {
      const map = new Map<string, number>();
      data.forEach(item => {
        const key = String(item[config.xAxis]);
        const val = Number(item[config.yAxis]) || 0;
        map.set(key, (map.get(key) || 0) + val);
      });
      return Array.from(map.entries()).map(([name, value]) => ({
        [config.xAxis]: name,
        [config.yAxis]: value
      }));
    }
    
    return data;
  }, [data, config.xAxis, config.yAxis, config.type]);

  const handleDownload = async () => {
    if (chartRef.current === null) return;
    
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: '#ffffff', cacheBust: true });
      const link = document.createElement('a');
      link.download = `audit-chart-${config.type.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download chart', err);
    }
  };

  const renderChart = () => {
    if (data.length === 0) return null;

    // Prepare Sankey data if needed
    if (config.type === 'Sankey Diagram') {
      const nodesSet = new Set<string>();
      data.forEach(d => {
        if (d[config.xAxis]) nodesSet.add(String(d[config.xAxis]));
        if (d[config.yAxis]) nodesSet.add(String(d[config.yAxis]));
      });
      const nodes = Array.from(nodesSet).map(name => ({ name }));
      const nodeIndexMap = new Map(nodes.map((n, i) => [n.name, i]));

      const links = data.map(d => ({
        source: nodeIndexMap.get(String(d[config.xAxis])) ?? 0,
        target: nodeIndexMap.get(String(d[config.yAxis])) ?? 0,
        value: Number(d.value || d.amount || 1)
      })).filter(l => l.source !== l.target);

      if (nodes.length === 0 || links.length === 0) {
        return (
          <div className="h-[400px] flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            <p>Insufficient flow data for Sankey Diagram</p>
          </div>
        );
      }

      return (
        <ResponsiveContainer width="100%" height={400}>
          <Sankey
            data={{ nodes, links }}
            node={{ stroke: '#10b981', strokeWidth: 2 }}
            link={{ stroke: '#e5e7eb', fill: '#10b981', fillOpacity: 0.1 }}
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      );
    }

    const commonProps = {
      width: "100%" as const,
      height: 400 as const,
      data: config.type.includes('Pie') || config.type.includes('Donut') || config.type.includes('Radar') || config.type.includes('Stacked') ? aggregatedData : data
    };

    switch (config.type) {
      case 'Line Chart':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <LineChart data={commonProps.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={config.yAxis} stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Area Chart':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <AreaChart data={commonProps.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={config.yAxis} stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'Bar Chart':
      case 'Sorted Bar Chart':
      case 'Histogram':
        const sortedData = config.type === 'Sorted Bar Chart' ? [...aggregatedData].sort((a, b) => b[config.yAxis] - a[config.yAxis]) : commonProps.data;
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <BarChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.yAxis} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Stacked Bar':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <BarChart data={commonProps.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.yAxis} fill="#3b82f6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Pie Chart':
      case 'Donut Chart':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <PieChart>
              <Pie
                data={commonProps.data}
                dataKey={config.yAxis}
                nameKey={config.xAxis}
                cx="50%"
                cy="50%"
                innerRadius={config.type === 'Donut Chart' ? 80 : 0}
                outerRadius={150}
                label
              >
                {commonProps.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'Scatter Plot':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={config.xAxis} name={config.xAxis} />
              <YAxis dataKey={config.yAxis} name={config.yAxis} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Data Points" data={commonProps.data} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'Radar Chart':
        return (
          <ResponsiveContainer width={commonProps.width} height={commonProps.height}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={commonProps.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={config.xAxis} />
              <PolarRadiusAxis />
              <Radar name={config.yAxis} dataKey={config.yAxis} stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="h-[400px] flex items-center justify-center text-slate-400">
            <p>Chart type "{config.type}" is coming soon.</p>
          </div>
        );
    }
  };

  const currentPurpose = PURPOSE_MAP[config.purpose];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-slate-800">Graph Configuration</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">I want to...</label>
              <select 
                value={selectedUsedFor}
                onChange={(e) => handleUsedForChange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-w-[250px]"
              >
                <option value="">Select a specific goal</option>
                {allUsedForOptions.map((o, i) => (
                  <option key={i} value={o.option}>{o.option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Purpose</label>
              <select 
                value={config.purpose}
                onChange={(e) => handlePurposeChange(e.target.value as GraphPurpose)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-w-[200px]"
              >
                {Object.keys(PURPOSE_MAP).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Graph Type</label>
              <select 
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-w-[150px]"
              >
                {currentPurpose.types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">X-Axis</label>
              <select 
                value={config.xAxis}
                onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select X-Axis</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Y-Axis</label>
              <select 
                value={config.yAxis}
                onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Y-Axis</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Purpose Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-slate-100">
          <div className="flex gap-3">
            <div className="p-2 bg-slate-50 rounded-lg h-fit">
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Used For</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {currentPurpose.usedFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 bg-slate-50 rounded-lg h-fit">
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Best When</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPurpose.bestWhen}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8" ref={chartRef}>
        {config.xAxis && config.yAxis ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <currentPurpose.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{config.type} Analysis</h4>
                  <p className="text-xs text-slate-500">{config.xAxis} vs {config.yAxis}</p>
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Chart
              </button>
            </div>
            {renderChart()}
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
            <p>Select X and Y axis to generate the graph</p>
          </div>
        )}
      </div>
    </div>
  );
};
