'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Mail,
  User,
  Key,
  Copy,
  Clock,
  X,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);

  // Invite state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EDITOR');
  const [inviting, setInviting] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{ email: string; role: string; url: string } | null>(null);

  // In-app modal confirmations (no browser-native confirm/alert!)
  const [memberToDeactivate, setMemberToDeactivate] = useState<any | null>(null);
  const [memberToChangeRole, setMemberToChangeRole] = useState<{ user: any; newRole: string } | null>(null);

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [teamRes, invRes] = await Promise.all([
        apiRequest('/team'),
        apiRequest('/team/invitations').catch(() => ({ invitations: [] }))
      ]);
      setTeam(teamRes.team || []);
      setInvitations(invRes.invitations || []);
    } catch (err: any) {
      console.error('Failed to load team:', err);
      setNotice({ type: 'error', text: err.message || 'Failed to load team data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setNotice(null);

    try {
      const res = await apiRequest('/team/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role })
      });

      const fullUrl = `${window.location.origin}${res.invitation.invitationUrl}`;
      setGeneratedInvite({
        email: res.invitation.email,
        role: res.invitation.role,
        url: fullUrl
      });

      setEmail('');
      fetchTeamData();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Invitation generation failed' });
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      await apiRequest(`/team/invitations/${invitationId}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: 'Invitation has been revoked.' });
      fetchTeamData();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to revoke invitation' });
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!memberToChangeRole) return;
    try {
      await apiRequest(`/team/${memberToChangeRole.user.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ newRole: memberToChangeRole.newRole })
      });
      setNotice({
        type: 'success',
        text: `Role updated to ${memberToChangeRole.newRole} for ${memberToChangeRole.user.name}.`
      });
      setMemberToChangeRole(null);
      fetchTeamData();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to update role' });
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!memberToDeactivate) return;
    try {
      await apiRequest(`/team/${memberToDeactivate.id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: `Access revoked for ${memberToDeactivate.name}.` });
      setMemberToDeactivate(null);
      fetchTeamData();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to deactivate member' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>Team Members & Role-Based Access (RBAC)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure single-use invitations, granular server-enforced role permissions, and full audit trail logging.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRoleMatrix(!showRoleMatrix)}
              className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>{showRoleMatrix ? 'Hide Role Matrix' : 'View Role Matrix'}</span>
            </button>

            <button
              onClick={() => {
                setGeneratedInvite(null);
                setShowInviteModal(true);
              }}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Collapsible Permission Matrix Table */}
        {showRoleMatrix && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Server-Side Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5 text-center">Owner</th>
                    <th className="p-2.5 text-center">Admin</th>
                    <th className="p-2.5 text-center">Editor</th>
                    <th className="p-2.5 text-center">Approver</th>
                    <th className="p-2.5 text-center">Analyst</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr><td className="p-2.5 font-semibold">View Analytics</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td></tr>
                  <tr><td className="p-2.5 font-semibold">Create Content</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Edit Content</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Schedule Posts</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Approve Content</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Publish Immediately</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Manage Team</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Connect Accounts</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td></tr>
                  <tr><td className="p-2.5 font-semibold">Export CSV Data</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-slate-300">-</td><td className="p-2.5 text-center text-emerald-600 font-bold">✓</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Active Team Members Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Organization Members</h3>
            <span className="text-xs text-slate-500 font-medium">{team.length} member(s)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {team.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={member.role}
                        disabled={member.role === 'OWNER'}
                        onChange={(e) => setMemberToChangeRole({ user: member, newRole: e.target.value })}
                        className="text-xs font-bold rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="OWNER" disabled>OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="APPROVER">APPROVER</option>
                        <option value="ANALYST">ANALYST</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {member.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {member.role !== 'OWNER' && (
                        <button
                          onClick={() => setMemberToDeactivate(member)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md hover:bg-rose-50"
                        >
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invitations Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pending Single-Use Invitations</h3>
              <p className="text-xs text-slate-500">Cryptographically hashed invitation links awaiting acceptance.</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">{invitations.length} pending</span>
          </div>

          {invitations.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No pending invitations for this organization.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invited Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Expires</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitations.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                          {inv.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{new Date(inv.expiresAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold hover:bg-rose-50 px-2.5 py-1 rounded-md"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Generate Secure Team Invitation</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {generatedInvite ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                    <p className="font-bold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Invitation Link Created
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      A single-use cryptographically secure invitation token has been created for <b>{generatedInvite.email}</b> ({generatedInvite.role}).
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Shareable Invitation Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedInvite.url}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-600 select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedInvite.url);
                          setNotice({ type: 'success', text: 'Invitation link copied to clipboard!' });
                        }}
                        className="px-3 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-1 shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateInvite} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="teammate@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organization Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-bold"
                    >
                      <option value="ADMIN">ADMIN - Full team and social connection rights</option>
                      <option value="EDITOR">EDITOR - Content creation and post scheduling</option>
                      <option value="APPROVER">APPROVER - Review and publishing approval rights</option>
                      <option value="ANALYST">ANALYST - Reporting and CSV data export only</option>
                    </select>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviting || !email}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                    >
                      {inviting ? 'Generating...' : 'Generate Single-Use Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* In-App Role Change Confirmation Modal */}
        {memberToChangeRole && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Confirm Role Change</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to change the role for <b>{memberToChangeRole.user.name}</b> from <b>{memberToChangeRole.user.role}</b> to <b>{memberToChangeRole.newRole}</b>?
              </p>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setMemberToChangeRole(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-App Deactivate Confirmation Modal */}
        {memberToDeactivate && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-rose-700 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Revoke Access</span>
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to revoke organization access for <b>{memberToDeactivate.name}</b> ({memberToDeactivate.email})?
              </p>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setMemberToDeactivate(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeactivate}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirm Revoke
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
