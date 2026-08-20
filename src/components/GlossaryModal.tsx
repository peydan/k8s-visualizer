import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { K8S_CONCEPTS } from '../data/concepts';
import { EducationalConcept, K8sComponentCategory } from '../types/k8s';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Terminal,
  Server,
  Database,
  Layers,
  Box,
  Share2,
  Globe,
  Sliders,
  Lock,
  HardDrive,
  TrendingUp,
  Cpu
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Server,
  Database,
  Compass: Globe,
  Cpu,
  Layers,
  Activity: Box,
  Box,
  Copy: Layers,
  Share2,
  Globe,
  Sliders,
  Lock,
  HardDrive,
  TrendingUp,
  Folder: Box
};

export const GlossaryModal: React.FC = () => {
  const { selectElement } = useCluster();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const conceptsList = Object.values(K8S_CONCEPTS);

  const filteredConcepts = conceptsList.filter(c => {
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      c.analogy.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Elements' },
    { id: 'control-plane', label: 'Control Plane' },
    { id: 'compute', label: 'Compute & Nodes' },
    { id: 'workload', label: 'Workloads & Pods' },
    { id: 'networking', label: 'Networking & Services' },
    { id: 'config', label: 'Configs & Secrets' },
    { id: 'storage', label: 'Storage & PVCs' },
    { id: 'scaling', label: 'Auto-Scaling' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono">
                Kubernetes Architectural Encyclopedia
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Visual Glossary
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive reference guide with real-world analogies, specifications, and manifests.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts, analogies..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === cat.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map(concept => {
          const Icon = iconMap[concept.iconName] || Box;

          return (
            <div
              key={concept.id}
              onClick={() => selectElement('concept', concept.id)}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/60 hover:bg-slate-850 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="p-2.5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${concept.color}20`, color: concept.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border font-mono"
                    style={{
                      backgroundColor: `${concept.color}15`,
                      color: concept.color,
                      borderColor: `${concept.color}40`
                    }}
                  >
                    {concept.kind || concept.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {concept.shortDescription}
                  </p>
                </div>

                {concept.analogy && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <p className="italic line-clamp-2">{concept.analogy}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:text-cyan-300 transition-colors">
                <span>Inspect full details & YAML</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
