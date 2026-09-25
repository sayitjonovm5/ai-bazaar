"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Database, Save } from "lucide-react";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("UZS");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your market intelligence preferences and workspace settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Market Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Market Data & Display</h2>
              <p className="text-sm text-gray-500">Customize how pricing and commodities are displayed</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UZS">UZS (Uzbekistan Som)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-medium text-gray-900">Auto-refresh commodity rates</span>
                <p className="text-xs text-gray-500">Periodically update exchange prices and weekly bulletin forecasts</p>
              </div>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h2>
              <p className="text-sm text-gray-500">Manage price fluctuation notices for pinned products</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Price anomaly warnings</span>
              <p className="text-xs text-gray-500">Receive alerts when commodity prices swing significantly beyond forecast</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Platform Status</h2>
              <p className="text-sm text-gray-500">UZEX Weekly Bulletin & Chronos AI Forecasting</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Data Source:</span> UZEX Commodity Exchange Archives</p>
            <p><span className="font-medium text-gray-700">AI Model:</span> Amazon Chronos (T5-Mini zero-shot forecaster)</p>
            <p><span className="font-medium text-gray-700">Version:</span> 1.0.0 (Hackathon Edition)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Settings saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
