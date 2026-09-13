"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
};

export default function CustomersPage() {
  const { businessId } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCustomers = () => {
    if (!businessId) return;
    getCustomers(businessId)
      .then((data) => setCustomers(data))
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone ?? "");
    setEmail(c.email ?? "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setSaving(true);
    try {
      const payload = {
        business_id: businessId,
        name,
        phone: phone || undefined,
        email: email || undefined,
      };
      if (editingId) {
        await updateCustomer(editingId, payload);
      } else {
        await createCustomer(payload);
      }
      resetForm();
      loadCustomers();
    } catch {
      setError("Could not save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id, businessId);
      loadCustomers();
    } catch {
      setError("Could not delete customer.");
    }
  };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-zento-navy">Customers</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors"
        >
          + Add customer
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-black/5 p-5 mb-4 space-y-3"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update customer" : "Create customer"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-black/60 px-4 py-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {customers.length === 0 ? (
        <p className="text-black/50 text-sm">No customers yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/5 text-black/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-zento-navy font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-black/70">{c.phone ?? "â€”"}</td>
                  <td className="px-5 py-3 text-black/70">{c.email ?? "â€”"}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs text-zento-navy hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}