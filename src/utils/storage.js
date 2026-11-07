/**
 * LocalStorage Persistence Layer for Wycliffe Zambia Invoicing (English)
 */

const SETTINGS_KEY = 'wz_invoice_company_settings';
const INVOICES_KEY = 'wz_invoice_history';
const CUSTOMERS_KEY = 'wz_invoice_customers';
const CATALOG_KEY = 'wz_invoice_catalog';

export const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'Wycliffe Zambia',
  tagline: 'Bible Translation & Literacy Ministry',
  tpin: '1001928374', // Zambian Tax Payer Identification Number
  registrationNo: 'RN-84920/2012',
  email: 'finance@wycliffezambia.org',
  phone: '+260 211 254 321 / +260 977 123 456',
  address: 'Plot 4821, Great East Road, P.O. Box 31234',
  city: 'Lusaka, Zambia',
  bankName: 'Stanbic Bank Zambia Ltd',
  accountName: 'Wycliffe Zambia Ministry',
  accountNumber: '9130004829102', // ZMW Account
  usdAccountNumber: '9130008492019', // USD Account
  branchName: 'Lusaka Main Branch',
  branchCode: '040012',
  swiftCode: 'SBICZMLX',
  defaultVatRate: 16, // Zambia standard VAT rate is 16%
  currency: 'ZMW', // 'ZMW' | 'USD'
  exchangeRate: 27.5, // 1 USD = 27.50 ZMW benchmark
  notes: 'Thank you for partnering with Wycliffe Zambia. Payment is due within 30 days of invoice date.',
  terms: 'Please quote the invoice number when making direct bank deposits or wire transfers.',
  logoUrl: '/logo.png',
};

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Bible Society of Zambia',
    email: 'accounts@biblesociety-zm.org',
    phone: '+260 211 223 344',
    address: 'Plot 15, Freedom Way, Lusaka, Zambia',
    tpin: '1004582911',
  },
  {
    id: 'cust-2',
    name: 'SIL International - Southern Africa Group',
    email: 'finance_sa@sil.org',
    phone: '+260 971 889 900',
    address: 'Kabulonga Road, P.O. Box 50123, Lusaka',
    tpin: '1009823102',
  },
];

export const DEFAULT_CATALOG_ITEMS = [
  {
    id: 'cat-1',
    description: 'Linguistic Translation Workshop & Material Distribution',
    unitPriceZMW: 15500,
    unitPriceUSD: 560,
  },
  {
    id: 'cat-2',
    description: 'Orthography Standardization & Field Testing Sessions',
    unitPriceZMW: 4200,
    unitPriceUSD: 150,
  },
  {
    id: 'cat-3',
    description: 'Printed Literacy Primers & Audio Scripture Distribution (Batch of 100)',
    unitPriceZMW: 6800,
    unitPriceUSD: 245,
  },
  {
    id: 'cat-4',
    description: 'Community Language Survey & Sociolinguistic Research (per day)',
    unitPriceZMW: 3500,
    unitPriceUSD: 125,
  },
  {
    id: 'cat-5',
    description: 'Scripture Engagement Seminar & Facilitator Training',
    unitPriceZMW: 8900,
    unitPriceUSD: 320,
  },
];

export const INITIAL_INVOICE_SAMPLE = {
  id: 'inv-sample-1',
  invoiceNumber: 'WZ-2026-001',
  documentType: 'INVOICE', // 'INVOICE' | 'PROFORMA' | 'RECEIPT' | 'QUOTATION'
  currency: 'ZMW', // 'ZMW' | 'USD'
  exchangeRate: 27.5,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'Pending', // 'Pending' | 'Paid' | 'Cancelled'
  customer: INITIAL_CUSTOMERS[0],
  items: [
    {
      id: 'item-1',
      description: 'Linguistic Translation Workshop & Material Distribution',
      quantity: 1,
      unitPrice: 15500,
    },
    {
      id: 'item-2',
      description: 'Consultancy & Orthography Standardization Sessions (3 Days)',
      quantity: 3,
      unitPrice: 4200,
    },
    {
      id: 'item-3',
      description: 'Printed Literacy Primers & Audio Scripture Distribution (Batch of 100)',
      quantity: 1,
      unitPrice: 6800,
    },
  ],
  vatRate: 16,
  discount: 0,
  isVatInclusive: false,
  notes: 'Thank you for partnering with Wycliffe Zambia. Payment is due within 30 days of invoice date.',
  terms: 'Direct deposit into Stanbic Bank Zambia. Please use invoice number as deposit reference.',
};

export const getCompanySettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(data) } : DEFAULT_COMPANY_SETTINGS;
  } catch {
    return DEFAULT_COMPANY_SETTINGS;
  }
};

export const saveCompanySettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings:', e);
    return false;
  }
};

export const getInvoices = () => {
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [INITIAL_INVOICE_SAMPLE];
  } catch {
    return [INITIAL_INVOICE_SAMPLE];
  }
};

export const saveInvoices = (invoices) => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    return true;
  } catch (e) {
    console.error('Error saving invoices:', e);
    return false;
  }
};

export const getCustomers = () => {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomers = (customers) => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    return true;
  } catch (e) {
    console.error('Error saving customers:', e);
    return false;
  }
};

export const getCatalogItems = () => {
  try {
    const data = localStorage.getItem(CATALOG_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATALOG_ITEMS;
  } catch {
    return DEFAULT_CATALOG_ITEMS;
  }
};

export const saveCatalogItems = (items) => {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    console.error('Error saving catalog items:', e);
    return false;
  }
};
