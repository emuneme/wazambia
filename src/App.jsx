import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoiceHistory } from './components/InvoiceHistory';
import { CustomerManager } from './components/CustomerManager';
import { SettingsModal } from './components/SettingsModal';
import { InvoicePreview } from './components/InvoicePreview';
import {
  getCompanySettings,
  saveCompanySettings,
  getInvoices,
  saveInvoices,
  getCustomers,
  saveCustomers,
} from './utils/storage';
import { getNextInvoiceNumber } from './utils/formatters';

export default function App() {
  const [companySettings, setCompanySettings] = useState(getCompanySettings);
  const [invoices, setInvoices] = useState(getInvoices);
  const [customers, setCustomers] = useState(getCustomers);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'history' | 'customers' | 'settings'

  // Initialize a fresh new invoice
  const createBlankInvoice = (settings, currentInvoices, customer = null) => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      id: `inv-${Date.now()}`,
      invoiceNumber: getNextInvoiceNumber(currentInvoices, 'INVOICE'),
      documentType: 'INVOICE',
      template: 'executive',
      currency: settings?.currency || 'ZMW',
      exchangeRate: settings?.exchangeRate || 27.5,
      date: today,
      dueDate: dueDate,
      status: 'Pending',
      customer: customer || {
        name: '',
        email: '',
        phone: '',
        address: '',
        tpin: '',
      },
      items: [
        {
          id: `item-${Date.now()}-1`,
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
      vatRate: settings?.defaultVatRate ?? 16,
      discount: 0,
      isVatInclusive: false,
      notes: settings?.notes || '',
      terms: settings?.terms || '',
    };
  };

  const [currentInvoice, setCurrentInvoice] = useState(() => {
    const initialList = getInvoices();
    return initialList.length > 0
      ? initialList[0]
      : createBlankInvoice(getCompanySettings(), initialList);
  });

  // Keep storage in sync when state updates
  const handleSaveCompanySettings = (newSettings) => {
    setCompanySettings(newSettings);
    saveCompanySettings(newSettings);
  };

  const handleSaveInvoice = (invoiceToSave) => {
    setInvoices((prev) => {
      const index = prev.findIndex((inv) => inv.id === invoiceToSave.id);
      let updated;
      if (index >= 0) {
        updated = [...prev];
        updated[index] = invoiceToSave;
      } else {
        updated = [invoiceToSave, ...prev];
      }
      saveInvoices(updated);
      return updated;
    });

    // Also auto-save/update customer in catalog if customer has a name
    if (invoiceToSave.customer?.name) {
      setCustomers((prevCusts) => {
        const existingIdx = prevCusts.findIndex(
          (c) => c.name.toLowerCase() === invoiceToSave.customer.name.toLowerCase()
        );
        let updatedCusts;
        if (existingIdx >= 0) {
          updatedCusts = [...prevCusts];
          updatedCusts[existingIdx] = { ...updatedCusts[existingIdx], ...invoiceToSave.customer };
        } else {
          updatedCusts = [
            ...prevCusts,
            { id: `cust-${Date.now()}`, ...invoiceToSave.customer },
          ];
        }
        saveCustomers(updatedCusts);
        return updatedCusts;
      });
    }
  };

  const handleNewInvoice = () => {
    const fresh = createBlankInvoice(companySettings, invoices);
    setCurrentInvoice(fresh);
    setActiveTab('editor');
  };

  const handleSelectInvoice = (inv) => {
    setCurrentInvoice(inv);
    setActiveTab('editor');
  };

  const handlePrintInvoice = (inv) => {
    setCurrentInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDuplicateInvoice = (inv) => {
    const duplicate = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: getNextInvoiceNumber(invoices, inv.documentType || 'INVOICE'),
      documentType: inv.documentType || 'INVOICE',
      template: inv.template || 'executive',
      currency: inv.currency || 'ZMW',
      exchangeRate: inv.exchangeRate || 27.5,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    };
    setCurrentInvoice(duplicate);
    setActiveTab('editor');
  };

  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const updated = invoices.filter((inv) => inv.id !== id);
      setInvoices(updated);
      saveInvoices(updated);
      if (currentInvoice.id === id) {
        handleNewInvoice();
      }
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    );
    setInvoices(updated);
    saveInvoices(updated);
    if (currentInvoice.id === id) {
      setCurrentInvoice((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveCustomer = (customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = customer;
      } else {
        updated = [customer, ...prev];
      }
      saveCustomers(updated);
      return updated;
    });
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to remove this client?')) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      saveCustomers(updated);
    }
  };

  const handleCreateInvoiceForCustomer = (customer) => {
    const fresh = createBlankInvoice(companySettings, invoices, customer);
    setCurrentInvoice(fresh);
    setActiveTab('editor');
  };

  const handleImportBackup = (backup) => {
    if (backup.companySettings) {
      handleSaveCompanySettings(backup.companySettings);
    }
    if (backup.invoices) {
      setInvoices(backup.invoices);
      saveInvoices(backup.invoices);
    }
    if (backup.customers) {
      setCustomers(backup.customers);
      saveCustomers(backup.customers);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewInvoice={handleNewInvoice}
        companySettings={companySettings}
      />

      {/* Main Content Area (Hidden during print) */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats overview */}
        <StatsCards invoices={invoices} />

        {/* Tab View */}
        {activeTab === 'editor' && (
          <InvoiceEditor
            invoice={currentInvoice}
            setInvoice={setCurrentInvoice}
            customers={customers}
            onSaveInvoice={handleSaveInvoice}
            onNewInvoice={handleNewInvoice}
            companySettings={companySettings}
          />
        )}

        {activeTab === 'history' && (
          <InvoiceHistory
            invoices={invoices}
            onSelectInvoice={handleSelectInvoice}
            onPrintInvoice={handlePrintInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onNewInvoice={handleNewInvoice}
            onUpdateStatus={handleUpdateStatus}
            companySettings={companySettings}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            onSaveCustomer={handleSaveCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onCreateInvoiceForCustomer={handleCreateInvoiceForCustomer}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            companySettings={companySettings}
            onSaveSettings={handleSaveCompanySettings}
            allInvoices={invoices}
            allCustomers={customers}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Print-Only Target: Rendered exclusively when window.print() is called */}
      <div className="print-only">
        <InvoicePreview invoice={currentInvoice} companySettings={companySettings} />
      </div>

      {/* Application Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Official Invoicing System • <strong className="text-brand-charcoal">Wycliffe Zambia</strong> • © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
