import React, { useState, ReactNode } from 'react';
import { K8S_CONCEPTS } from '../data/concepts';
import { BookOpen, Terminal, Sparkles } from 'lucide-react';
import { useCluster } from '../context/ClusterContext';

interface TooltipWrapperProps {
  conceptId?: string;
  customTitle?: string;
  customContent?: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  conceptId,
  customTitle,
  customContent,
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { selectElement } = useCluster();
  const concept = conceptId ? K8S_CONCEPTS[conceptId] : null;

  if (!concept && !customContent && !customTitle) {
    return <div className={className}>{children}</div>;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (conceptId) {
      selectElement('concept', conceptId);
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 pointer-events-auto w-80 text-left rounded-xl shadow-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl p-3.5 transition-all duration-200 transform scale-100 ${getPositionClasses()}`}
          style={{
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(50, 108, 229, 0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {concept ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-opacity-30"
                    style={{ backgroundColor: concept.color }}
                  />
                  <h4 className="text-xs font-bold text-slate-100 tracking-wide font-mono">
                    {concept.name}
                  </h4>
                </div>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {concept.kind || concept.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {concept.shortDescription}
              </p>

              {concept.analogy && (
                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-2 text-[11px] text-indigo-200 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="italic">{concept.analogy}</p>
                </div>
              )}

              {concept.kubectlCommands && concept.kubectlCommands.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded p-1.5 font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{concept.kubectlCommands[0].command}</span>
                </div>
              )}

              <button
                onClick={handleInspect}
                className="w-full mt-1.5 py-1 px-2 rounded-lg bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-blue-500/40 text-[11px] font-medium text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3 h-3" />
                Click to inspect & learn more
              </button>
            </div>
          ) : (
            <div>
              {customTitle && <div className="text-xs font-bold text-slate-200 mb-1">{customTitle}</div>}
              <div className="text-xs text-slate-300">{customContent}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
