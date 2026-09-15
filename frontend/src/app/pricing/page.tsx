import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "Try Zento AI with real customers, no card required.",
    features: [
      "50 AI replies on WhatsApp / month",
      "Up to 5 products or services",
      "Appointments & orders",
      "Notifications to you",
    ],
    cta: "Start free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "GHS 150",
    period: "/month",
    tagline: "For the business that's outgrown answering every message yourself.",
    features: [
      "Unlimited AI replies on WhatsApp",
      "Unlimited products or services",
      "Appointments & orders",
      "Notifications to you",
      "Priority WhatsApp number setup",
    ],
    cta: "Get started",
    href: "/signup?plan=growth",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "GHS 400",
    period: "/month",
    tagline: "For teams — more than one person needs to see what's happening.",
    features: [
      "Everything in Growth",
      "Same-day WhatsApp setup",
      "Multiple staff logins",
      "Dedicated support",
    ],
    cta: "Get started",
    href: "/signup?plan=pro",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zento-surface">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-zento-navy text-lg font-medium">
          Zento AI
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-10 pb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-medium text-zento-navy mb-4">
          Built for the restaurant owner who&apos;s cooking, not typing.
        </h1>
        <p className="text-black/60 text-lg max-w-xl mx-auto">
          The salon that can&apos;t answer the phone mid-appointment. The shop owner
          who loses orders overnight. Zento AI answers for you — pick the plan
          that matches how busy you already are.
        </p>
      </section>

      {/* Scarcity banner */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 mb-12">
        <div className="bg-zento-gold/10 border border-zento-gold/30 rounded-xl px-5 py-3 text-center">
          <p className="text-sm text-zento-gold-dark font-medium">
            Founding Business pricing — locked in for life, limited to the first 50 businesses.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 flex flex-col ${
                tier.highlighted
                  ? "bg-zento-navy text-white shadow-xl md:-translate-y-3"
                  : "bg-white border border-black/5"
              }`}
            >
              {tier.highlighted && (
                <span className="text-xs font-medium text-zento-gold-dark bg-zento-gold w-fit px-3 py-1 rounded-full mb-4">
                  Most businesses choose this
                </span>
              )}
              <h2 className={`text-lg font-medium mb-1 ${tier.highlighted ? "text-white" : "text-zento-navy"}`}>
                {tier.name}
              </h2>
              <p className={`text-sm mb-5 ${tier.highlighted ? "text-white/60" : "text-black/50"}`}>
                {tier.tagline}
              </p>
              <div className="mb-6">
                <span className="text-3xl font-medium">{tier.price}</span>
                <span className={`text-sm ${tier.highlighted ? "text-white/50" : "text-black/40"}`}>
                  {tier.period}
                </span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={tier.highlighted ? "text-zento-gold" : "text-zento-navy"}>✓</span>
                    <span className={tier.highlighted ? "text-white/80" : "text-black/70"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`text-sm font-medium text-center py-2.5 rounded-lg transition-opacity hover:opacity-90 ${
                  tier.highlighted
                    ? "bg-zento-gold text-zento-gold-dark"
                    : "bg-zento-navy text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison against the real alternative */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 text-center">
          <h2 className="text-2xl font-medium text-zento-navy mb-4">
            Cheaper than a hire. Faster than one, too.
          </h2>
          <p className="text-black/60 max-w-lg mx-auto">
            A customer service hire costs GHS 800–2,000+ a month, works eight
            hours a day, and still can&apos;t reply at 11pm. Zento AI costs less,
            never sleeps, and never has an off day.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="max-w-2xl mx-auto px-6 md:px-10 py-16 text-center">
        <h2 className="text-xl font-medium text-zento-navy mb-3">
          No contract. No risk.
        </h2>
        <p className="text-black/60">
          Cancel anytime. If Zento AI hasn&apos;t handled a real customer
          conversation for you in your first 7 days, we&apos;ll refund you —
          no questions asked.
        </p>
      </section>

      {/* Final CTA */}
      <section className="bg-zento-navy">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
            Your customers are already messaging you.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Give them someone to talk to, at any hour, without adding to your day.
          </p>
          <Link
            href="/signup"
            className="inline-block text-sm font-medium text-zento-gold-dark bg-zento-gold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get started free
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between text-xs text-black/40">
        <span>Zento AI</span>
        <span>Your AI employee for business.</span>
      </footer>
    </main>
  );
}