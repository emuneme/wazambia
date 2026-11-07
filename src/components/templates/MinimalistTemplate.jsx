import React from 'react';

export const MinimalistTemplate = ({
  invoice,
  companySettings,
  totals,
  currency,
  amountInWords,
  currentDoc,
  activeAccountNumber,
  accountTypeLabel,
  formatDate,
  formatCurrency,
  statusPills,
  currentStatus,
}) => {
  return (
    <div className="print-container a4-preview-sheet relative bg-white text-slate-900 text-xs leading-relaxed p-6 sm:p-8 md:p-10 transition-all">
      {/* Top Header: Ultra-clean & Aligned Margins */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-4 border-b-2 border-slate-900">
        <div className="space-y-1.5">
          <img
            src={companySettings?.logoUrl || '/logo.png'}
            alt="Wycliffe Zambia"
            className="h-14 w-auto object-contain mb-1"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            <p className="font-bold text-slate-800 text-xs">{companySettings?.companyName || 'Wycliffe Zambia'}</p>
            <p>{companySettings?.address || 'Plot 4821, Great East Road'}</p>
            <p>{companySettings?.city || 'Lusaka, Zambia'}</p>
            <p className="pt-0.5">TPIN: <span className="font-mono font-semibold text-slate-700">{companySettings?.tpin}</span></p>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1 pt-1">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase block leading-none">
            {currentDoc.title}
          </span>
          <span className="text-xs font-mono font-bold text-brand-orange block tracking-wider mt-1">
            #{invoice.invoiceNumber || 'WZ-2026-001'}
          </span>
          <div className="text-[11px] text-slate-500 pt-1.5 space-y-0.5">
            <p>Issue Date: <span className="font-semibold text-slate-800">{formatDate(invoice.date)}</span></p>
            <p>Due Date: <span className="font-semibold text-slate-800">{formatDate(invoice.dueDate)}</span></p>
          </div>
        </div>
      </div>

      {/* Recipient Details (Modern Minimalist Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Invoiced To
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
            {invoice.customer?.name || 'General Client'}
          </h3>
          {invoice.customer?.tpin && (
            <p className="text-[11px] font-mono text-brand-orange font-semibold mt-0.5">
              TPIN: {invoice.customer.tpin}
            </p>
          )}
          {invoice.customer?.address && (
            <p className="text-xs text-slate-600 mt-0.5">{invoice.customer.address}</p>
          )}
          {invoice.customer?.email && (
            <p className="text-xs text-slate-500 mt-0.5">{invoice.customer.email}</p>
          )}
        </div>

        <div className="sm:text-right space-y-1 text-xs text-slate-600">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Payment Summary
          </span>
          <div className="flex sm:justify-end gap-3">
            <span className="text-slate-400">Currency:</span>
            <span className="font-bold font-mono text-slate-900">{currency}</span>
          </div>
          <div className="flex sm:justify-end gap-3">
            <span className="text-slate-400">Terms:</span>
            <span className="font-medium text-slate-800">Net 30 Days</span>
          </div>
          <div className="flex sm:justify-end gap-3">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold uppercase tracking-wider text-[10px] text-brand-orange">
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Hairline Table */}
      <div className="mb-4 page-break-avoid">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <th className="py-2.5 px-2 w-10 text-center">#</th>
              <th className="py-2.5 px-2">Item Description</th>
              <th className="py-2.5 px-2 text-center w-16">Qty</th>
              <th className="py-2.5 px-2 text-right w-32">Rate ({currency})</th>
              <th className="py-2.5 px-2 text-right w-36">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {(invoice.items || []).map((item, index) => {
              const qty = Number(item.quantity) || 0;
              const price = Number(item.unitPrice) || 0;
              const lineTotal = qty * price;
              return (
                <tr key={item.id || index} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-2 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                  <td className="py-2.5 px-2 font-medium text-slate-900">
                    {item.description || 'Service without description'}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-medium">{qty}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                    {formatCurrency(price, currency)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(lineTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Amount in Words */}
      <div className="border-l-2 border-brand-orange pl-3 py-1 my-3 page-break-avoid">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
          Amount in Words
        </span>
        <p className="text-xs font-semibold text-slate-800 italic">
          {amountInWords}
        </p>
      </div>

      {/* Totals & Remittance */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-3 border-t border-slate-200 page-break-avoid">
        {/* Left: Bank Remittance */}
        <div className="sm:col-span-7 space-y-1.5 text-[10px] text-slate-600">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Wire Remittance / Bank Details ({currency})
          </span>
          <div className="space-y-0.5">
            <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-800">{companySettings?.bankName || 'Stanbic Bank Zambia'}</strong></p>
            <p><span className="text-slate-400">Account:</span> <strong className="font-mono text-slate-900 text-xs">{activeAccountNumber}</strong></p>
            <p><span className="text-slate-400">Branch:</span> <span className="font-mono">{companySettings?.branchName || 'Lusaka Main'} ({companySettings?.branchCode || '040012'})</span></p>
            {companySettings?.swiftCode && (
              <p><span className="text-slate-400">SWIFT:</span> <span className="font-mono font-bold text-slate-800">{companySettings?.swiftCode}</span></p>
            )}
          </div>
          {invoice.notes && (
            <p className="pt-1.5 text-slate-500 italic text-[9px]">{invoice.notes}</p>
          )}
        </div>

        {/* Right: Modern Totals Block */}
        <div className="sm:col-span-5 space-y-1.5">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal:</span>
              <span className="font-mono font-semibold text-slate-800">{formatCurrency(totals.subtotal, currency)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono font-semibold">-{formatCurrency(totals.discountAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">VAT ({totals.vatRate}%):</span>
              <span className="font-mono font-semibold text-slate-800">{formatCurrency(totals.vatAmount, currency)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1.5 border-t-2 border-slate-900">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Total:</span>
              <span className="text-lg font-black font-mono text-slate-900">
                {formatCurrency(totals.grandTotal, currency)}
              </span>
            </div>
          </div>

          <div className="pt-4 text-center">
            <div className="border-b border-slate-300 w-36 mx-auto mb-1"></div>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400">
        <p>Wycliffe Zambia • P.O. Box 31234, Lusaka, Zambia</p>
        <p className="italic">"Serving church and community through language development"</p>
      </div>
    </div>
  );
};
