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
        <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-500 mt-1">Bozor tahlili sozlamalarini o'zgartiring.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Market Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bozor ma'lumotlari va ko'rinish</h2>
              <p className="text-sm text-gray-500">Narxlar va tovarlarni qanday ko'rsatishni moslashtiring</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asosiy valyuta</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UZS">UZS (O'zbek so'mi)</option>
                <option value="USD">USD (AQSh dollari)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-medium text-gray-900">Mahsulot narxlarini avtomatik yangilash</span>
                <p className="text-xs text-gray-500">Birja narxlarini va haftalik prognozlarni muntazam yangilab turish</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Ogohlantirishlar va bildirishnomalar</h2>
              <p className="text-sm text-gray-500">Qistirilgan mahsulotlar uchun narx o'zgarishi bildirishnomalarini boshqarish</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Narx anomaliyasi ogohlantirishlari</span>
              <p className="text-xs text-gray-500">Narxlar prognozdan tashqariga chiqqanda ogohlantirish olish</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Platforma holati</h2>
              <p className="text-sm text-gray-500">UZEX haftalik byulleteni va Chronos AI prognozlari</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Ma'lumot manbai:</span> UZEX tovar-xom ashyo birjasi arxivlari</p>
            <p><span className="font-medium text-gray-700">AI modeli:</span> Amazon Chronos (T5-Mini zero-shot forecaster)</p>
            <p><span className="font-medium text-gray-700">Versiya:</span> 1.0.0 (Xakaton versiyasi)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Sozlamalarni saqlash
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Sozlamalar muvaffaqiyatli saqlandi!</span>}
        </div>
      </form>
    </div>
  );
}
