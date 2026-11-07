import React from 'react';

export const FormalTemplate = ({
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
    <div className="print-container a4-preview-sheet relative bg-white text-slate-900 text-xs leading-relaxed p-6 sm:p-8 transition-all border-2 border-slate-900 m-2">
      {/* Formal Centered Header (Clean Aligned Margins) */}
      <div className="text-center pt-1 pb-3 border-b-2 border-slate-900 space-y-1">
        <div className="flex justify-center mb-1">
          <img
            src={companySettings?.logoUrl || '/logo.png'}
            alt="Wycliffe Zambia"
            className="h-14 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-base font-black uppercase tracking-wider text-slate-900">
          {companySettings?.companyName || 'Wycliffe Zambia'}
        </h1>
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          {companySettings?.tagline || 'Bible Translation & Literacy Ministry'}
        </p>
        <p className="text-[10px] text-slate-500">
          {companySettings?.address || 'Plot 4821, Great East Road, P.O. Box 31234, Lusaka, Zambia'} • Tel: {companySettings?.phone} • Email: {companySettings?.email}
        </p>
        <div className="flex justify-center gap-4 text-[10px] font-mono font-bold text-slate-700 pt-0.5">
          <span>REG NO: {companySettings?.registrationNo || 'RN-84920/2012'}</span>
          <span>•</span>
          <span>TPIN: {companySettings?.tpin || '1001928374'}</span>
        </div>
      </div>

      {/* Document Title Banner */}
      <div className="bg-slate-100 border-b border-slate-900 py-1 px-3 flex justify-between items-center text-xs">
        <span className="font-black uppercase tracking-widest text-slate-900">
          {currentDoc.title}
        </span>
        <span className="font-mono font-bold text-sm text-brand-orange">
          NO: {invoice.invoiceNumber || 'WZ-2026-001'}
        </span>
      </div>

      {/* Formal Dual Information Box */}
      <div className="grid grid-cols-2 border-b border-slate-900 text-[11px]">
        {/* Bill To Box */}
        <div className="p-3 border-r border-slate-900 space-y-1 bg-slate-50/50">
          <span className="font-bold uppercase text-[9px] text-slate-500 block tracking-wider">
            Consignee / Billed To:
          </span>
          <p className="font-extrabold text-xs text-slate-900">{invoice.customer?.name || 'General Client'}</p>
          {invoice.customer?.tpin && (
            <p className="font-mono font-bold text-[10px] text-slate-800">CUSTOMER TPIN: {invoice.customer.tpin}</p>
          )}
          {invoice.customer?.address && <p className="text-slate-600">{invoice.customer.address}</p>}
          {invoice.customer?.phone && <p className="text-slate-500">Tel: {invoice.customer.phone}</p>}
        </div>

        {/* Invoice Particulars Box */}
        <div className="p-3 space-y-1 bg-slate-50/50">
          <span className="font-bold uppercase text-[9px] text-slate-500 block tracking-wider">
            Document Particulars:
          </span>
          <div className="grid grid-cols-2 gap-y-0.5 text-slate-700 text-[10px]">
            <span>Date of Issue:</span>
            <span className="font-bold font-mono text-right">{formatDate(invoice.date)}</span>
            <span>Payment Due Date:</span>
            <span className="font-bold font-mono text-right">{formatDate(invoice.dueDate)}</span>
            <span>Billing Currency:</span>
            <span className="font-bold font-mono text-right">{currency}</span>
            <span>Payment Status:</span>
            <span className="font-bold uppercase text-right text-brand-orange">{currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Formal Grid Table with Cell Borders */}
      <div className="page-break-avoid">
        <table className="w-full text-left border-collapse border-b border-slate-900 text-xs">
          <thead>
            <tr className="bg-slate-200 border-b border-slate-900 text-[10px] font-black uppercase text-slate-800 tracking-wider">
              <th className="py-2 px-2 border-r border-slate-900 w-10 text-center">ITEM</th>
              <th className="py-2 px-3 border-r border-slate-900">DESCRIPTION OF GOODS & SERVICES</th>
              <th className="py-2 px-2 border-r border-slate-900 text-center w-14">QTY</th>
              <th className="py-2 px-3 border-r border-slate-900 text-right w-28">RATE ({currency})</th>
              <th className="py-2 px-3 text-right w-32">TOTAL ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 text-[11px]">
            {(invoice.items || []).map((item, index) => {
              const qty = Number(item.quantity) || 0;
              const price = Number(item.unitPrice) || 0;
              const lineTotal = qty * price;
              return (
                <tr key={item.id || index} className="hover:bg-slate-50">
                  <td className="py-2 px-2 border-r border-slate-900 text-center font-mono text-slate-500">{index + 1}</td>
                  <td className="py-2 px-3 border-r border-slate-900 font-semibold text-slate-900">
                    {item.description || 'Service item'}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-900 text-center font-medium">{qty}</td>
                  <td className="py-2 px-3 border-r border-slate-900 text-right font-mono">
                    {formatCurrency(price, currency)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {formatCurrency(lineTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Formal Amount in Words Banner */}
      <div className="bg-slate-100 p-2 border-b border-slate-900 text-[10px] flex items-center gap-2 page-break-avoid">
        <span className="font-bold uppercase tracking-wider text-slate-700">Total in Words:</span>
        <span className="font-semibold italic text-slate-900">"{amountInWords}"</span>
      </div>

      {/* Formal Settlement & Remittance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-slate-900 text-xs page-break-avoid">
        {/* Left: Bank Remittance Details */}
        <div className="sm:col-span-7 p-3 border-r border-slate-900 space-y-1 text-[10px] bg-slate-50/30">
          <span className="font-black uppercase tracking-wider text-slate-800 block mb-1">
            Official Remittance Particulars ({accountTypeLabel}):
          </span>
          <div className="grid grid-cols-2 gap-y-0.5 text-slate-700">
            <span>Bank:</span>
            <span className="font-bold">{companySettings?.bankName || 'Stanbic Bank Zambia Ltd'}</span>
            <span>Account Name:</span>
            <span className="font-semibold">{companySettings?.accountName || 'Wycliffe Zambia Ministry'}</span>
            <span>Account Number:</span>
            <span className="font-mono font-black text-slate-900 text-[11px]">{activeAccountNumber}</span>
            <span>Branch Code:</span>
            <span className="font-mono">{companySettings?.branchCode || '040012'}</span>
            <span>SWIFT Code:</span>
            <span className="font-mono font-bold">{companySettings?.swiftCode || 'SBICZMLX'}</span>
          </div>
          {invoice.notes && (
            <p className="pt-1.5 text-slate-500 italic text-[9px] border-t border-slate-200 mt-1">
              Note: {invoice.notes}
            </p>
          )}
        </div>

        {/* Right: Totals Calculation Table */}
        <div className="sm:col-span-5 p-3 space-y-1 bg-slate-50/80">
          <div className="flex justify-between text-[11px] text-slate-700">
            <span>Gross Subtotal:</span>
            <span className="font-mono font-semibold">{formatCurrency(totals.subtotal, currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-[11px] text-emerald-700">
              <span>Less Discount:</span>
              <span className="font-mono font-semibold">-{formatCurrency(totals.discountAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-[11px] text-slate-700 pt-1 border-t border-slate-300">
            <span>VAT ({totals.vatRate}%):</span>
            <span className="font-mono font-semibold">{formatCurrency(totals.vatAmount, currency)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-1.5 border-t-2 border-slate-900">
            <span className="font-black uppercase text-xs">Total Amount Due:</span>
            <span className="text-base font-black font-mono text-slate-900">
              {formatCurrency(totals.grandTotal, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Official Signatures & Certifications */}
      <div className="grid grid-cols-2 p-3 gap-6 text-center text-[10px] page-break-avoid">
        <div>
          <div className="border-b border-slate-400 w-44 mx-auto mb-1 h-7"></div>
          <p className="font-bold uppercase tracking-wider text-slate-800">Prepared & Verified By</p>
          <p className="text-[9px] text-slate-500">Finance & Accounts Department</p>
        </div>
        <div>
          <div className="border-b border-slate-400 w-44 mx-auto mb-1 h-7"></div>
          <p className="font-bold uppercase tracking-wider text-slate-800">Approved Authority & Seal</p>
          <p className="text-[9px] text-slate-500">Wycliffe Zambia Executive Office</p>
        </div>
      </div>

      {/* Formal Bottom Notice */}
      <div className="bg-slate-100 py-1 px-3 text-center text-[9px] text-slate-600 border-t border-slate-900 font-medium">
        This document is an official accounting instrument of Wycliffe Zambia. Any alterations render it invalid.
      </div>
    </div>
  );
};
