/**
 * Utility formatters and calculations for Wycliffe Zambia Invoices (English)
 */

export const formatCurrency = (amount, currency = 'ZMW') => {
  const num = Number(amount) || 0;
  const formattedNumber = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currency === 'USD') {
    return `$ ${formattedNumber}`;
  }
  return `ZMW ${formattedNumber}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const calculateTotals = (items = [], vatRate = 16, discount = 0, isVatInclusive = false) => {
  const subtotal = items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  const discountAmount = Number(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  let vatAmount = 0;
  let grandTotal = 0;

  if (vatRate > 0) {
    if (isVatInclusive) {
      vatAmount = taxableAmount - taxableAmount / (1 + vatRate / 100);
      grandTotal = taxableAmount;
    } else {
      vatAmount = (taxableAmount * vatRate) / 100;
      grandTotal = taxableAmount + vatAmount;
    }
  } else {
    grandTotal = taxableAmount;
  }

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    vatRate: Number(vatRate) || 0,
    vatAmount,
    grandTotal,
  };
};

export const getNextInvoiceNumber = (existingInvoices = [], docType = 'INVOICE') => {
  const currentYear = new Date().getFullYear();
  let prefix = `WZ-${currentYear}-`;
  if (docType === 'RECEIPT') prefix = `WZ-REC-${currentYear}-`;
  if (docType === 'PROFORMA') prefix = `WZ-PRO-${currentYear}-`;
  if (docType === 'QUOTATION') prefix = `WZ-QUO-${currentYear}-`;

  if (!existingInvoices || existingInvoices.length === 0) {
    return `${prefix}001`;
  }

  const nums = existingInvoices
    .map((inv) => {
      if (inv.invoiceNumber && inv.invoiceNumber.startsWith(prefix)) {
        const part = inv.invoiceNumber.replace(prefix, '');
        const val = parseInt(part, 10);
        return isNaN(val) ? 0 : val;
      }
      return 0;
    })
    .filter((n) => n > 0);

  const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(3, '0')}`;
};

/**
 * Converts a numeric amount to English words (Accounting Standard for African & Commonwealth institutions)
 */
export const numberToWords = (amount, currency = 'ZMW') => {
  const num = Math.round(Number(amount) * 100) / 100;
  if (isNaN(num) || num === 0) return 'Zero';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertGroup = (n) => {
    let groupStr = '';
    const h = Math.floor(n / 100);
    const remainder = n % 100;

    if (h > 0) {
      groupStr += `${ones[h]} Hundred`;
      if (remainder > 0) groupStr += ' and ';
    }

    if (remainder > 0) {
      if (remainder < 20) {
        groupStr += ones[remainder];
      } else {
        const t = Math.floor(remainder / 10);
        const o = remainder % 10;
        groupStr += tens[t];
        if (o > 0) groupStr += `-${ones[o]}`;
      }
    }

    return groupStr;
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = '';
  const millions = Math.floor(integerPart / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const units = integerPart % 1000;

  if (millions > 0) {
    words += `${convertGroup(millions)} Million `;
  }
  if (thousands > 0) {
    words += `${convertGroup(thousands)} Thousand `;
  }
  if (units > 0) {
    words += convertGroup(units);
  }

  const currencyNames = {
    ZMW: { main: 'Zambian Kwacha', sub: 'Ngwee' },
    USD: { main: 'US Dollars', sub: 'Cents' },
  };

  const curr = currencyNames[currency] || { main: currency, sub: 'Cents' };

  let result = words.trim() ? `${words.trim()} ${curr.main}` : '';
  if (decimalPart > 0) {
    result += ` and ${decimalPart}/100 ${curr.sub}`;
  } else {
    result += ' Only';
  }

  return result;
};
