import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  Ticket,
  Sliders,
  FileText,
  Clock,
  RotateCcw,
  Search,
  Lock,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { AdminLog } from '../../types/pulse';

export const PulseAdmin: React.FC = () => {
  const {
    adminLogs,
    resolveAdminReport,
    platformCommissionPct,
    setPlatformCommissionPct,
    formatPrice,
    user,
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'moderation' | 'escrow' | 'commission'>('overview');
  const [commissionInput, setCommissionInput] = useState<number>(platformCommissionPct);

  // Moderation queue state
  const [moderationReports, setModerationReports] = useState([
    {
      id: 'rep_1',
      type: 'Copyright / Audio Notice',
      target: 'Live Stream #3 (Coast Melodies)',
      reportedBy: 'MCSK Digital Auditing Bot',
      reason: 'Automated fingerprint matched background commercial audio snippet',
      severity: 'Low',
      status: 'pending',
    },
    {
      id: 'rep_2',
      type: 'Fraud / Scalper Alert',
      target: 'Bulk purchase (12x VIP Passes at Blankets & Wine)',
      reportedBy: 'KenyaOne Escrow Anti-Fraud Engine',
      reason: 'Multiple rapid card attempts from unusual IP block; escrow held',
      severity: 'High',
      status: 'pending',
    },
    {
      id: 'rep_3',
      type: 'Age Verification Dispute',
      target: 'Patron Age Check at Milan Westlands',
      reportedBy: 'Venue Gate Security Team',
      reason: 'National ID physical verification required for physical wristband',
      severity: 'Medium',
      status: 'pending',
    },
  ]);

  const [pendingVenues, setPendingVenues] = useState([
    { id: 'v_app_1', name: 'Cavalli Lounge Kilimani', neighborhood: 'Wood Avenue, Kilimani', licenseNumber: 'KEN-NBI-BAR-99412', status: 'pending' },
    { id: 'v_app_2', name: 'Tamasha Sports & Lounge Eldoret', neighborhood: 'Uganda Rd, Eldoret', licenseNumber: 'KEN-ELD-LIQ-33104', status: 'pending' },
  ]);

  const handleResolveMod = (id: string, action: 'cleared' | 'flagged') => {
    setModerationReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    resolveAdminReport(id, action);
    alert(`Report ${id} marked as ${action.toUpperCase()}! Logged to KenyaOne National Audit Trail.`);
  };

  const handleApproveVenue = (id: string, name: string) => {
    setPendingVenues((prev) => prev.filter((v) => v.id !== id));
    alert(`Venue "${name}" verified! Digital storefront, table QR codes, and Escrow merchant account activated.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Command Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">KENYAONE PULSE CENTRAL ADMINISTRATION</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold">
                NATIONAL ROOT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Escrow transaction monitoring, fraud detection, venue accreditation, and content moderation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-bold">
          {[
            { key: 'overview', label: 'Dashboard' },
            { key: 'verifications', label: 'Venue Approvals' },
            { key: 'moderation', label: 'Moderation Queue' },
            { key: 'escrow', label: 'Escrow & Tickets' },
            { key: 'commission', label: 'Fee Configuration' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === t.key ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold block">Total Pulse GMV (30D)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {formatPrice(48950000)}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-1">↑ 24% month-over-month</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold block">Platform Commission</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                {formatPrice(4160750)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Active Rate: {platformCommissionPct}%</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold block">Tickets Issued</span>
              <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">18,420</span>
              <span className="text-[11px] text-slate-400 block mt-1">0 fraudulent tickets reported</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold block">Verified Venues & DJs</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">142</span>
              <span className="text-[11px] text-slate-400 block mt-1">Across 18 Counties</span>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span>National Pulse Security Audit Logs</span>
              </h3>
              <span className="text-xs text-slate-400">Immutable ledger records</span>
            </div>

            <div className="space-y-2 text-xs">
              {adminLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-white block">{log.action}</span>
                    <span className="text-[11px] text-slate-400">
                      Target: <strong className="text-slate-300">{log.target}</strong> • Operator: {log.performedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        log.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.status === 'resolved'
                          ? 'bg-purple-950 text-purple-400 border border-purple-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VENUE APPROVALS */}
      {activeTab === 'verifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Pending Venue Licensing Approvals</h3>
              <p className="text-xs text-slate-400">
                Verify physical liquor licenses and county public entertainment permits before activating table QR codes.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400">{pendingVenues.length} Pending Review</span>
          </div>

          {pendingVenues.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              All venue verification requests are up to date!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingVenues.map((v) => (
                <div
                  key={v.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{v.name}</h4>
                    <span className="text-slate-400 block mt-0.5">{v.neighborhood}</span>
                    <span className="font-mono text-emerald-400 text-[11px] block mt-1">
                      License ID: {v.licenseNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveVenue(v.id, v.name)}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      onClick={() => {
                        setPendingVenues((prev) => prev.filter((item) => item.id !== v.id));
                        alert('Venue application rejected due to missing county health permit.');
                      }}
                      className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: MODERATION & FRAUD QUEUE */}
      {activeTab === 'moderation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Live Content & Transaction Moderation</h3>
              <p className="text-xs text-slate-400">
                Review flagged livestream audio, copyright reports, and scalper fraud triggers.
              </p>
            </div>
            <span className="text-xs text-red-400 font-bold">{moderationReports.length} Reports</span>
          </div>

          <div className="space-y-3">
            {moderationReports.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">{r.type}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        r.severity === 'High' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {r.severity} Severity
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">Source: {r.reportedBy}</span>
                </div>

                <p className="text-slate-300">
                  Target: <strong className="text-white">{r.target}</strong>
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">{r.reason}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleResolveMod(r.id, 'cleared')}
                    className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Clear Notice
                  </button>
                  <button
                    onClick={() => handleResolveMod(r.id, 'flagged')}
                    className="py-1 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                  >
                    Enforce Takedown / Escrow Freeze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: ESCROW MONITORING */}
      {activeTab === 'escrow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">KenyaOne Pulse Escrow Vault</h3>
              <p className="text-xs text-slate-400">
                Ticket funds and artist deposits held in escrow until performance validation.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Escrow Liquidity: {formatPrice(12400000)}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Blankets & Wine All-Star Edition</span>
                <span className="text-slate-400 text-[11px]">4,350 tickets sold • Escrow Balance: {formatPrice(19575000)}</span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">DISBURSES POST-EVENT (NOV 29)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Diani Beach Ocean Sunburst Festival</span>
                <span className="text-slate-400 text-[11px]">1,312 tickets sold • Escrow Balance: {formatPrice(4820000)}</span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">DISBURSES POST-EVENT (JAN 01)</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: COMMISSION CONFIGURATION */}
      {activeTab === 'commission' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">Platform Commission Structure</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configures the platform deduction on ticket sales, tips, and venue digital orders.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Standard Platform Fee (%):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="25"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
                <span className="text-slate-300 font-bold text-sm">%</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>Creator / Organizer Share:</span>
                <span className="font-bold text-emerald-400">{(100 - commissionInput).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>KenyaOne Infrastructure & Escrow:</span>
                <span className="font-bold text-white">{commissionInput.toFixed(1)}%</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPlatformCommissionPct(commissionInput);
                alert(`Platform commission updated to ${commissionInput}% across all Pulse modules.`);
              }}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/30"
            >
              Save Fee Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
