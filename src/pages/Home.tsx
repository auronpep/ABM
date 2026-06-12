import { brand } from "../content/brand.ts";
import { scripture } from "../content/scripture.ts";
import { tearMethod, fellowship, finalCta } from "../content/home.ts";
import { pricing } from "../content/pricing.ts";
import { MiniDiagnostic } from "../components/MiniDiagnostic.tsx";
import { ScriptureBand, ScriptureInline } from "../components/ScriptureBand.tsx";
import type { PageProps } from "../types.ts";

export function Home({ navigate }: PageProps) {
  const startMini = () =>
    document.getElementById("mini-diag")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <main>
      {/* ============ HERO — the mini-diagnostic IS the product ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ {brand.hero.eyebrow}
              </div>
              <h1 className="display display-xl" style={{ maxWidth: "14ch" }}>
                Three questions. Three traps built for good people.
              </h1>
              <p className="lede">
                The MBE&rsquo;s most dangerous wrong answers don&rsquo;t exploit what you
                don&rsquo;t know. They exploit what&rsquo;s best in you — your sense of
                justice, your nose for the incriminating, your instinct for fairness.
              </p>
              <div className="hero-actions">
                <button className="btn btn-lg red" onClick={startMini}>
                  Start — no account needed <span className="arrow">→</span>
                </button>
              </div>
              <ScriptureInline verse={scripture.hero} />
            </div>

            <div id="mini-diag">
              <MiniDiagnostic onCta={() => navigate("diagnostic")} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ METHOD EXPLAINER ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {brand.thesis.label} · 01</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <h2 className="display display-lg" style={{ margin: 0, maxWidth: "16ch" }}>
              {brand.thesis.headline}
            </h2>
            <p className="body-lg" style={{ marginTop: 8 }}>
              {brand.thesis.body}
            </p>
          </div>
        </div>
      </section>

      {/* ============ DISCERNMENT SCRIPTURE ============ */}
      <ScriptureBand verse={scripture.method} />

      {/* ============ TEAR METHOD ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {tearMethod.eyebrow} · 02</span>
          </div>
          <p className="tear-line">
            The wrong answer usually carries just enough truth to survive a quick glance.{" "}
            <b>The TEAR Method teaches you to tear it apart</b> before it takes another point.
          </p>
          <div className="tear-grid" style={{ marginTop: 48 }}>
            {tearMethod.steps.map((s) => (
              <div className="tear-step" key={s.glyph}>
                <div className="glyph">{s.glyph}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <button className="btn btn-lg ghost" onClick={() => navigate("drills")}>
              Run a live Repair Drill <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============ PROOF BEFORE PRICE ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Proof Before Price · 03</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <h2 className="display display-md" style={{ margin: 0, maxWidth: "16ch" }}>
              The proof comes before the price.
            </h2>
            <div>
              <p className="body-lg" style={{ marginTop: 8 }}>
                The diagnostic is free because the method should prove itself first: you see
                it read your own answers back to you — naming the exact traps you fell for —
                before anyone asks you to pay.
              </p>
              <p className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginTop: 18 }}>
                <a href="/help.html">Questions? Read the FAQ →</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BE STRONG FELLOWSHIP ============ */}
      <section className="section dark">
        <div className="container">
          <div className="section-rule">
            <span className="label" style={{ color: "white" }}>▌ {fellowship.eyebrow} · 04</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <p className="fellowship-tagline">{fellowship.name}</p>
              <p className="fellowship-scripture">
                “{scripture.community.text}”
                <span className="ref">{scripture.community.ref} · KJV</span>
              </p>
            </div>
            <div>
              <p className="body-lg" style={{ color: "#d8d3c8" }}>{fellowship.body}</p>
              <p
                className="serif"
                style={{ fontSize: 22, fontWeight: 700, color: "white", marginTop: 24, maxWidth: "24ch" }}
              >
                {fellowship.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING TEASER ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {pricing.eyebrow} · 05</span>
          </div>
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 20px", maxWidth: "18ch" }}>
                {pricing.headline}
              </h2>
              <p className="pricing-note">{pricing.short}</p>
              <p className="mono" style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16 }}>
                BarMatrix Flagship — ${pricing.flagshipPrice} · {pricing.planLine}
              </p>
            </div>
            <div>
              <ScriptureInline verse={scripture.pricing} />
              <button
                className="btn btn-lg red"
                style={{ marginTop: 28 }}
                onClick={() => navigate("pricing")}
              >
                See Pricing <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <div className="container">
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>▌ {finalCta.eyebrow}</div>
              <h2 className="display display-lg" style={{ color: "white", margin: "0 0 20px", maxWidth: "16ch" }}>
                {finalCta.headline}
              </h2>
              <p style={{ fontSize: 19, color: "#c8c4ba", lineHeight: 1.5, marginBottom: 32, maxWidth: "40ch" }}>
                {finalCta.body}
              </p>
              <button className="btn btn-lg red" onClick={() => navigate("diagnostic")}>
                {finalCta.cta} <span className="arrow">→</span>
              </button>
            </div>
            <div>
              <p className="fellowship-scripture" style={{ borderLeftColor: "var(--red)" }}>
                “{scripture.finalCta.text}”
                <span className="ref">{scripture.finalCta.ref} · KJV</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
