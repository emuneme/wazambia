import React from 'react';

export const ExecutiveTemplate = ({
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
    <div className="print-container a4-preview-sheet relative bg-white text-slate-800 text-xs leading-relaxed p-6 sm:p-8 md:p-10 transition-all">
      {/* 1. Header: Modern Executive Layout (Clean Aligned Margins) */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-2">
        <div className="space-y-1.5">
          <img
            src={companySettings?.logoUrl || '/logo.png'}
            alt="Wycliffe Zambia"
            className="h-14 sm:h-16 w-auto object-contain mb-1"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <p className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
            {companySettings?.tagline || 'Bible Translation & Literacy Ministry'}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-0.5">
            {companySettings?.registrationNo && (
              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">
                Reg: <strong className="text-slate-700">{companySettings.registrationNo}</strong>
              </span>
            )}
            {companySettings?.tpin && (
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                TPIN: <strong className="text-slate-900">{companySettings.tpin}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Document Identifier & Organization Contact */}
        <div className="text-left sm:text-right space-y-1 pt-0.5">
          <div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-brand-charcoal block leading-none">
              {currentDoc.title}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-1">
              {currentDoc.subtitle}
            </span>
            <span className="text-base font-mono font-bold text-brand-orange block mt-0.5">
              {invoice.invoiceNumber || 'WZ-2026-001'}
            </span>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 leading-relaxed">
            <p>{companySettings?.address || 'Plot 4821, Great East Road, P.O. Box 31234'}</p>
            <p>{companySettings?.city || 'Lusaka, Zambia'} • Tel: {companySettings?.phone}</p>
            <p className="text-brand-wine font-medium">{companySettings?.email}</p>
          </div>
        </div>
      </div>

      {/* Brand Accent Ribbon (Single Crisp Separator) */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-wine via-brand-orange to-brand-green rounded-full my-3.5"></div>

      {/* 2. Client Details & Invoice Meta Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
        {/* Bill To Card (7 cols) */}
        <div className="sm:col-span-7 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange block mb-1">
              Billed To / Client:
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
              {invoice.customer?.name || 'General Client'}
            </h3>
            {invoice.customer?.address && (
              <p className="text-[11px] text-slate-600 mt-0.5">{invoice.customer.address}</p>
            )}
            <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-500 mt-1">
              {invoice.customer?.phone && <span>Tel: {invoice.customer.phone}</span>}
              {invoice.customer?.email && <span>Email: {invoice.customer.email}</span>}
            </div>
          </div>

          {invoice.customer?.tpin && (
            <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px]">
              <span className="text-slate-600">Client TPIN: </span>
              <span className="font-mono font-bold text-slate-900">{invoice.customer.tpin}</span>
            </div>
          )}
        </div>

        {/* Invoice Meta Card (5 cols) */}
        <div className="sm:col-span-5 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500">Date of Issue:</span>
            <span className="font-semibold text-slate-800">{formatDate(invoice.date)}</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500">Payment Due:</span>
            <span className="font-semibold text-slate-800">{formatDate(invoice.dueDate)}</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500">Currency:</span>
            <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
              {currency === 'USD' ? 'USD ($)' : 'ZMW (ZK)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
            <span className="text-slate-500">Status:</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                statusPills[currentStatus] || statusPills.Pending
              }`}
            >
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Items Table (Optimized for A4 Page Fitting) */}
      <div className="overflow-hidden rounded-lg border border-slate-200 mb-4 page-break-avoid">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-brand-charcoal text-white text-[10px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Description of Goods / Services</th>
              <th className="py-2.5 px-3 text-center w-16">Qty</th>
              <th className="py-2.5 px-3 text-right w-32">Price ({currency})</th>
              <th className="py-2.5 px-3 text-right w-36">Total ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            {(invoice.items || []).map((item, index) => {
              const qty = Number(item.quantity) || 0;
              const price = Number(item.unitPrice) || 0;
              const lineTotal = qty * price;
              return (
                <tr
                  key={item.id || index}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                  }`}
                >
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">{index + 1}</td>
                  <td className="py-2 px-3">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {item.description || 'Service without description'}
                    </p>
                  </td>
                  <td className="py-2 px-3 text-center font-medium text-slate-700">{qty}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">
                    {formatCurrency(price, currency)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(lineTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Amount in Words Callout */}
      <div className="bg-amber-50/50 border border-amber-200/80 p-2.5 rounded-lg mb-4 page-break-avoid">
        <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block">
          Amount in Words:
        </span>
        <p className="text-[11px] font-semibold text-slate-900 italic mt-0.5">
          {amountInWords}
        </p>
      </div>

      {/* 5. Remittance Instructions & Financial Settlement */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4 page-break-avoid">
        {/* Left: Banking Remittance (7 cols) */}
        <div className="sm:col-span-7 space-y-2">
          <div className="bg-slate-50/90 border border-slate-200 p-3 rounded-lg text-[10px] space-y-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
              <span className="font-bold text-brand-charcoal uppercase tracking-wide">
                Bank Remittance Details:
              </span>
              <span className="font-bold px-1.5 py-0.5 rounded bg-brand-orange text-white text-[9px]">
                {accountTypeLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-1 text-slate-700">
              <span className="text-slate-500">Bank Name:</span>
              <span className="font-bold">{companySettings?.bankName || 'Stanbic Bank Zambia Ltd'}</span>

              <span className="text-slate-500">Account Name:</span>
              <span className="font-semibold">{companySettings?.accountName || 'Wycliffe Zambia Ministry'}</span>

              <span className="text-slate-500">Account No ({currency}):</span>
              <span className="font-mono font-black text-brand-charcoal text-xs">
                {activeAccountNumber}
              </span>

              <span className="text-slate-500">Branch Name & Code:</span>
              <span className="font-mono">
                {companySettings?.branchName || 'Lusaka Main'} ({companySettings?.branchCode || '040012'})
              </span>

              {companySettings?.swiftCode && (
                <>
                  <span className="text-slate-500">SWIFT / BIC:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {companySettings?.swiftCode}
                  </span>
                </>
              )}
            </div>

            <p className="text-[9px] text-slate-400 italic pt-1 border-t border-slate-200">
              * Please quote invoice #{invoice.invoiceNumber} on wire/deposit remittance.
            </p>
          </div>

          {invoice.notes && (
            <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-200 text-[10px]">
              <span className="font-bold text-slate-600 uppercase tracking-wide block mb-0.5">
                Special Notes:
              </span>
              <p className="text-slate-600 whitespace-pre-line leading-tight">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Totals Calculation (5 cols) */}
        <div className="sm:col-span-5 space-y-2">
          <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Subtotal ({currency}):</span>
              <span className="font-mono font-semibold">
                {formatCurrency(totals.subtotal, currency)}
              </span>
            </div>

            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 text-[11px]">
                <span>Discount:</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(totals.discountAmount, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-200">
              <span>VAT ({totals.vatRate}%):</span>
              <span className="font-mono font-semibold">
                {formatCurrency(totals.vatAmount, currency)}
              </span>
            </div>

            <div className="pt-1.5 border-t-2 border-slate-300 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">Total Due:</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Amount Payable ({currency})
                </span>
              </div>
              <span className="text-base font-black font-mono text-brand-orange">
                {formatCurrency(totals.grandTotal, currency)}
              </span>
            </div>
          </div>

          {/* QR Code & Signatory Box */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {/* Visual SVG QR Code */}
            <div className="shrink-0 p-1 bg-white border border-slate-200 rounded-md shadow-xs text-center">
              <svg
                className="w-11 h-11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" fill="#37322F" />
                <rect x="14" y="3" width="7" height="7" fill="#37322F" />
                <rect x="3" y="14" width="7" height="7" fill="#37322F" />
                <rect x="5" y="5" width="3" height="3" fill="#ffffff" />
                <rect x="16" y="5" width="3" height="3" fill="#ffffff" />
                <rect x="5" y="16" width="3" height="3" fill="#ffffff" />
                <path d="M14 14h3v3h-3z" fill="#37322F" />
                <path d="M18 14v4h3" />
                <path d="M14 18v3h4" />
                <path d="M18 18h3v3h-3z" fill="#E58E26" />
              </svg>
              <span className="block text-[7px] font-mono text-slate-400 mt-0.5">
                VERIFIED
              </span>
            </div>

            {/* Signature Area */}
            <div className="flex-1 text-center">
              <div className="border-t border-slate-300 w-full mb-1"></div>
              <p className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">
                Authorized Signature & Official Stamp
              </p>
              <p className="text-[8px] text-slate-400">Finance & Administration • Wycliffe Zambia</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Legal Footer */}
      <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400 space-y-0.5">
        <p className="font-medium text-slate-500">
          Wycliffe Zambia • P.O. Box 31234, Lusaka, Zambia • Email: {companySettings?.email} • Tel: {companySettings?.phone}
        </p>
        <p className="text-[9px] text-slate-400 italic">
          "Serving the church and community through language development and Bible translation"
        </p>
      </div>
    </div>
  );
};
