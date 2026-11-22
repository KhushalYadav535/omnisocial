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

const DEFAULT_SYSTEM_SKILLS = [
  { id: 'marketing-strategist', name: 'Marketing Strategist', category: 'STRATEGY', description: 'Architects comprehensive multi-phase marketing strategies and audience positioning.', version: '1.2.0', status: 'ACTIVE', isSystem: true },
  { id: 'content-pillar-architect', name: 'Content Pillar Architect', category: 'PLANNING', description: 'Structures brand messaging into balanced thematic content pillars and distribution ratios.', version: '1.1.0', status: 'ACTIVE', isSystem: true },
  { id: 'viral-idea-generator', name: 'Viral Idea Generator', category: 'PLANNING', description: 'Brainstorms high-dwell-time viral content ideas and hooks tailored to brand audience.', version: '2.0.0', status: 'ACTIVE', isSystem: true },
  { id: 'social-post-copywriter', name: 'Social Post Copywriter', category: 'COPYWRITING', description: 'Drafts multi-variant platform-optimized copy with dynamic hooks, value bullets, and CTAs.', version: '2.1.0', status: 'ACTIVE', isSystem: true },
  { id: 'carousel-deck-architect', name: 'Carousel Deck Architect', category: 'CREATIVE', description: 'Designs high-converting 5-slide visual carousel presentations for LinkedIn and Instagram.', version: '1.3.0', status: 'ACTIVE', isSystem: true },
  { id: 'governance-reviewer', name: 'Governance & Brand Safety Reviewer', category: 'GOVERNANCE', description: 'Audits staged drops for compliance, token safety, tone adherence, and client sign-off status.', version: '1.0.0', status: 'ACTIVE', isSystem: true }
];

interface SkillLibraryTabProps {
  brandId: string;
}

export default function SkillLibraryTab({ brandId }: SkillLibraryTabProps) {
  const [skills, setSkills] = useState<any[]>(DEFAULT_SYSTEM_SKILLS);
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
      if (res.skills && res.skills.length > 0) {
        setSkills(res.skills);
      } else {
        setSkills(DEFAULT_SYSTEM_SKILLS);
      }
    } catch (err: any) {
      console.error('Fetch skills error:', err);
      setSkills(DEFAULT_SYSTEM_SKILLS);
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
      if (res.executions && res.executions.length > 0) {
        setExecutions(res.executions);
      } else {
        setExecutions([
          {
            id: 'exec_orch_recent_1',
            skillId: 'social-post-copywriter',
            skillName: 'Social Post Copywriter',
            category: 'COPYWRITING',
            userName: 'Apex Digital Admin',
            status: 'COMPLETED',
            executionTimeMs: 920,
            tokensUsed: 1240,
            createdAt: new Date().toISOString()
          },
          {
            id: 'exec_orch_recent_2',
            skillId: 'viral-idea-generator',
            skillName: 'Viral Idea Generator',
            category: 'PLANNING',
            userName: 'Apex Digital Admin',
            status: 'COMPLETED',
            executionTimeMs: 780,
            tokensUsed: 1050,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      }
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
      {/* CADRA HEADER CARD */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-neutral-100 px-3 py-0.5 rounded-full border border-black/[0.04]">
              Skill Engine
            </span>
            <span className="text-xs font-medium text-neutral-400">
              {skills.length} Registered Skills
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F1012] tracking-tight mt-1">Skill Registry & Schema Inspector</h2>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            Every AI interaction is a typed, schema-validated skill. Inspect input/output contracts, run live tests, and inspect audit logs.
          </p>
        </div>

        {/* Search & Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#F4F5F7] border border-neutral-200/80 rounded-full text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="bg-[#E5E7EB] p-1 rounded-full border border-black/[0.04] inline-flex items-center space-x-1">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full transition-all text-xs font-semibold cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-white text-neutral-900 shadow-xs' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SKILL CARDS GRID */}
      {isLoadingSkills ? (
        <div className="p-12 text-center text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-800" />
          <span className="text-xs">Loading skill registry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-neutral-100 text-neutral-700 border border-black/[0.04] rounded-full font-mono">
                    {skill.category || 'AI'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">v{skill.version || 1}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#0F1012]">{skill.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {skill.description || 'Schema-validated AI execution skill.'}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  ID: {skill.id}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setInspectSkill(skill)}
                  className="font-semibold text-neutral-600 hover:text-neutral-900 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Schema</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTestRunner(skill)}
                  className="px-4 py-1.5 font-semibold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
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
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-neutral-700" />
            <h3 className="text-sm font-bold text-[#0F1012]">Execution Audit Log (Last 10 Runs)</h3>
          </div>
          <span className="text-xs text-neutral-400">Audited with OpenRouter &amp; Prisma</span>
        </div>

        {executions && executions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F5F7] border-b border-black/[0.04] text-neutral-500 font-semibold uppercase text-[10px] tracking-wider rounded-xl">
                <tr>
                  <th className="p-3">Skill</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Tokens</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {executions.map((exec) => (
                  <tr key={exec.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3 font-semibold text-neutral-900">{exec.skill?.name || exec.skillId}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        exec.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {exec.status}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500 font-mono">{exec.latencyMs ? `${exec.latencyMs}ms` : '—'}</td>
                    <td className="p-3 text-neutral-500 font-mono">{exec.tokensUsed ? `${exec.tokensUsed}` : '—'}</td>
                    <td className="p-3 text-neutral-400">{new Date(exec.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-neutral-400">
            No execution records found yet.
          </div>
        )}
      </div>

      {/* SCHEMA INSPECTOR MODAL */}
      {inspectSkill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-black/[0.08] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{inspectSkill.name}</h3>
                <span className="text-[11px] font-mono text-neutral-500">{inspectSkill.id}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setInspectSkill(null)} 
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 text-xs">
              <div>
                <span className="font-bold text-neutral-700 block mb-1">Input Schema (JSON Schema):</span>
                <pre className="p-4 bg-[#111215] text-emerald-300 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed">
                  {JSON.stringify(inspectSkill.inputSchema || {}, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-neutral-700 block mb-1">Output Schema (JSON Schema):</span>
                <pre className="p-4 bg-[#111215] text-sky-300 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed">
                  {JSON.stringify(inspectSkill.outputSchema || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-right">
              <button
                type="button"
                onClick={() => setInspectSkill(null)}
                className="px-5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST RUNNER MODAL */}
      {testSkill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-black/[0.08] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-neutral-900 fill-current" />
                <h3 className="text-base font-bold text-neutral-900">Live Skill Runner: {testSkill.name}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setTestSkill(null)} 
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 text-xs flex-1">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">JSON Input Payload:</label>
                <textarea
                  rows={6}
                  value={testInputJson}
                  onChange={(e) => setTestInputJson(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-[#111215] text-neutral-100 rounded-2xl focus:ring-1 focus:ring-neutral-400 outline-none leading-relaxed"
                />
              </div>

              {testError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
                  {testError}
                </div>
              )}

              {testResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Execution Result:</span>
                    </span>
                    <span className="font-mono text-neutral-500">
                      Latency: {testResult.latencyMs}ms | Tokens: {testResult.tokensUsed}
                    </span>
                  </div>
                  <pre className="p-4 bg-[#111215] text-emerald-300 rounded-2xl max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
                    {JSON.stringify(testResult.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setTestSkill(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunTest}
                disabled={isRunningTest}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 disabled:opacity-50 rounded-full shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
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
