'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Home,
  Sparkles,
  Target,
  Calendar,
  Megaphone,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  BarChart2,
  Settings,
  MessageSquare,
  Share2,
  Users,
  PenTool,
  Zap,
  ArrowRight,
  CornerDownLeft,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems = [
    // Pages / Workspaces
    { id: 'overview', name: 'Overview Dashboard', category: 'Navigation', href: '/dashboard', icon: Home },
    { id: 'studio', name: 'Studio Home', category: 'Navigation', href: '/content-studio', icon: Sparkles },
    { id: 'strategy', name: 'Marketing Strategy', category: 'Navigation', href: '/content-studio?tab=strategy', icon: Target },
    { id: 'calendar', name: 'Content Calendar', category: 'Navigation', href: '/calendar', icon: Calendar },
    { id: 'campaigns', name: 'Campaigns Hub', category: 'Navigation', href: '/content-studio?tab=campaigns', icon: Megaphone },
    { id: 'ideas', name: 'Content Library & Ideas', category: 'Navigation', href: '/content-studio?tab=ideas', icon: Layers },
    { id: 'media', name: 'Media Library', category: 'Navigation', href: '/content-studio?tab=media', icon: ImageIcon },
    { id: 'approvals', name: 'Approvals Queue', category: 'Navigation', href: '/content-studio?tab=approvals', icon: CheckCircle2 },
    { id: 'performance', name: 'Analytics & Telemetry', category: 'Navigation', href: '/analytics', icon: BarChart2 },
    { id: 'inbox', name: 'Inbox & Community Engage', category: 'Navigation', href: '/inbox?type=COMMENT', icon: MessageSquare },
    { id: 'accounts', name: 'Connected Channels', category: 'Navigation', href: '/accounts', icon: Share2 },
    { id: 'funnels', name: 'Lead Funnels & Inbound Capture', category: 'Navigation', href: '/funnels', icon: Layers },
    { id: 'team', name: 'Team & Collaborators', category: 'Navigation', href: '/team', icon: Users },
    { id: 'settings', name: 'Organization Settings', category: 'Navigation', href: '/settings', icon: Settings },

    // Quick Actions
    { id: 'draft-post', name: 'Draft New Social Post', category: 'Quick Action', href: '/content-studio?tab=composer', icon: PenTool },
    { id: 'instant-studio', name: '⚡ 1-Click Studio & Reel Creator', category: 'Quick Action', href: '/calendar', icon: Zap },
    { id: 'ai-strategy', name: 'Synthesize Brand Strategy with AI', category: 'Quick Action', href: '/content-studio?tab=strategy', icon: Sparkles },
    { id: 'campaign-wizard', name: 'Start 7-Day Campaign Wizard', category: 'Quick Action', href: '/content-studio?tab=campaigns', icon: Megaphone },
    { id: 'upload-asset', name: 'Add Media Asset', category: 'Quick Action', href: '/content-studio?tab=media', icon: ImageIcon },
  ];

  const filteredItems = commandItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        onClose();
        router.push(selected.href);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 space-x-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, pages, or tools... (e.g. Strategy, Calendar, Post)"
            className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 shrink-0">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 max-h-[380px]">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching pages or commands found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    router.push(item.href);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white text-[#7C3AED]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#7C3AED]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-mono text-[10px]">StudioFlow v3.0</span>
        </div>
      </div>
    </div>
  );
}
