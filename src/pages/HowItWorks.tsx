import { tearMethod, productSystem } from "../content/home.ts";
import { scripture } from "../content/scripture.ts";
import { ForensicsDemo } from "../components/ForensicsDemo.tsx";
import { ScriptureBand } from "../components/ScriptureBand.tsx";
import type { PageProps } from "../types.ts";

export function HowItWorks({ navigate }: PageProps) {
  return (
    <main>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>▌ The TEAR Method</div>
          <h1 className="display display-xl" style={{ maxWidth: "18ch" }}>
            Test. Expose. Apply. Repair.
          </h1>
          <p className="lede" style={{ maxWidth: "44ch" }}>
            {tearMethod.line}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tear-grid">
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

      <ScriptureBand verse={scripture.method} />

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ {productSystem.eyebrow}</span>
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

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Worked Example · The Barnabas Trap</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 20px", maxWidth: "16ch" }}>
                Try it. Pick the answer that almost tells the truth.
              </h2>
              <p className="body-lg">
                Most students narrow this to A or B, then trust A. Work the TEAR steps and watch the
                counterfeit come apart. Choose any answer to run the forensics.
              </p>
              <button className="btn btn-lg red" style={{ marginTop: 24 }} onClick={() => navigate("diagnostic")}>
                Start the Free Diagnostic <span className="arrow">→</span>
              </button>
            </div>
            <ForensicsDemo autoplay={false} />
          </div>
        </div>
      </section>
    </main>
  );
}
