import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { Terminal, Trash2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const ClusterLogsDrawer: React.FC = () => {
  const { state, clearLogs } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');

  const filteredLogs = state.logs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'ChaosMonkey':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/50';
      case 'HPA':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/50';
      case 'API-Server':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
      case 'Scheduler':
        return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
      case 'ControllerManager':
        return 'bg-pink-950/60 text-pink-400 border-pink-800/50';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="fixed bottom-0 right-6 z-30 w-96 max-w-[calc(100vw-3rem)]">
      {/* Header bar toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 border border-slate-700/80 rounded-t-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-850 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            Cluster Events Stream ({state.logs.length})
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Drawer */}
      {isOpen && (
        <div className="bg-slate-950/95 border-x border-b border-slate-800/80 p-3 h-80 flex flex-col backdrop-blur-2xl shadow-2xl rounded-b-xl">
          {/* Controls & Filter */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] font-mono">
            <div className="flex gap-1">
              {(['all', 'info', 'success', 'warning', 'error'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    filter === f ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={clearLogs}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 p-1 rounded"
              title="Clear all events"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1 font-mono text-[11px]">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-slate-600 py-8">No matching cluster events</div>
            ) : (
              filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/70 flex items-start gap-2 group hover:border-slate-700 transition-colors"
                >
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getSourceBadgeClass(
                          log.source
                        )}`}
                      >
                        {log.source}
                      </span>
                      <span className="text-[10px] text-slate-600">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 break-words leading-relaxed">{log.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
