"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getOrders, getCustomers, createOrder, updateOrderStatus } from "@/lib/api";

type Order = {
  id: string;
  customer_id: string;
  total: string;
  status: string;
};

type Customer = {
  id: string;
  name: string;
};

const statusOptions = ["pending", "in progress", "completed", "cancelled"];

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { businessId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [total, setTotal] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    if (!businessId) return;
    Promise.all([getOrders(businessId), getCustomers(businessId)])
      .then(([ordersData, customersData]) => {
        setOrders(ordersData);
        setCustomers(customersData);
      })
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? "Unknown customer";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !customerId) return;
    setSaving(true);
    try {
      await createOrder({
        business_id: businessId,
        customer_id: customerId,
        total: parseFloat(total),
        status: "pending",
      });
      setCustomerId("");
      setTotal("");
      setShowForm(false);
      loadData();
    } catch {
      setError("Could not create order.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!businessId) return;
    try {
      await updateOrderStatus(orderId, businessId, newStatus);
      loadData();
    } catch {
      setError("Could not update order status.");
    }
  };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-zento-navy">Orders</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors"
        >
          + New order
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-black/5 p-5 mb-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Customer</label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Total (GHS)</label>
              <input
                type="number"
                step="0.01"
                required
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create order"}
          </button>
        </form>
      )}

      {orders.length === 0 ? (
        <p className="text-black/50 text-sm">No orders yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/5 text-black/50">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-zento-navy font-medium">
                    {customerName(o.customer_id)}
                  </td>
                  <td className="px-5 py-3 text-black/70">GHS {o.total}</td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor[o.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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