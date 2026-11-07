import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  Download,
  Upload,
  ShieldCheck,
  Building2,
  Image as ImageIcon,
  RotateCcw,
  ListPlus,
  Trash2,
  Plus,
} from 'lucide-react';
import { getCatalogItems, saveCatalogItems } from '../utils/storage';

export const SettingsModal = ({
  companySettings,
  onSaveSettings,
  allInvoices,
  allCustomers,
  onImportBackup,
}) => {
  const [formData, setFormData] = useState({ ...companySettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [catalogItems, setCatalogItems] = useState(getCatalogItems);

  // New catalog item input state
  const [newCatalogItem, setNewCatalogItem] = useState({
    description: '',
    unitPriceZMW: '',
    unitPriceUSD: '',
  });
  const [catalogMessage, setCatalogMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('logoUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    handleChange('logoUrl', '/logo.png');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Add item to ministry services catalog
  const handleAddCatalogItem = (e) => {
    e.preventDefault();
    if (!newCatalogItem.description.trim()) return;

    const newItem = {
      id: `cat-${Date.now()}`,
      description: newCatalogItem.description.trim(),
      unitPriceZMW: Number(newCatalogItem.unitPriceZMW) || 0,
      unitPriceUSD: Number(newCatalogItem.unitPriceUSD) || 0,
    };

    const updated = [...catalogItems, newItem];
    setCatalogItems(updated);
    saveCatalogItems(updated);
    setNewCatalogItem({ description: '', unitPriceZMW: '', unitPriceUSD: '' });
    setCatalogMessage('Service added to catalog!');
    setTimeout(() => setCatalogMessage(''), 3000);
  };

  // Remove item from ministry services catalog
  const handleDeleteCatalogItem = (id) => {
    const updated = catalogItems.filter((item) => item.id !== id);
    setCatalogItems(updated);
    saveCatalogItems(updated);
  };

  // Export full backup
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      companySettings: formData,
      invoices: allInvoices,
      customers: allCustomers,
      catalogItems: catalogItems,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wycliffe_zambia_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import backup
  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.companySettings || parsed.invoices) {
          onImportBackup(parsed);
          if (parsed.catalogItems) {
            setCatalogItems(parsed.catalogItems);
            saveCatalogItems(parsed.catalogItems);
          }
          alert('Backup restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error parsing backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Institutional Settings (Wycliffe Zambia)
          </h2>
          <p className="text-xs text-slate-500">
            Manage corporate branding, tax identities, banking instructions, and ministry services
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle className="w-4 h-4" /> Settings saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Official Logo & Visual Identity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-orange" /> Organization Logo & Visual Identity
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center min-w-[200px] h-24">
              <img
                src={formData.logoUrl || '/logo.png'}
                alt="Wycliffe Zambia Logo"
                className="max-h-16 max-w-full object-contain"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
            </div>

            <div className="space-y-2 flex-1">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Custom Logo Image (PNG, JPG, SVG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-orange-light file:text-brand-orange hover:file:bg-brand-orange hover:file:text-white file:cursor-pointer transition-all"
              />
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-orange underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Default Wycliffe Zambia Logo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Entity & Tax Registration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-orange" /> Organization Identity & Tax Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Organization Legal Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mission Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Wycliffe Zambia TPIN (Tax Identification Number)
              </label>
              <input
                type="text"
                value={formData.tpin || ''}
                onChange={(e) => handleChange('tpin', e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Society Registration Number
              </label>
              <input
                type="text"
                value={formData.registrationNo || ''}
                onChange={(e) => handleChange('registrationNo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Finance / Billing Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Headquarters Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Physical Office Address / P.O. Box
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                City and Country
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Banking Accounts & Currencies */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-green" /> Official Bank Accounts (ZMW & USD)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountName || ''}
                onChange={(e) => handleChange('accountName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kwacha Main Account (ZMW)
              </label>
              <input
                type="text"
                value={formData.accountNumber || ''}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="e.g. 9130004829102"
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                US Dollar Domiciliary Account (USD)
              </label>
              <input
                type="text"
                value={formData.usdAccountNumber || ''}
                onChange={(e) => handleChange('usdAccountNumber', e.target.value)}
                placeholder="e.g. 9130008492019"
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Branch Name & Code
              </label>
              <input
                type="text"
                value={formData.branchCode || ''}
                onChange={(e) => handleChange('branchCode', e.target.value)}
                placeholder="e.g. 040012 (Lusaka Main)"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                SWIFT / BIC Code
              </label>
              <input
                type="text"
                value={formData.swiftCode || ''}
                onChange={(e) => handleChange('swiftCode', e.target.value)}
                placeholder="e.g. SBICZMLX"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Benchmark Exchange Rate (1 USD = ? ZMW)
              </label>
              <input
                type="number"
                step="0.05"
                value={formData.exchangeRate ?? 27.5}
                onChange={(e) => handleChange('exchangeRate', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Standard Value Added Tax / VAT (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={formData.defaultVatRate ?? 16}
                onChange={(e) => handleChange('defaultVatRate', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* 4. Ministry Services Catalog Manager */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
            <ListPlus className="w-4 h-4 text-brand-orange" /> Ministry Services Catalog
          </h3>
          {catalogMessage && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
              {catalogMessage}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Services configured here appear in the "Insert Ministry Service" dropdown in the invoice editor for instant one-click insertion.
        </p>

        {/* Add New Catalog Item Form */}
        <form onSubmit={handleAddCatalogItem} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Add New Service to Catalog
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                required
                placeholder="Service / Item Description (e.g. Literacy Teacher Training)"
                value={newCatalogItem.description}
                onChange={(e) => setNewCatalogItem({ ...newCatalogItem, description: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Rate in ZMW"
                value={newCatalogItem.unitPriceZMW}
                onChange={(e) => setNewCatalogItem({ ...newCatalogItem, unitPriceZMW: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Rate in USD"
                value={newCatalogItem.unitPriceUSD}
                onChange={(e) => setNewCatalogItem({ ...newCatalogItem, unitPriceUSD: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-charcoal hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Catalog</span>
            </button>
          </div>
        </form>

        {/* Catalog Items List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                <th className="py-2.5 px-3">Service Description</th>
                <th className="py-2.5 px-3 text-right">ZMW Rate</th>
                <th className="py-2.5 px-3 text-right">USD Rate</th>
                <th className="py-2.5 px-3 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {catalogItems.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-3 font-medium text-slate-800">{cat.description}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">ZMW {cat.unitPriceZMW?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-800 font-semibold">${cat.unitPriceUSD?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogItem(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Database Backup & Recovery */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider border-b border-slate-100 pb-2">
          Database Backup & Recovery
        </h3>
        <p className="text-xs text-slate-600">
          Regularly download a full JSON backup to safeguard all invoices, clients, settings, and services catalog stored in your browser.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore from JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
