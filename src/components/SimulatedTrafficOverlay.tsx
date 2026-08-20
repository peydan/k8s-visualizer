import React from 'react';
import { useCluster } from '../context/ClusterContext';
import { Send, ArrowRight, Zap } from 'lucide-react';

export const SimulatedTrafficOverlay: React.FC = () => {
  const { packets } = useCluster();

  if (packets.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-40 space-y-2 pointer-events-none">
      {packets.map((pkt) => (
        <div
          key={pkt.id}
          className="bg-slate-900/95 border border-cyan-500/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl w-72 animate-bounce-short pointer-events-auto"
          style={{
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4), 0 10px 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              HTTP Request ({pkt.method})
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {pkt.progress}%
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-300 truncate mb-1">
            {pkt.url}
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 truncate">
            <span>Routing:</span>
            <span className="text-amber-400">{pkt.path.toUpperCase()}</span>
            <ArrowRight className="w-2.5 h-2.5" />
            <span className="text-emerald-400 truncate">{pkt.to}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200"
              style={{ width: `${pkt.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
