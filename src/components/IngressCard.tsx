import React from 'react';
import { K8sIngress } from '../types/k8s';
import { useCluster } from '../context/ClusterContext';
import { TooltipWrapper } from './TooltipWrapper';
import { Globe, Lock, Trash2, ArrowRight } from 'lucide-react';

interface IngressCardProps {
  ingress: K8sIngress;
}

export const IngressCard: React.FC<IngressCardProps> = ({ ingress }) => {
  const { selectElement, deleteIngress } = useCluster();

  return (
    <TooltipWrapper conceptId="ingress" position="bottom">
      <div
        onClick={() => selectElement('ingress', ingress.id)}
        className="group relative p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-850 shadow-lg transition-all duration-300 cursor-pointer min-w-[280px]"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-mono font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                  {ingress.name}
                </h4>
                {ingress.tlsEnabled && (
                  <span className="p-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" title="TLS / HTTPS enabled">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                Controller: {ingress.controller.toUpperCase()} Ingress
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteIngress();
            }}
            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
            title="Delete ingress"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rules Table */}
        <div className="bg-slate-950/70 rounded-lg p-2 border border-slate-800 space-y-1.5 text-[11px] font-mono">
          {ingress.rules.map((rule, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-300">
              <div className="truncate max-w-[140px] text-cyan-300">
                {rule.host}{rule.path}
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span>{rule.serviceName}:{rule.servicePort}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipWrapper>
  );
};
