import React, { useState, useRef, useEffect } from 'react';
import { useCluster } from '../context/ClusterContext';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, Trash2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output';
  text: string;
}

export const TerminalSimulator: React.FC = () => {
  const { runKubectl } = useCluster();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'KubeVerse Interactive Kubectl Terminal [Version 1.30.2]\nType "kubectl help" or "kubectl get all" to explore cluster state.\n'
    }
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const output = runKubectl(cmd);

    setHistory(prev => [
      ...prev,
      { id: 'cmd-' + Math.random(), type: 'command', text: `$ ${cmd}` },
      { id: 'out-' + Math.random(), type: 'output', text: output }
    ]);

    setCmdHistory(prev => [cmd, ...prev]);
    setHistoryIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  const executeShortcut = (cmd: string) => {
    const output = runKubectl(cmd);
    setHistory(prev => [
      ...prev,
      { id: 'cmd-' + Math.random(), type: 'command', text: `$ ${cmd}` },
      { id: 'out-' + Math.random(), type: 'output', text: output }
    ]);
  };

  const clearTerminal = () => {
    setHistory([
      {
        id: 'init-1',
        type: 'output',
        text: 'KubeVerse Interactive Kubectl Terminal [Version 1.30.2]\n'
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <TerminalIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono">
                Interactive Kubectl CLI Terminal
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                v1.30.2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute live kubectl CLI commands directly against your visual cluster.
            </p>
          </div>
        </div>

        <button
          onClick={clearTerminal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Suggested Quick Commands */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Quick Run:
        </span>
        {[
          'kubectl get all',
          'kubectl get pods -o wide',
          'kubectl get nodes',
          'kubectl get svc',
          'kubectl top nodes',
          'kubectl cluster-info'
        ].map(cmd => (
          <button
            key={cmd}
            onClick={() => executeShortcut(cmd)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div
        className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden cursor-text min-h-[500px] flex flex-col font-mono text-xs"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="ml-2 text-slate-300 font-bold">bash - user@kubeverse-control-plane:~</span>
          </div>
          <span className="text-[11px] text-slate-500">Connected to https://127.0.0.1:6443</span>
        </div>

        {/* Terminal Output Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2 leading-relaxed">
          {history.map(item => (
            <div key={item.id}>
              {item.type === 'command' ? (
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="text-slate-500">$</span>
                  <span>{item.text.replace(/^\$\s*/, '')}</span>
                </div>
              ) : (
                <pre className="text-slate-300 whitespace-pre-wrap font-mono pl-4 text-[11px]">
                  {item.text}
                </pre>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-slate-900/90 border-t border-slate-800">
          <span className="text-emerald-400 font-bold select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type kubectl command here... (e.g. kubectl get pods, kubectl scale deployment web-frontend --replicas=4)"
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
