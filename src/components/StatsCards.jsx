import React from 'react';
import { DollarSign, Clock, CheckCircle2, FileSpreadsheet, Coins } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const StatsCards = ({ invoices = [] }) => {
  const getInvoiceTotal = (inv) => {
    const itemsSum = (inv.items || []).reduce(
      (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0
    );
    const vat = inv.vatRate ? (itemsSum * inv.vatRate) / 100 : 0;
    return itemsSum + vat - (Number(inv.discount) || 0);
  };

  // Group by currency
  const zmwInvoices = invoices.filter((inv) => (inv.currency || 'ZMW') === 'ZMW');
  const usdInvoices = invoices.filter((inv) => inv.currency === 'USD');

  const zmwTotal = zmwInvoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((sum, inv) => sum + getInvoiceTotal(inv), 0);

  const usdTotal = usdInvoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((sum, inv) => sum + getInvoiceTotal(inv), 0);

  const zmwPaid = zmwInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + getInvoiceTotal(inv), 0);

  const usdPaid = usdInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + getInvoiceTotal(inv), 0);

  const pendingCount = invoices.filter((inv) => inv.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Kwacha */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span>🇿🇲 Kwacha Volume</span>
          </p>
          <p className="text-base font-extrabold text-brand-charcoal mt-1">
            {formatCurrency(zmwTotal, 'ZMW')}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            Paid: {formatCurrency(zmwPaid, 'ZMW')}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-orange-light flex items-center justify-center text-brand-orange">
          <Coins className="w-5 h-5" />
        </div>
      </div>

      {/* Total US Dollars */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span>🇺🇸 US Dollar Volume</span>
          </p>
          <p className="text-base font-extrabold text-emerald-800 mt-1">
            {formatCurrency(usdTotal, 'USD')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            Paid: {formatCurrency(usdPaid, 'USD')}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Invoices
          </p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">
            {pendingCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              {pendingCount === 1 ? 'pending' : 'pending'}
            </span>
          </p>
          <p className="text-[11px] text-slate-400">Awaiting payment</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Total Documents */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Invoices
          </p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{invoices.length} docs</p>
          <p className="text-[11px] text-slate-400">Recorded in system</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
