import { brand } from "../content/brand.ts";
import { scripture } from "../content/scripture.ts";
import {
  tearMethod,
  productSystem,
  worldBuilding,
  whoItsFor,
  fellowship,
  encouragement,
  finalCta,
} from "../content/home.ts";
import { pricing } from "../content/pricing.ts";
import { ForensicsDemo } from "../components/ForensicsDemo.tsx";
import { ScriptureBand, ScriptureInline } from "../components/ScriptureBand.tsx";
import type { PageProps } from "../types.ts";

export function Home({ navigate }: PageProps) {
  const seeDemo = () =>
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ {brand.hero.eyebrow}
              </div>
              <h1 className="display display-xl">{brand.hero.headline}</h1>
              <p className="lede">{brand.hero.subhead}</p>
              <div className="hero-actions">
                <button className="btn btn-lg red" onClick={() => navigate("diagnostic")}>
                  {brand.hero.ctaPrimary} <span className="arrow">→</span>
                </button>
                <button className="btn btn-lg ghost" onClick={seeDemo}>
                  {brand.hero.ctaSecondary}
                </button>
              </div>
              <ScriptureInline verse={scripture.hero} />
            </div>

            <div id="demo">
              <ForensicsDemo autoplay={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ COUNTERFEIT THESIS ============ */}
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
        </div>
      </section>

      {/* ============ PRODUCT SYSTEM ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {productSystem.eyebrow} · 03</span>
          </div>
          <h2 className="display display-md" style={{ margin: "0 0 40px", maxWidth: "22ch" }}>
            {productSystem.headline}
          </h2>
          <div className="system-flow">
            {productSystem.nodes.map((n) => (
              <div className="system-node" key={n.step}>
                <div className="step">{n.step}</div>
                <h4>{n.title}</h4>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHRISTIAN WORLD-BUILDING ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {worldBuilding.eyebrow} · 04</span>
          </div>
          <div className="two-col" style={{ alignItems: "start", marginBottom: 48 }}>
            <h2 className="display display-md" style={{ margin: 0, maxWidth: "16ch" }}>
              {worldBuilding.headline}
            </h2>
            <p className="body-lg" style={{ marginTop: 8 }}>
              {worldBuilding.body}
            </p>
          </div>
          <div className="three-col">
            {worldBuilding.scenes.map((s) => (
              <div className="worldbuild-card" key={s.name}>
                <p className="scene">{s.scene}</p>
                <p className="ruling">
                  <b>{s.name}</b> — {s.area}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {whoItsFor.eyebrow} · 05</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <h2 className="display display-md" style={{ margin: 0, maxWidth: "14ch" }}>
              {whoItsFor.headline}
            </h2>
            <ul className="for-list">
              {whoItsFor.items.map((t) => (
                <li key={t}>
                  <span className="check">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ BE STRONG FELLOWSHIP ============ */}
      <section className="section dark">
        <div className="container">
          <div className="section-rule">
            <span className="label" style={{ color: "white" }}>▌ {fellowship.eyebrow} · 06</span>
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
            <span className="label">▌ {pricing.eyebrow} · 07</span>
          </div>
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 20px", maxWidth: "18ch" }}>
                {pricing.headline}
              </h2>
              <p className="pricing-note">{pricing.short}</p>
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

      {/* ============ ENCOURAGEMENT ============ */}
      <section className="section alt">
        <div className="container">
          <div className="encourage">
            <p className="line">{encouragement.line}</p>
            <p className="sub">{encouragement.sub}</p>
            <div style={{ display: "inline-block", marginTop: 28, textAlign: "left" }}>
              <ScriptureInline verse={scripture.anxiety} />
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
