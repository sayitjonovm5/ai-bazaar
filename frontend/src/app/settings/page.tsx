"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Database, Save, RefreshCw } from "lucide-react";
import { useCurrency, type Currency } from "@/lib/currency-context";

export default function SettingsPage() {
  const {
    currency: activeCurrency,
    setCurrency: setActiveCurrency,
    rate,
    rateDate,
    rateSource,
    isLoadingRate,
  } = useCurrency();

  const [currency, setCurrency] = useState<Currency>(activeCurrency);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCurrency(activeCurrency);
  }, [activeCurrency]);

  useEffect(() => {
    try {
      const value = localStorage.getItem("narxnazar-preferences");
      if (!value) return;
      const preferences = JSON.parse(value);
      if (preferences.currency === "USD" || preferences.currency === "UZS") {
        setCurrency(preferences.currency);
      }
      setAutoRefresh(preferences.autoRefresh !== false);
      setNotifications(preferences.notifications !== false);
    } catch {
      /* Default preferences remain available. */
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActiveCurrency(currency);
      localStorage.setItem(
        "narxnazar-preferences",
        JSON.stringify({ currency, autoRefresh, notifications }),
      );
      setSaved(true);
      setSaveError(false);
    } catch {
      setSaved(false);
      setSaveError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-3">
      <div className="page-heading">
        <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-500 mt-1">
          Bozor tahlili sozlamalarini o‘zgartiring.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5"
        onChange={() => setSaved(false)}
      >
        {/* Market Preferences */}
        <div className="surface p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Bozor ma’lumotlari va ko‘rinish
              </h2>
              <p className="text-sm text-gray-500">
                Narxlar va tovarlarni qanday ko‘rsatishni moslashtiring
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="currency" className="field-label">
                Asosiy valyuta
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => {
                  const val = e.target.value as Currency;
                  setCurrency(val);
                  setActiveCurrency(val);
                }}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UZS">UZS (O‘zbek so‘mi)</option>
                <option value="USD">USD (AQSh dollari)</option>
              </select>

              <div className="mt-3 max-w-md rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-800">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    {isLoadingRate && (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    )}
                    Markaziy Bank (CBU) rasmiy kursi:
                  </span>
                  <span className="font-semibold tabular-nums">
                    1 USD ={" "}
                    {rate.toLocaleString("uz-UZ", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    UZS
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-blue-600/80">
                  <span>Manba: {rateSource}</span>
                  {rateDate && <span>Sana: {rateDate}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 pt-2">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Mahsulot narxlarini avtomatik yangilash
                </span>
                <p className="text-xs text-gray-500">
                  Birja narxlarini va haftalik prognozlarni muntazam yangilab
                  turish
                </p>
              </div>
              <input
                id="auto-refresh"
                aria-label="Mahsulot narxlarini avtomatik yangilash"
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="settings-switch"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="surface p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ogohlantirishlar va bildirishnomalar
              </h2>
              <p className="text-sm text-gray-500">
                Qistirilgan mahsulotlar uchun narx o‘zgarishi
                bildirishnomalarini boshqarish
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5">
            <div>
              <span className="text-sm font-medium text-gray-900">
                Narx anomaliyasi ogohlantirishlari
              </span>
              <p className="text-xs text-gray-500">
                Narxlar prognozdan tashqariga chiqqanda ogohlantirish olish
              </p>
            </div>
            <input
              id="notifications"
              aria-label="Narx anomaliyasi ogohlantirishlari"
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="settings-switch"
            />
          </div>
        </div>

        {/* Platform Info */}
        <div className="surface p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Platforma holati
              </h2>
              <p className="text-sm text-gray-500">
                UZEX haftalik byulleteni va Chronos AI prognozlari
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">
                Ma’lumot manbai:
              </span>{" "}
              UZEX tovar-xom ashyo birjasi arxivlari
            </p>
            <p>
              <span className="font-medium text-gray-700">AI modeli:</span>{" "}
              Amazon Chronos (T5-Mini zero-shot forecaster)
            </p>
            <p>
              <span className="font-medium text-gray-700">Versiya:</span> 1.0.0
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Tanlovlar ushbu brauzerda saqlanadi. Avtomatik yangilash va
          bildirishnomalar hozircha faol emas.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="button-primary">
            <Save className="w-4 h-4" />
            Sozlamalarni saqlash
          </button>
          {saveError && (
            <span role="alert" className="text-sm text-red-700">
              Brauzer sozlamalarni saqlashga ruxsat bermadi.
            </span>
          )}
          {saved && (
            <span
              role="status"
              className="text-sm font-medium text-emerald-600"
            >
              Tanlovlar shu brauzerda saqlandi.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
