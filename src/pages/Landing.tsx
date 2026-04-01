import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CreditCalculator from '@/components/CreditCalculator';
import { formatINR, formatIndianNumber } from '@/lib/credit-utils';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function LiveWidget() {
  const [solarToday, setSolarToday] = useState(142.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSolarToday(prev => prev + 0.3 + Math.random() * 0.5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-5 max-w-sm w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="font-mono text-xs text-success font-medium">LIVE — Alur, Karnataka</span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Solar Generated Today</p>
          <p className="text-2xl font-heading font-bold text-foreground">{solarToday.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Credits Earned This Month</p>
          <p className="text-xl font-heading font-bold text-foreground">634</p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">Last Payout</p>
          <p className="text-lg font-heading font-bold text-accent">₹19,971 <span className="text-xs font-normal text-muted-foreground">to 47 households</span></p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const stat1 = useCountUp(640000);
  const stat2 = useCountUp(4);
  const stat3 = useCountUp(26000);

  const impactHH = useCountUp(47);
  const impactCredits = useCountUp(634);
  const impactPayout = useCountUp(19971);
  const impactCO2 = useCountUp(180);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="animate-slide-up">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Every Village Has Sunlight.{' '}
              <span className="text-primary">Most Don't Get Paid For It.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              GramCredit measures rural solar generation, bundles it into verified ESG credits,
              and pays villagers directly — while giving corporates BRSR-ready impact documentation.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#calculator" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Explore Villages →
              </a>
              <Link to="/register" className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Buy Credits as Corporate
              </Link>
            </div>

            {/* Stat row */}
            <div className="flex flex-wrap gap-8">
              <div ref={stat1.ref}>
                <p className="text-2xl font-heading font-bold text-foreground">{formatIndianNumber(stat1.count)}+</p>
                <p className="text-xs text-muted-foreground">Villages Addressable</p>
              </div>
              <div ref={stat2.ref}>
                <p className="text-2xl font-heading font-bold text-foreground">{stat2.count}–{stat2.count} hrs</p>
                <p className="text-xs text-muted-foreground">Daily Power Cuts</p>
              </div>
              <div ref={stat3.ref}>
                <p className="text-2xl font-heading font-bold text-foreground">₹{formatIndianNumber(stat3.count)} Cr</p>
                <p className="text-xs text-muted-foreground">CSR Spent Annually</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-fade-in">
            <LiveWidget />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-14">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'INSTALL', desc: 'Zero-upfront-cost rooftop solar via PM Surya Ghar (₹30,000–78,000 subsidy per household)', icon: '🏠' },
              { step: '02', title: 'MEASURE', desc: 'Energy meters record kWh. 10 kWh = 1 Solar Impact Credit.', icon: '📊' },
              { step: '03', title: 'CERTIFY', desc: 'Bundled across households. GPS-verified. BRSR-documented.', icon: '✅' },
              { step: '04', title: 'PAY', desc: '70% direct to household bank. 30% to GramCredit operations.', icon: '💰' },
            ].map(item => (
              <div key={item.step} className="relative">
                <span className="text-6xl font-heading font-extrabold opacity-10 absolute -top-4 -left-2">{item.step}</span>
                <div className="relative z-10 pt-8">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIT CALCULATOR */}
      <section id="calculator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Credit Calculator</h2>
          <p className="text-muted-foreground">See how much your village household could earn</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <CreditCalculator />
          <div className="text-center mt-6">
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Want to start earning? Register as a Villager →
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT NUMBERS */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div ref={impactHH.ref}>
            <p className="text-4xl font-heading font-extrabold">{impactHH.count}</p>
            <p className="text-sm opacity-80 mt-1">Households</p>
          </div>
          <div ref={impactCredits.ref}>
            <p className="text-4xl font-heading font-extrabold">{impactCredits.count}</p>
            <p className="text-sm opacity-80 mt-1">Credits Generated</p>
          </div>
          <div ref={impactPayout.ref}>
            <p className="text-4xl font-heading font-extrabold">{formatINR(impactPayout.count)}</p>
            <p className="text-sm opacity-80 mt-1">Paid Out</p>
          </div>
          <div ref={impactCO2.ref}>
            <p className="text-4xl font-heading font-extrabold">{impactCO2.count}</p>
            <p className="text-sm opacity-80 mt-1">Tonnes CO₂ Avoided</p>
          </div>
        </div>
      </section>

      {/* FOR CORPORATES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">For Corporates</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'BRSR Reporting', desc: 'Fully documented credits with village identity, GPS data, and audit trail for SEBI-mandated BRSR filings.', icon: '📋' },
            { title: 'Scope 2 Offsets', desc: 'Verified rural solar credits that directly offset your electricity-related carbon emissions.', icon: '⚡' },
            { title: 'ESG Storytelling', desc: 'Real villages, real people, real impact — powerful narratives for your sustainability reports.', icon: '📖' },
          ].map(item => (
            <div key={item.title} className="bg-card rounded-xl border border-border p-6 text-center">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/register" className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-block">
            Access the Marketplace →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-heading text-lg mb-2">Turning sunlight into livelihoods.</p>
          <p className="text-sm opacity-60">© 2026 GramCredit. Built at Acharya Ideathon 2026.</p>
        </div>
      </footer>
    </div>
  );
}
