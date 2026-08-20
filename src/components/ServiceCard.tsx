import React from 'react';
import { K8sService } from '../types/k8s';
import { useCluster } from '../context/ClusterContext';
import { TooltipWrapper } from './TooltipWrapper';
import { Share2, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ServiceCardProps {
  service: K8sService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { selectElement, deleteService, state } = useCluster();

  const matchedCount = service.matchedPodIds.length;
  const isHealthy = matchedCount > 0;

  const getTypeBadgeClass = (type: K8sService['type']) => {
    switch (type) {
      case 'LoadBalancer':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'NodePort':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Headless':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'ClusterIP':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <TooltipWrapper conceptId="service" position="top">
      <div
        onClick={() => selectElement('service', service.id)}
        className="group relative p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-850 shadow-lg transition-all duration-300 cursor-pointer min-w-[260px]"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-mono font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                {service.name}
              </h4>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${getTypeBadgeClass(
                  service.type
                )}`}
              >
                {service.type}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteService(service.id);
            }}
            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
            title="Delete service"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Port & IP info */}
        <div className="bg-slate-950/70 rounded-lg p-2 border border-slate-800 space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>ClusterIP:</span>
            <span className="text-slate-200 font-semibold">{service.clusterIP}</span>
          </div>

          {service.externalIP && (
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-purple-400">External IP:</span>
              <span className="text-purple-300 font-semibold">{service.externalIP}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-400">
            <span>Port Map:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              :{service.port} <ArrowRight className="w-2.5 h-2.5" /> :{service.targetPort}
            </span>
          </div>
        </div>

        {/* Selector & Target Endpoints */}
        <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
          <div className="text-slate-400 truncate max-w-[130px]" title={JSON.stringify(service.selector)}>
            Selector: <span className="text-cyan-300">{Object.entries(service.selector).map(([k, v]) => `${k}=${v}`).join(',')}</span>
          </div>

          <div className="flex items-center gap-1">
            {isHealthy ? (
              <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {matchedCount} {matchedCount === 1 ? 'Pod' : 'Pods'}
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-0.5 font-bold">
                <AlertCircle className="w-3 h-3" />
                0 Pods
              </span>
            )}
          </div>
        </div>
      </div>
    </TooltipWrapper>
  );
};
