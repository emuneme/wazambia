import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  RotateCcw,
  Eye,
  Edit3,
  UserPlus,
  CheckCircle,
  Coins,
  ArrowRightLeft,
  Share2,
} from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';
import { formatCurrency } from '../utils/formatters';
import { openWhatsAppShare } from '../utils/exportShare';
import { getCatalogItems } from '../utils/storage';

export const InvoiceEditor = ({
  invoice,
  setInvoice,
  customers,
  onSaveInvoice,
  onNewInvoice,
  companySettings,
}) => {
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'editor' | 'preview'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [catalogItems] = useState(getCatalogItems);

  const handleAddItemFromCatalog = (catItem) => {
    const isUSD = (invoice.currency || 'ZMW') === 'USD';
    const price = isUSD ? catItem.unitPriceUSD : catItem.unitPriceZMW;
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `item-${Date.now()}`,
          description: catItem.description,
          quantity: 1,
          unitPrice: price,
        },
      ],
    }));
  };

  // Update top-level invoice fields
  const handleChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // Switch currency with optional conversion of unit prices
  const handleCurrencyChange = (newCurrency) => {
    const prevCurrency = invoice.currency || 'ZMW';
    if (newCurrency === prevCurrency) return;

    const rate = Number(invoice.exchangeRate) || Number(companySettings?.exchangeRate) || 27.5;

    const shouldConvert = window.confirm(
      `Do you want to recalculate item unit prices from ${prevCurrency} to ${newCurrency}?` +
      `\n(Benchmark Rate: 1 USD = ${rate} ZMW)`
    );

    let updatedItems = [...invoice.items];
    if (shouldConvert) {
      updatedItems = updatedItems.map((item) => {
        const oldPrice = Number(item.unitPrice) || 0;
        let newPrice = oldPrice;
        if (prevCurrency === 'ZMW' && newCurrency === 'USD') {
          newPrice = Math.round((oldPrice / rate) * 100) / 100;
        } else if (prevCurrency === 'USD' && newCurrency === 'ZMW') {
          newPrice = Math.round(oldPrice * rate * 100) / 100;
        }
        return { ...item, unitPrice: newPrice };
      });
    }

    setInvoice((prev) => ({
      ...prev,
      currency: newCurrency,
      items: updatedItems,
    }));
  };

  // Update customer fields
  const handleCustomerChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      customer: {
        ...(prev.customer || {}),
        [field]: value,
      },
    }));
  };

  // Select existing customer
  const handleSelectCustomer = (customerId) => {
    const selected = customers.find((c) => c.id === customerId);
    if (selected) {
      setInvoice((prev) => ({
        ...prev,
        customer: { ...selected },
      }));
    }
  };

  // Item modifications
  const handleItemChange = (index, field, value) => {
    setInvoice((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `item-${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (invoice.items.length <= 1) return;
    setInvoice((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: updatedItems };
    });
  };

  // Trigger browser print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Save invoice handler
  const handleSave = () => {
    onSaveInvoice(invoice);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currency = invoice.currency || 'ZMW';

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'editor' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Editor
              </span>
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`hidden lg:flex px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'both' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-slate-600'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'preview' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Preview
              </span>
            </button>
          </div>

          {/* Quick Currency Selector in Navbar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-brand-orange" /> Currency:
            </span>
            <button
              type="button"
              onClick={() => handleCurrencyChange('ZMW')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                currency === 'ZMW'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇿🇲 ZMW (Kwacha)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange('USD')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                currency === 'USD'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇺🇸 USD (US Dollars)
            </button>
          </div>

          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <CheckCircle className="w-3.5 h-3.5" /> Invoice saved successfully!
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openWhatsAppShare(invoice, companySettings)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            title="Share invoice summary on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Clear form and generate new invoice number"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Invoice</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-charcoal hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm transition-colors"
            title="Print or Save as Official Vector A4 PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Column */}
        {(viewMode === 'editor' || viewMode === 'both') && (
          <div
            className={`no-print space-y-6 ${
              viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'
            }`}
          >
            {/* 1. Document Configuration (Type, Currency, Benchmark) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>1. Document Type & Currency</span>
                <span className="text-xs font-normal text-slate-500">
                  Select billing standard
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Document Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Classification
                  </label>
                  <select
                    value={invoice.documentType || 'INVOICE'}
                    onChange={(e) => handleChange('documentType', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  >
                    <option value="INVOICE">Tax Invoice (Official Document)</option>
                    <option value="PROFORMA">Proforma Invoice (Price Quote)</option>
                    <option value="RECEIPT">Official Receipt (Payment Voucher)</option>
                    <option value="QUOTATION">Price Quotation / Estimate</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Billing Currency
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange('ZMW')}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        currency === 'ZMW'
                          ? 'bg-brand-orange-light border-brand-orange text-brand-charcoal font-black'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🇿🇲 ZMW (Kwacha)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange('USD')}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        currency === 'USD'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-black'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🇺🇸 USD (US Dollars)
                    </button>
                  </div>
                </div>

                {/* Exchange Rate Benchmark (USD/ZMW) */}
                <div className="sm:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-brand-orange" />
                    <span className="font-medium text-slate-700">
                      Benchmark Exchange Rate:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600">1 USD = </span>
                    <input
                      type="number"
                      step="0.05"
                      value={invoice.exchangeRate || 27.5}
                      onChange={(e) => handleChange('exchangeRate', Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded bg-white"
                    />
                    <span className="font-mono font-semibold text-slate-700">ZMW</span>
                  </div>
                </div>

                {/* Design Template Switcher */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Invoice Design Style / Template
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'executive', title: 'Executive Corporate', desc: 'Brand ribbon, QR code & modern grid' },
                      { id: 'minimalist', title: 'Modern Minimalist', desc: 'Airy layout, hairline dividers & Nordic feel' },
                      { id: 'formal', title: 'Formal Ministry', desc: 'Boxed border frame & classic accounting structure' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleChange('template', t.id)}
                        className={`p-2.5 text-left rounded-lg border transition-all ${
                          (invoice.template || 'executive') === t.id
                            ? 'bg-brand-orange-light border-brand-orange shadow-xs ring-1 ring-brand-orange'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-charcoal">{t.title}</span>
                          {(invoice.template || 'executive') === t.id && (
                            <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Header & Identification */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Invoice Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber || ''}
                    onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                    placeholder="WZ-2026-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date of Issue
                  </label>
                  <input
                    type="date"
                    value={invoice.date || ''}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoice.dueDate || ''}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Payment Status
                </label>
                <div className="flex gap-3">
                  {[
                    { id: 'Pending', label: 'Pending Payment' },
                    { id: 'Paid', label: 'Paid in Full' },
                    { id: 'Cancelled', label: 'Cancelled' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                        invoice.status === s.id || (s.id === 'Pending' && invoice.status === 'Pendente') || (s.id === 'Paid' && invoice.status === 'Paga')
                          ? s.id === 'Paid'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : s.id === 'Cancelled'
                            ? 'bg-rose-50 border-rose-500 text-rose-800'
                            : 'bg-amber-50 border-amber-500 text-amber-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={invoice.status === s.id}
                        onChange={() => handleChange('status', s.id)}
                        className="sr-only"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Client Information */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">
                  3. Client / Organization Details
                </h3>
                {customers?.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Quick Select:</span>
                    <select
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      defaultValue=""
                      className="px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    >
                      <option value="" disabled>
                        -- Choose Saved Client --
                      </option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Client / Organization Name *
                  </label>
                  <input
                    type="text"
                    value={invoice.customer?.name || ''}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    placeholder="e.g. Bible Society of Zambia"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Client TPIN (Zambia Tax ID)
                  </label>
                  <input
                    type="text"
                    value={invoice.customer?.tpin || ''}
                    onChange={(e) => handleCustomerChange('tpin', e.target.value)}
                    placeholder="e.g. 1004582911"
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={invoice.customer?.email || ''}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    placeholder="accounts@organization.org"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={invoice.customer?.phone || ''}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    placeholder="+260 977 000 000"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Physical Address / P.O. Box
                  </label>
                  <input
                    type="text"
                    value={invoice.customer?.address || ''}
                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                    placeholder="Plot 12, Freedom Way, Lusaka, Zambia"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Line Items */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">
                  4. Line Items & Services ({currency})
                </h3>
                <div className="flex items-center gap-2">
                  {catalogItems?.length > 0 && (
                    <select
                      onChange={(e) => {
                        const found = catalogItems.find((c) => c.id === e.target.value);
                        if (found) {
                          handleAddItemFromCatalog(found);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-orange bg-slate-50 font-medium"
                    >
                      <option value="" disabled>
                        + Insert Ministry Service...
                      </option>
                      {catalogItems.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.description} ({currency === 'USD' ? `$${cat.unitPriceUSD}` : `ZMW ${cat.unitPriceZMW}`})
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orange-dark"
                  >
                    <Plus className="w-4 h-4" /> Add Blank
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(invoice.items || []).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Item Description #{index + 1}
                        </label>
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="e.g. Translation & Literacy Workshop Sessions"
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-orange focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={invoice.items.length <= 1}
                        className="mt-6 p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-orange focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Unit Price ({currency})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-orange focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Line Total
                        </label>
                        <div className="px-3 py-1.5 text-sm font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded-md">
                          {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-brand-orange text-slate-600 hover:text-brand-orange rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Line Item
              </button>
            </div>

            {/* 5. Taxes, Discounts & Notes */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2">
                5. Tax Rates, Discounts & Special Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Value Added Tax / VAT (%)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('vatRate', 0);
                        const noteText = 'Tax Exempt Entity: Registered Religious & Non-Profit Educational Institution pursuant to Section 18 of the Value Added Tax Act of Zambia.';
                        if (!invoice.notes || !invoice.notes.includes(noteText)) {
                          handleChange('notes', invoice.notes ? `${invoice.notes}\n${noteText}` : noteText);
                        }
                      }}
                      className="text-[10px] text-brand-orange font-bold hover:underline"
                    >
                      Set Tax Exempt (0%)
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={invoice.vatRate ?? 16}
                    onChange={(e) => handleChange('vatRate', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    * Zambia standard rate is 16%. Click above for non-profit tax exemption.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Commercial Discount ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoice.discount || 0}
                    onChange={(e) => handleChange('discount', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Notes & Payment Terms
                  </label>
                  <textarea
                    rows="2"
                    value={invoice.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                    placeholder="Additional instructions, grant references, or thank you message..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === 'preview' || viewMode === 'both') && (
          <div
            className={`space-y-4 ${
              viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'
            }`}
          >
            <div className="no-print flex flex-wrap items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Style:</span>
                {[
                  { id: 'executive', label: 'Executive' },
                  { id: 'minimalist', label: 'Minimalist' },
                  { id: 'formal', label: 'Formal' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleChange('template', t.id)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded capitalize transition-all ${
                      (invoice.template || 'executive') === t.id
                        ? 'bg-brand-charcoal text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-brand-orange font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                A4 Exact Page Fit
              </span>
            </div>

            <div className="border border-slate-300 rounded-2xl p-2 sm:p-4 bg-slate-100 shadow-inner overflow-hidden">
              <InvoicePreview invoice={invoice} companySettings={companySettings} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
