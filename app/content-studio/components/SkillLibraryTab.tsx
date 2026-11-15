'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Play,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface SkillLibraryTabProps {
  brandId: string;
}

export default function SkillLibraryTab({ brandId }: SkillLibraryTabProps) {
  const [skills, setSkills] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Schema Inspector modal
  const [inspectSkill, setInspectSkill] = useState<any | null>(null);

  // Test Runner modal
  const [testSkill, setTestSkill] = useState<any | null>(null);
  const [testInputJson, setTestInputJson] = useState('{}');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const res = await apiRequest('/content-studio/skills');
      setSkills(res.skills || []);
    } catch (err: any) {
      console.error('Fetch skills error:', err);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const fetchExecutions = async () => {
    try {
      const url = brandId
        ? `/content-studio/skills/executions?brandId=${brandId}`
        : '/content-studio/skills/executions';
      const res = await apiRequest(url);
      setExecutions(res.executions || []);
    } catch (err: any) {
      console.error('Fetch executions error:', err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchExecutions();
  }, [brandId]);

  const handleOpenTestRunner = (skill: any) => {
    setTestSkill(skill);
    setTestResult(null);
    setTestError(null);

    // Generate starter sample input
    const sampleInput: any = {};
    if (skill.inputSchema && skill.inputSchema.properties) {
      Object.keys(skill.inputSchema.properties).forEach((k) => {
        const prop = skill.inputSchema.properties[k];
        if (prop.type === 'string') sampleInput[k] = prop.description || 'sample text';
        else if (prop.type === 'number' || prop.type === 'integer') sampleInput[k] = 5;
        else if (prop.type === 'array') sampleInput[k] = ['sample item 1', 'sample item 2'];
        else sampleInput[k] = true;
      });
    }
    setTestInputJson(JSON.stringify(sampleInput, null, 2));
  };

  const handleRunTest = async () => {
    if (!testSkill) return;
    setIsRunningTest(true);
    setTestResult(null);
    setTestError(null);

    let parsed = {};
    try {
      parsed = JSON.parse(testInputJson);
    } catch (e: any) {
      setTestError('Invalid JSON format: ' + e.message);
      setIsRunningTest(false);
      return;
    }

    try {
      const res = await apiRequest('/content-studio/skills/test', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          skillId: testSkill.id,
          input: parsed
        })
      });
      setTestResult(res);
      fetchExecutions();
    } catch (err: any) {
      setTestError(err.message || 'Execution failed.');
    } finally {
      setIsRunningTest(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'STRATEGY', 'PLANNING', 'COPYWRITING', 'CREATIVE', 'GOVERNANCE', 'ONBOARDING'];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              AI Framework Core
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {skills.length} Registered Skills
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Skill Registry & Schema Inspector</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every AI interaction is a typed, schema-validated skill. Inspect input/output contracts, run live tests, and inspect audit logs.
          </p>
        </div>

        {/* Search & Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition text-[11px] ${selectedCategory === cat ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SKILL CARDS GRID */}
      {isLoadingSkills ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-500" />
          <span className="text-xs">Loading skill registry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
                    {skill.category || 'AI'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">v{skill.version || 1}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{skill.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {skill.description || 'Schema-validated AI execution skill.'}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-400 truncate">
                  ID: {skill.id}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setInspectSkill(skill)}
                  className="font-semibold text-slate-600 hover:text-purple-600 flex items-center space-x-1 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Schema</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTestRunner(skill)}
                  className="px-3 py-1.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs flex items-center space-x-1 cursor-pointer transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECENT EXECUTIONS AUDIT LOG */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Execution Audit Log (Last 10 Runs)</h3>
          </div>
          <span className="text-xs text-slate-400">Audited with OpenRouter & Prisma</span>
        </div>

        {executions && executions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Skill</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Tokens</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executions.map((exec) => (
                  <tr key={exec.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{exec.skill?.name || exec.skillId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exec.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {exec.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{exec.latencyMs ? `${exec.latencyMs}ms` : '—'}</td>
                    <td className="p-3 text-slate-500 font-mono">{exec.tokensUsed ? `${exec.tokensUsed}` : '—'}</td>
                    <td className="p-3 text-slate-400">{new Date(exec.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            No execution records found yet.
          </div>
        )}
      </div>

      {/* SCHEMA INSPECTOR MODAL */}
      {inspectSkill && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectSkill.name}</h3>
                <span className="text-[11px] font-mono text-purple-600">{inspectSkill.id}</span>
              </div>
              <button onClick={() => setInspectSkill(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Input Schema (JSON Schema):</span>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl overflow-x-auto text-[11px] font-mono">
                  {JSON.stringify(inspectSkill.inputSchema || {}, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Output Schema (JSON Schema):</span>
                <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl overflow-x-auto text-[11px] font-mono">
                  {JSON.stringify(inspectSkill.outputSchema || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setInspectSkill(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST RUNNER MODAL */}
      {testSkill && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-purple-600 fill-current" />
                <h3 className="text-base font-bold text-slate-900">Live Skill Runner: {testSkill.name}</h3>
              </div>
              <button onClick={() => setTestSkill(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 text-xs flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">JSON Input Payload:</label>
                <textarea
                  rows={6}
                  value={testInputJson}
                  onChange={(e) => setTestInputJson(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-purple-200 rounded-xl focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {testError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                  {testError}
                </div>
              )}

              {testResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Execution Result:</span>
                    </span>
                    <span className="font-mono text-slate-500">
                      Latency: {testResult.latencyMs}ms | Tokens: {testResult.tokensUsed}
                    </span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl max-h-48 overflow-y-auto font-mono text-[11px]">
                    {JSON.stringify(testResult.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setTestSkill(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunTest}
                disabled={isRunningTest}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg shadow-md flex items-center space-x-1.5 transition"
              >
                {isRunningTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isRunningTest ? 'Executing...' : 'Run Skill'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
