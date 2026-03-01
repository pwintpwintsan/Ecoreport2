import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { GraphGenerator } from './GraphGenerator';
import { ReportContent } from './ReportContent';
import { AuditForm } from './AuditForm';
import { AuditData, AuditCategory, AuditFormData } from '../types';
import { 
  Leaf, 
  Users, 
  CircleDollarSign, 
  LayoutDashboard, 
  ChevronRight,
  Info,
  Upload,
  BarChart3,
  Sparkles,
  FileEdit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: { id: AuditCategory; label: string; icon: any; color: string; description: string }[] = [
  { 
    id: 'Environmental', 
    label: 'Environmental Performance', 
    icon: Leaf, 
    color: 'emerald',
    description: 'Resource usage, ecological impact, and carbon footprint tracking.'
  },
  { 
    id: 'Social', 
    label: 'Social & Community', 
    icon: Users, 
    color: 'blue',
    description: 'People-centered sustainability and local community engagement.'
  },
  { 
    id: 'Economic', 
    label: 'Economic Sustainability', 
    icon: CircleDollarSign, 
    color: 'amber',
    description: 'Financial viability and responsible business practices.'
  },
];

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AuditData[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AuditCategory>('Environmental');
  const [currentStep, setCurrentStep] = useState(1);
  const [auditFormData, setAuditFormData] = useState<AuditFormData | null>(null);

  const handleDataLoaded = (newData: AuditData[], name: string) => {
    setData(newData);
    setFileName(name);
    setCurrentStep(3); // Move to visualization step
  };

  const handleAuditFormComplete = (formData: AuditFormData) => {
    setAuditFormData(formData);
    setCurrentStep(2); // Move to data source step
  };

  const handleClear = () => {
    setData([]);
    setFileName(null);
    setCurrentStep(1);
    setAuditFormData(null);
  };

  const steps = [
    { id: 1, label: 'Audit Entry', icon: FileEdit },
    { id: 2, label: 'Data Source', icon: Upload },
    { id: 3, label: 'Visualization', icon: BarChart3 },
    { id: 4, label: 'AI Report', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar / Navigation */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-30 hidden lg:block">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">EcoAudit <span className="text-emerald-600">Pro</span></h1>
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium transition-all">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            
            <div className="pt-6 pb-2">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Audit Categories</p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group mb-1
                    ${activeCategory === cat.id 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-sm">{cat.label}</span>
                  </div>
                  {activeCategory === cat.id && <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-medium text-slate-400 mb-1">Current Session</p>
              <p className="text-sm font-semibold truncate">{fileName || 'No file active'}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              Live Audit System
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
              EcoAudit Dashboard
            </h2>
            <p className="text-slate-500 max-w-2xl">
              Automated sustainability reporting and energy audit analysis.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-400">Welcome back,</p>
              <p className="text-sm font-bold text-slate-900">Sustainability Auditor</p>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/auditor/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Progress Steps Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              
              // Allow navigation to any step as requested
              const canNavigate = true;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => canNavigate && setCurrentStep(step.id)}
                    disabled={!canNavigate}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCurrent ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110' : 
                        isActive ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}
                      ${!canNavigate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-emerald-400'}
                    `}
                  >
                    <StepIcon className="w-5 h-5" />
                  </button>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Tabs - Only show when past step 1 */}
        {currentStep > 1 && (
          <div className="mb-8 flex p-1 bg-slate-100 rounded-xl w-fit mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all
                  ${activeCategory === cat.id 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                {cat.label.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        <section className="space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AuditForm onComplete={handleAuditFormComplete} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FileUploader 
                  onDataLoaded={handleDataLoaded} 
                  onClear={handleClear} 
                  currentFile={fileName} 
                />
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-all"
                  >
                    Back to Audit Entry
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Visualization Step</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Configure your audit graphs below. You can switch between categories using the tabs above to see different performance metrics.
                    </p>
                  </div>
                </div>
                <GraphGenerator data={data} category={activeCategory} />
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-all"
                  >
                    Back to Data Source
                  </button>
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                  >
                    Save & Generate AI Report
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <ReportContent 
                  data={data} 
                  category={activeCategory} 
                  auditFormData={auditFormData} 
                  onGoToStep={setCurrentStep}
                />
                <div className="flex justify-center">
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-all"
                  >
                    Back to Visualization
                  </button>
                </div>
              </motion.div>
            )}

            {/* Removed conditional block that hid steps when data was missing */}
          </AnimatePresence>
        </section>
      </main>

      {/* Mobile Nav Overlay (Simplified) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-slate-200 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-2 rounded-full transition-all ${activeCategory === cat.id ? 'bg-emerald-600 text-white scale-110 shadow-lg' : 'text-slate-400'}`}
          >
            <cat.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};
