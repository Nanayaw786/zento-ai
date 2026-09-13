"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getOrders, getConversations } from "@/lib/api";

export default function DashboardPage() {
  const { businessId } = useAuth();
  const [ordersCount, setOrdersCount] = useState(0);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([getOrders(businessId), getConversations(businessId)])
      .then(([orders, conversations]) => {
        setOrdersCount(orders.length);
        setConversationsCount(conversations.length);
      })
      .finally(() => setLoading(false));
  }, [businessId]);

  const stats = [
    { label: "Total orders", value: loading ? "â€”" : String(ordersCount) },
    { label: "Total conversations", value: loading ? "â€”" : String(conversationsCount) },
    { label: "Revenue today", value: "GHS 0" },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-zento-navy mb-4">Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-black/5 p-5">
            <p className="text-black/50 text-xs mb-2">{s.label}</p>
            <p className="text-zento-navy text-2xl font-medium">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-5">
        <p className="text-sm text-black/50">
          This is your live business overview, powered by real data.
        </p>
      </div>
    </div>
  );
}