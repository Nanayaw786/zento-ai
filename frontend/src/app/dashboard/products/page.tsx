"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  is_available: boolean;
};

export default function ProductsPage() {
  const { businessId } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    if (!businessId) return;
    getProducts(businessId)
      .then((data) => setProducts(data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setIsAvailable(true);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description ?? "");
    setPrice(p.price);
    setIsAvailable(p.is_available);
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
        description: description || undefined,
        price: parseFloat(price),
        is_available: isAvailable,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
      loadProducts();
    } catch {
      setError("Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id, businessId);
      loadProducts();
    } catch {
      setError("Could not delete product.");
    }
  };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-zento-navy">Products & Services</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors"
        >
          + Add product
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
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-xs font-medium text-black/60 mb-1">Price (GHS)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black/60 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-black/70">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
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

      {products.length === 0 ? (
        <p className="text-black/50 text-sm">No products yet. Add your first one above.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/5 text-black/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-zento-navy font-medium">{p.name}</p>
                    {p.description && (
                      <p className="text-black/40 text-xs">{p.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-black/70">GHS {p.price}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs text-zento-navy hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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