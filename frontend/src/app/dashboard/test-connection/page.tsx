"use client";

import { useEffect, useState } from "react";
import { getBusinesses } from "@/lib/api";

type Business = {
  id: string;
  name: string;
  email: string;
  business_type: string | null;
  created_at: string;
};

export default function TestConnectionPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBusinesses()
      .then((data) => setBusinesses(data))
      .catch(() => setError("Could not reach the backend."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-medium text-zento-navy mb-4">
        Live Businesses (from backend)
      </h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {businesses.map((b) => (
          <div key={b.id} className="px-5 py-3">
            <p className="text-zento-navy font-medium text-sm">{b.name}</p>
            <p className="text-black/50 text-sm">{b.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}