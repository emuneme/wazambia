import { formatCurrency, formatDate, calculateTotals } from './formatters';

/**
 * Generates WhatsApp share URL with professional invoice details in English
 */
export const openWhatsAppShare = (invoice, companySettings) => {
  if (!invoice) return;

  const currency = invoice.currency || companySettings?.currency || 'ZMW';
  const totals = calculateTotals(
    invoice.items,
    invoice.vatRate,
    invoice.discount,
    invoice.isVatInclusive
  );

  const docTypeName =
    invoice.documentType === 'RECEIPT'
      ? 'OFFICIAL PAYMENT RECEIPT'
      : invoice.documentType === 'PROFORMA'
      ? 'PROFORMA INVOICE'
      : invoice.documentType === 'QUOTATION'
      ? 'PRICE ESTIMATE & QUOTATION'
      : 'OFFICIAL TAX INVOICE';

  const bankAccount =
    currency === 'USD'
      ? companySettings?.usdAccountNumber || '9130008492019'
      : companySettings?.accountNumber || '9130004829102';

  const text = `*${(companySettings?.companyName || 'WYCLIFFE ZAMBIA').toUpperCase()}*
📄 *${docTypeName}*
----------------------------------------
*Document No:* ${invoice.invoiceNumber || 'WZ-2026-001'}
*Client:* ${invoice.customer?.name || 'General Client'}
*Issue Date:* ${formatDate(invoice.date)}
*Due Date:* ${formatDate(invoice.dueDate)}
*Status:* ${invoice.status || 'Pending'}

*TOTAL PAYABLE:* ${formatCurrency(totals.grandTotal, currency)}
----------------------------------------
🏦 *Banking Instructions:*
Bank: ${companySettings?.bankName || 'Stanbic Bank Zambia Ltd'}
Account (${currency}): ${bankAccount}
SWIFT: ${companySettings?.swiftCode || 'SBICZMLX'}
Reference: ${invoice.invoiceNumber}

_Wycliffe Zambia - Bible Translation & Literacy Ministry_`;

  const phone = (invoice.customer?.phone || '').replace(/[^0-9]/g, '');
  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(url, '_blank');
};

/**
 * Export invoice list to CSV spreadsheet (compatible with Excel) in English
 */
export const exportInvoicesToCSV = (invoices = []) => {
  if (!invoices || invoices.length === 0) {
    alert('No invoices available to export.');
    return;
  }

  const headers = [
    'Invoice_Number',
    'Document_Type',
    'Client_Name',
    'Client_TPIN',
    'Issue_Date',
    'Due_Date',
    'Currency',
    'Subtotal',
    'VAT_Rate',
    'VAT_Amount',
    'Discount',
    'Grand_Total',
    'Status',
  ];

  const rows = invoices.map((inv) => {
    const totals = calculateTotals(inv.items, inv.vatRate, inv.discount, inv.isVatInclusive);
    return [
      `"${inv.invoiceNumber || ''}"`,
      `"${inv.documentType || 'INVOICE'}"`,
      `"${(inv.customer?.name || '').replace(/"/g, '""')}"`,
      `"${inv.customer?.tpin || ''}"`,
      `"${inv.date || ''}"`,
      `"${inv.dueDate || ''}"`,
      `"${inv.currency || 'ZMW'}"`,
      totals.subtotal.toFixed(2),
      totals.vatRate,
      totals.vatAmount.toFixed(2),
      totals.discountAmount.toFixed(2),
      totals.grandTotal.toFixed(2),
      `"${inv.status || 'Pending'}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `wycliffe_zambia_invoices_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
