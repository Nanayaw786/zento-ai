"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminStats, getAdminBusinesses } from "@/lib/api";

type Stats = {
  total_businesses: number;
  total_customers: number;
  total_orders: number;
  total_appointments: number;
  total_conversations: number;
  businesses_with_whatsapp: number;
};

type BusinessRow = {
  id: string;
  name: string;
  email: string;
  business_type: string | null;
  phone: string | null;
  whatsapp_connected: boolean;
  order_count: number;
  customer_count: number;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("zento_admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    Promise.all([getAdminStats(token), getAdminBusinesses(token)])
      .then(([statsData, businessesData]) => {
        setStats(statsData);
        setBusinesses(businessesData);
      })
      .catch(() => {
        localStorage.removeItem("zento_admin_token");
        router.push("/admin");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("zento_admin_token");
    router.push("/admin");
  };

  if (loading) return <div className="min-h-screen bg-zento-surface" />;

  return (
    <div className="min-h-screen bg-zento-surface p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-zento-navy">Zento AI — Platform Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-black/50 hover:text-black/80"
          >
            Sign out
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Businesses", value: stats.total_businesses },
              { label: "With WhatsApp", value: stats.businesses_with_whatsapp },
              { label: "Customers", value: stats.total_customers },
              { label: "Orders", value: stats.total_orders },
              { label: "Appointments", value: stats.total_appointments },
              { label: "Conversations", value: stats.total_conversations },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-black/5 p-4">
                <p className="text-black/50 text-xs mb-1">{s.label}</p>
                <p className="text-zento-navy text-2xl font-medium">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-sm font-medium text-zento-navy mb-3">All Businesses</h2>
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/5 text-black/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">WhatsApp</th>
                <th className="px-5 py-3 font-medium">Customers</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-zento-navy font-medium">{b.name}</td>
                  <td className="px-5 py-3 text-black/70">{b.email}</td>
                  <td className="px-5 py-3 text-black/70">{b.business_type ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.whatsapp_connected
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {b.whatsapp_connected ? "Connected" : "Not connected"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-black/70">{b.customer_count}</td>
                  <td className="px-5 py-3 text-black/70">{b.order_count}</td>
                  <td className="px-5 py-3 text-black/50">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}