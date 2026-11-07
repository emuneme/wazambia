import React, { useState } from 'react';
import { Plus, Edit, Trash2, FilePlus, Mail, Phone, MapPin } from 'lucide-react';

export const CustomerManager = ({
  customers,
  onSaveCustomer,
  onDeleteCustomer,
  onCreateInvoiceForCustomer,
}) => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tpin: '',
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      tpin: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      tpin: customer.tpin || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSaveCustomer({
      id: editingCustomer ? editingCustomer.id : `cust-${Date.now()}`,
      ...formData,
    });

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Client & Partner Directory</h2>
          <p className="text-xs text-slate-500">
            Manage recurring ministry partners and institutional clients for fast invoicing
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Modal / Inline Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border-2 border-brand-orange/30 shadow-md">
          <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
            {editingCustomer ? 'Edit Client Details' : 'Add New Client / Partner'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Client / Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. SIL International - Southern Africa Group"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Client TPIN (Zambia Tax ID)
              </label>
              <input
                type="text"
                value={formData.tpin}
                onChange={(e) => setFormData({ ...formData, tpin: e.target.value })}
                placeholder="e.g. 1009823102"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="accounts@organization.org"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+260 971 000 000"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Physical Address / P.O. Box</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Plot 12, Kabulonga Road, P.O. Box 50123, Lusaka"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm transition-colors"
              >
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{c.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 text-slate-400 hover:text-brand-orange rounded"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(c.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                {c.tpin && (
                  <p className="flex items-center gap-1.5 font-mono text-slate-700">
                    <span className="font-semibold text-brand-orange">TPIN:</span> {c.tpin}
                  </p>
                )}
                {c.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </p>
                )}
                {c.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.phone}</span>
                  </p>
                )}
                {c.address && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onCreateInvoiceForCustomer(c)}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-brand-orange-light text-slate-700 hover:text-brand-orange font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <FilePlus className="w-3.5 h-3.5" /> Create Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
