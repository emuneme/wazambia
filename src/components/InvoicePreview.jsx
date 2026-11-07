import React from 'react';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { FormalTemplate } from './templates/FormalTemplate';
import { formatCurrency, formatDate, calculateTotals, numberToWords } from '../utils/formatters';

export const InvoicePreview = ({ invoice, companySettings }) => {
  if (!invoice) return null;

  const currency = invoice.currency || companySettings?.currency || 'ZMW';

  const totals = calculateTotals(
    invoice.items,
    invoice.vatRate,
    invoice.discount,
    invoice.isVatInclusive
  );

  const docTitles = {
    INVOICE: {
      title: 'TAX INVOICE',
      subtitle: 'ORIGINAL FISCAL DOCUMENT',
    },
    PROFORMA: {
      title: 'PROFORMA INVOICE',
      subtitle: 'COMMERCIAL PRICE PROPOSAL',
    },
    RECEIPT: {
      title: 'OFFICIAL RECEIPT',
      subtitle: 'PAYMENT VOUCHER & ACKNOWLEDGEMENT',
    },
    QUOTATION: {
      title: 'PRICE QUOTATION',
      subtitle: 'SERVICE ESTIMATE & SPECIFICATION',
    },
  };

  const currentDoc = docTitles[invoice.documentType] || docTitles.INVOICE;

  const isPaid = invoice.status === 'Paid' || invoice.status === 'Paga';
  const isCancelled = invoice.status === 'Cancelled' || invoice.status === 'Cancelada';

  const statusPills = {
    Pending: 'bg-amber-50 text-amber-800 border-amber-300',
    Paid: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-rose-50 text-rose-800 border-rose-300',
  };

  const currentStatus = isPaid ? 'Paid' : isCancelled ? 'Cancelled' : 'Pending';
  const amountInWords = numberToWords(totals.grandTotal, currency);

  // Active account number based on currency
  const activeAccountNumber =
    currency === 'USD'
      ? companySettings?.usdAccountNumber || '9130008492019'
      : companySettings?.accountNumber || '9130004829102';

  const accountTypeLabel = currency === 'USD' ? 'USD Domiciliary Account' : 'Kwacha Settlement Account';

  const templateType = invoice.template || 'executive';

  const sharedProps = {
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
    isPaid,
  };

  if (templateType === 'minimalist') {
    return <MinimalistTemplate {...sharedProps} />;
  }

  if (templateType === 'formal') {
    return <FormalTemplate {...sharedProps} />;
  }

  // Default: Executive Corporate
  return <ExecutiveTemplate {...sharedProps} />;
};
