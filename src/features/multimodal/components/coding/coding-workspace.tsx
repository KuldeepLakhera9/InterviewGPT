'use client';

import * as React from 'react';
import { Code2, Play, CheckCircle2, XCircle, Terminal, RotateCcw } from 'lucide-react';
import type { CodingWorkspaceData, ProgrammingLanguage } from '../../types/multimodal.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodingWorkspaceProps {
  workspace: CodingWorkspaceData;
  onChangeCode: (code: string) => void;
  onChangeLanguage: (lang: ProgrammingLanguage) => void;
  onRunCode: () => void;
  onClearConsole: () => void;
}

export function CodingWorkspace({
  workspace,
  onChangeCode,
  onChangeLanguage,
  onRunCode,
  onClearConsole,
}: CodingWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState<'editor' | 'testcases' | 'console'>('editor');

  const lineCount = workspace.code.split('\n').length;

  return (
    <div
      id="coding-workspace-container"
      className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] shadow-xl"
    >
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-4 py-2 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-bold text-purple-400">
            <Code2 className="h-4 w-4" />
            <span>Interactive Coding Workspace</span>
          </div>

          {/* Language Selection Dropdown */}
          <select
            value={workspace.language}
            onChange={(e) => onChangeLanguage(e.target.value as ProgrammingLanguage)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] focus:ring-1 focus:ring-purple-500 focus:outline-none"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="go">Go</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ 20</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            onClick={onRunCode}
            disabled={workspace.executionStatus === 'running'}
            size="sm"
            className="h-7 space-x-1.5 bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{workspace.executionStatus === 'running' ? 'Running...' : 'Run Code'}</span>
          </Button>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={cn(
            'border-b-2 px-3 py-2 font-semibold transition-all',
            activeTab === 'editor'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[var(--text-secondary)] hover:text-white'
          )}
        >
          Code Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('testcases')}
          className={cn(
            'flex items-center space-x-1.5 border-b-2 px-3 py-2 font-semibold transition-all',
            activeTab === 'testcases'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[var(--text-secondary)] hover:text-white'
          )}
        >
          <span>Test Cases</span>
          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300">
            {workspace.testCases.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('console')}
          className={cn(
            'flex items-center space-x-1.5 border-b-2 px-3 py-2 font-semibold transition-all',
            activeTab === 'console'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[var(--text-secondary)] hover:text-white'
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Console Output</span>
        </button>
      </div>

      {/* Tab 1: Code Editor Window */}
      {activeTab === 'editor' && (
        <div className="flex flex-1 overflow-hidden bg-slate-950 font-mono text-xs text-slate-100">
          {/* Line Numbers */}
          <div className="border-r border-slate-800 bg-slate-900/50 px-3 py-3 text-right text-slate-600 select-none">
            {Array.from({ length: Math.max(15, lineCount) }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text Area */}
          <textarea
            value={workspace.code}
            onChange={(e) => onChangeCode(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-3 leading-relaxed text-slate-100 focus:outline-none"
          />
        </div>
      )}

      {/* Tab 2: Test Cases Panel */}
      {activeTab === 'testcases' && (
        <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--bg-surface-1)] p-4">
          {workspace.testCases.map((tc, idx) => (
            <div
              key={tc.id}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[var(--text-primary)]">
                    Case {idx + 1}: {tc.title}
                  </span>
                </div>
                {tc.passed !== undefined && (
                  <span
                    className={cn(
                      'flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-bold',
                      tc.passed
                        ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                    )}
                  >
                    {tc.passed ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{tc.passed ? 'PASSED' : 'FAILED'}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="rounded border border-white/5 bg-black/40 p-2">
                  <span className="block font-sans text-[10px] text-gray-400">Input:</span>
                  <span>{tc.input}</span>
                </div>
                <div className="rounded border border-white/5 bg-black/40 p-2">
                  <span className="block font-sans text-[10px] text-gray-400">
                    Expected Output:
                  </span>
                  <span className="text-emerald-300">{tc.expectedOutput}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Console Output Panel */}
      {activeTab === 'console' && (
        <div className="flex flex-1 flex-col overflow-y-auto bg-black p-4 font-mono text-xs text-green-400">
          <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-[11px] text-gray-400">Execution Log Stream</span>
            <button
              type="button"
              onClick={onClearConsole}
              className="flex items-center space-x-1 text-[10px] text-gray-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Log</span>
            </button>
          </div>

          <div className="flex-1 space-y-1">
            {workspace.consoleOutput.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
