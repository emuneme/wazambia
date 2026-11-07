import React from 'react';
import { FileText, PlusCircle, Users, Settings } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onNewInvoice, companySettings }) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Entity Name */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => setActiveTab('editor')}
          >
            <img
              src={companySettings?.logoUrl || '/logo.png'}
              alt="Wycliffe Zambia Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="hidden sm:block border-l border-slate-200 pl-4 py-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange block">
                Ministry Operations
              </span>
              <span className="text-sm font-bold text-brand-charcoal">
                Official Invoicing System
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-brand-orange text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-brand-orange text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Invoice History</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-brand-orange text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clients</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-brand-orange text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Organization Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
