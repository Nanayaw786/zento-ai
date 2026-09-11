"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getConversations, getCustomers } from "@/lib/api";

type Conversation = {
  id: string;
  customer_id: string;
  last_message: string;
  channel: string;
};

type Customer = {
  id: string;
  name: string;
};

export default function ConversationsPage() {
  const { businessId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([getConversations(businessId), getCustomers(businessId)])
      .then(([conversationsData, customersData]) => {
        setConversations(conversationsData);
        setCustomers(customersData);
      })
      .catch(() => setError("Could not load conversations."))
      .finally(() => setLoading(false));
  }, [businessId]);

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? "Unknown customer";

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-medium text-zento-navy mb-4">Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-black/50 text-sm">No conversations yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
          {conversations.map((c) => (
            <div key={c.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-zento-navy font-medium text-sm">{customerName(c.customer_id)}</p>
                <p className="text-black/50 text-sm">{c.last_message}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-zento-navy/5 text-zento-navy">
                {c.channel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}