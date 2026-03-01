import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuditData, AuditCategory, AuditFormData } from '../types';
import { generateAuditInsights } from '../services/geminiService';
import { Sparkles, FileText, Loader2, Download, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: AuditData[];
  category: AuditCategory;
  auditFormData: AuditFormData | null;
  onGoToStep: (step: number) => void;
}

export const ReportContent: React.FC<Props> = ({ data, category, auditFormData, onGoToStep }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const content = await generateAuditInsights(data, category, auditFormData);
      setReport(content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!report && !loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Generate AI Audit Report</h3>
            <p className="text-slate-500">
              Our AI will analyze your building context and performance data to generate a professional OSE compliant audit report based on Annex A standards.
            </p>
            {data.length === 0 && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3 text-left">
                <div className="p-1 bg-amber-100 rounded-full mt-0.5">
                  <BarChart3 className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Performance Data Missing</p>
                  <p className="text-xs text-amber-700">You haven't uploaded any performance data yet. The report will be limited to building information.</p>
                  <button 
                    onClick={() => onGoToStep(2)}
                    className="mt-2 text-xs font-bold text-amber-900 underline hover:no-underline"
                  >
                    Go to Data Source →
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleGenerate}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-3 mx-auto"
          >
            <FileText className="w-5 h-5" />
            {data.length === 0 ? 'Generate Preliminary Report' : 'Generate Full Report'}
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center space-y-6 shadow-sm">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Preparing OSE Audit Report...</h3>
            <p className="text-slate-500">Compiling building data and performance metrics into Annex A format.</p>
          </div>
        </div>
      )}

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Report Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm sticky top-4 z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="font-bold text-slate-900">AI Report: {auditFormData?.general.buildingName || 'Building Audit'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReport(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition-all text-sm"
              >
                Regenerate
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Formal Document Layout */}
          <div className="bg-white shadow-2xl rounded-sm border border-slate-200 mx-auto max-w-[210mm] min-h-[297mm] print:shadow-none print:border-none">
            {/* Document Header / Cover Page Style */}
            <div className="p-16 border-b-8 border-emerald-600">
              <div className="flex justify-between items-start mb-20">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">OSE AUDIT</h1>
                  <p className="text-emerald-600 font-bold tracking-widest text-sm">REPORT SUBMISSION</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Edition 4.0</p>
                  <p className="text-sm font-medium text-slate-600">Annex A Template</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Building Name</label>
                  <h2 className="text-3xl font-bold text-slate-900">{auditFormData?.general.buildingName || 'N/A'}</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Audit Period</label>
                    <p className="text-lg font-semibold text-slate-800">1-Week Performance Data</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Report Date</label>
                    <p className="text-lg font-semibold text-slate-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-16">
              <div className="prose prose-slate max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-200
                prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-emerald-800
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-justify
                prose-li:text-slate-700
                prose-strong:text-slate-900
                prose-table:w-full prose-table:border-collapse prose-table:my-8
                prose-th:bg-slate-50 prose-th:border prose-th:border-slate-200 prose-th:p-3 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-wider
                prose-td:border prose-td:border-slate-200 prose-td:p-3 prose-td:text-sm
              ">
                <ReactMarkdown>{report}</ReactMarkdown>

                {/* Graph Reference Section */}
                <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed print:hidden">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BarChart3 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Missing Graphs?</h4>
                      <p className="text-sm text-slate-500 mb-4">
                        The AI report provides the analysis, but professional OSE submissions require visual evidence. 
                        Go back to the Visualization step to capture and export your performance charts.
                      </p>
                      <button 
                        onClick={() => onGoToStep(3)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Go to Visualization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>OSE Audit Report Submission</span>
                <span>Page 1 of 1</span>
                <span>Confidential</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
