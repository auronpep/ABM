import { pricing } from "../content/pricing.ts";
import { scripture } from "../content/scripture.ts";
import { ScriptureInline } from "../components/ScriptureBand.tsx";
import type { PageProps } from "../types.ts";

export function Pricing({ navigate }: PageProps) {
  return (
    <main>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>▌ {pricing.eyebrow}</div>
          <h1 className="display display-xl" style={{ maxWidth: "20ch" }}>
            {pricing.headline}
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <p className="pricing-note" style={{ marginBottom: 24 }}>{pricing.short}</p>
              <p className="pricing-note">{pricing.long}</p>
              <ScriptureInline verse={scripture.pricing} />
              <p
                className="mono"
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 32, lineHeight: 1.6, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {pricing.honesty}
              </p>
            </div>

            <div className="price-card flagship">
              <div className="ribbon">Flagship</div>
              <div className="name">BarMatrix</div>
              <p className="summary" style={{ color: "var(--muted-light)" }}>
                MBE wrong-answer diagnosis, forensics, and a guided Repair Path — with Be Strong Fellowship.
              </p>
              <div className="price">
                <span className="num">${pricing.flagshipPrice}</span>
              </div>
              <div className="plan">{pricing.planLine}</div>
              <ul>
                {pricing.includes.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <button className="btn btn-lg red" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("diagnostic")}>
                Start the Free Diagnostic <span className="arrow">→</span>
              </button>
              <a
                className="mono"
                href="/checkout.html"
                style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted-light)" }}
              >
                Ready to enroll? →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
