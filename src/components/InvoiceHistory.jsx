import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Printer,
  Copy,
  Trash2,
  PlusCircle,
  FileText,
  Download,
  Share2,
  Calendar,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate, calculateTotals } from '../utils/formatters';
import { exportInvoicesToCSV, openWhatsAppShare } from '../utils/exportShare';

export const InvoiceHistory = ({
  invoices,
  onSelectInvoice,
  onPrintInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onNewInvoice,
  onUpdateStatus,
  companySettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Status counters
  const totalCount = invoices.length;
  const pendingCount = invoices.filter(
    (inv) => inv.status === 'Pending' || inv.status === 'Pendente'
  ).length;
  const paidCount = invoices.filter(
    (inv) => inv.status === 'Paid' || inv.status === 'Paga'
  ).length;
  const cancelledCount = invoices.filter(
    (inv) => inv.status === 'Cancelled' || inv.status === 'Cancelada'
  ).length;

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchPaid = statusFilter === 'Paid' && (inv.status === 'Paid' || inv.status === 'Paga');
    const isMatchPending = statusFilter === 'Pending' && (inv.status === 'Pending' || inv.status === 'Pendente');
    const isMatchCancelled = statusFilter === 'Cancelled' && (inv.status === 'Cancelled' || inv.status === 'Cancelada');

    const matchesStatus =
      statusFilter === 'ALL' || isMatchPaid || isMatchPending || isMatchCancelled || inv.status === statusFilter;

    // Date range filter
    let matchesDate = true;
    if (dateFrom && inv.date) {
      matchesDate = matchesDate && inv.date >= dateFrom;
    }
    if (dateTo && inv.date) {
      matchesDate = matchesDate && inv.date <= dateTo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate filtered totals
  const filteredTotalsZMW = filteredInvoices
    .filter((inv) => (inv.currency || 'ZMW') === 'ZMW' && inv.status !== 'Cancelled' && inv.status !== 'Cancelada')
    .reduce((sum, inv) => {
      const t = calculateTotals(inv.items, inv.vatRate, inv.discount, inv.isVatInclusive);
      return sum + t.grandTotal;
    }, 0);

  const filteredTotalsUSD = filteredInvoices
    .filter((inv) => inv.currency === 'USD' && inv.status !== 'Cancelled' && inv.status !== 'Cancelada')
    .reduce((sum, inv) => {
      const t = calculateTotals(inv.items, inv.vatRate, inv.discount, inv.isVatInclusive);
      return sum + t.grandTotal;
    }, 0);

  const getStatusColor = (status) => {
    if (status === 'Paid' || status === 'Paga') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (status === 'Cancelled' || status === 'Cancelada') return 'bg-rose-100 text-rose-800 border-rose-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  const normalizeStatus = (status) => {
    if (status === 'Paga') return 'Paid';
    if (status === 'Pendente') return 'Pending';
    if (status === 'Cancelada') return 'Cancelled';
    return status || 'Pending';
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs with Badge Counters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All Invoices', count: totalCount },
            { id: 'Pending', label: 'Pending Payment', count: pendingCount },
            { id: 'Paid', label: 'Paid in Full', count: paidCount },
            { id: 'Cancelled', label: 'Cancelled', count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                statusFilter === tab.id
                  ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportInvoicesToCSV(filteredInvoices)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shadow-xs"
            title="Export filtered records to CSV / Excel spreadsheet"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Search & Date Range Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice # or client name..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>

        {/* Date Range Picker */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
            />
          </div>

          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
              title="Clear date filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtered Summary Indicator */}
      {(filteredTotalsZMW > 0 || filteredTotalsUSD > 0 || searchTerm || dateFrom || dateTo) && (
        <div className="bg-slate-100/70 border border-slate-200 px-4 py-2 rounded-lg flex flex-wrap items-center justify-between text-xs text-slate-600">
          <span>
            Showing <strong>{filteredInvoices.length}</strong> matching{' '}
            {filteredInvoices.length === 1 ? 'document' : 'documents'}
          </span>
          <div className="flex items-center gap-4 font-mono font-bold text-slate-800">
            {filteredTotalsZMW > 0 && (
              <span>Kwacha: {formatCurrency(filteredTotalsZMW, 'ZMW')}</span>
            )}
            {filteredTotalsUSD > 0 && (
              <span>US Dollars: {formatCurrency(filteredTotalsUSD, 'USD')}</span>
            )}
          </div>
        </div>
      )}

      {/* Invoice Table / List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No invoices found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL' || dateFrom || dateTo
                ? 'Try adjusting your search criteria, dates, or status filter.'
                : 'Start issuing professional invoices for Wycliffe Zambia right away.'}
            </p>
          </div>
          <button
            onClick={onNewInvoice}
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create First Invoice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Client / Organization</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-center">Currency</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const totals = calculateTotals(
                    inv.items,
                    inv.vatRate,
                    inv.discount,
                    inv.isVatInclusive
                  );

                  const displayStatus = normalizeStatus(inv.status);

                  return (
                    <tr
                      key={inv.id || inv.invoiceNumber}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-orange">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {inv.customer?.name || 'General Client'}
                        {inv.customer?.tpin && (
                          <span className="block text-[10px] text-slate-400 font-mono">
                            TPIN: {inv.customer.tpin}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(inv.date)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            inv.currency === 'USD'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {inv.currency || 'ZMW'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(totals.grandTotal, inv.currency || 'ZMW')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={displayStatus}
                          onChange={(e) => onUpdateStatus(inv.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusColor(
                            displayStatus
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-brand-orange hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit / View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-brand-charcoal hover:bg-slate-100 rounded-md transition-colors"
                            title="Print / Save Official PDF"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openWhatsAppShare(inv, companySettings)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Duplicate as New Invoice"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteInvoice(inv.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
