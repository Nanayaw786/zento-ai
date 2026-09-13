"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getBusiness, updateBusiness, requestWhatsAppNumber } from "@/lib/api";

type Business = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_requested_number: string | null;
  whatsapp_request_status: string | null;
};

export default function SettingsPage() {
  const { businessId } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waSaving, setWaSaving] = useState(false);
  const [waSuccess, setWaSuccess] = useState(false);

  const loadBusiness = () => {
    if (!businessId) return;
    getBusiness(businessId)
      .then((data) => {
        setBusiness(data);
        setName(data.name);
        setPhone(data.phone ?? "");
        setBusinessType(data.business_type ?? "");
      })
      .catch(() => setError("Could not load business settings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateBusiness(businessId, {
        name,
        phone: phone || undefined,
        business_type: businessType || undefined,
      });
      setSuccess(true);
    } catch {
      setError("Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleWaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !waNumber.trim()) return;
    setWaSaving(true);
    setWaSuccess(false);
    try {
      await requestWhatsAppNumber(businessId, waNumber.trim());
      setWaSuccess(true);
      loadBusiness();
    } catch {
      setError("Could not submit WhatsApp number request.");
    } finally {
      setWaSaving(false);
    }
  };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium text-zento-navy mb-4">Settings</h2>

      <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
        <h3 className="text-sm font-medium text-zento-navy mb-4">Business Profile</h3>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-green-700 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg">
            Settings saved.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black/60 mb-1">Business name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black/60 mb-1">
              Phone number
              <span className="text-black/40 font-normal"> â€” used for AI notification alerts</span>
            </label>
            <input
              type="text"
              placeholder="233240000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black/60 mb-1">Business type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
            >
              <option value="">Select a type</option>
              <option value="restaurant">Restaurant</option>
              <option value="salon">Salon</option>
              <option value="retail">Retail store</option>
              <option value="hotel">Hotel / Guest house</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="real_estate">Real estate</option>
              <option value="school">School</option>
              <option value="service">Service business</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
        <h3 className="text-sm font-medium text-zento-navy mb-4">Account</h3>
        <div className="text-sm text-black/60">
          <p className="mb-1">
            <span className="text-black/40">Email:</span> {business?.email}
          </p>
          <p className="text-black/40 text-xs mt-2">
            Contact support to change your account email or password.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <h3 className="text-sm font-medium text-zento-navy mb-4">WhatsApp Connection</h3>

        {business?.whatsapp_phone_number_id ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm text-black/60">
              Your WhatsApp number is connected and active.
            </p>
          </div>
        ) : business?.whatsapp_request_status === "pending" ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <p className="text-sm text-black/60">
              Request submitted for {business.whatsapp_requested_number} â€” our team will connect it shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-black/60 mb-3">
              No WhatsApp number connected yet. Enter the number you&apos;d like your customers to message.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> This number must NOT currently be active on WhatsApp
                (personal or business app). It needs to be a fresh number, or one you&apos;re willing
                to remove from WhatsApp first, since it will be dedicated to your Zento AI assistant.
              </p>
            </div>
            {waSuccess && (
              <p className="text-green-700 text-sm mb-3 bg-green-50 px-3 py-2 rounded-lg">
                Request submitted. Our team will connect this number shortly.
              </p>
            )}
            <form onSubmit={handleWaRequest} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="e.g. 233240000000"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
              <button
                type="submit"
                disabled={waSaving}
                className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
              >
                {waSaving ? "Submitting..." : "Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}