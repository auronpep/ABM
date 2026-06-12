import { brand } from "../content/brand.ts";
import { fellowship } from "../content/home.ts";
import { scripture } from "../content/scripture.ts";
import { pricing } from "../content/pricing.ts";
import { dailyVerse } from "../lib/verses.ts";
import type { PageProps } from "../types.ts";

export function Footer({ navigate }: PageProps) {
  const daily = dailyVerse(); // date-seeded — same verse for every visitor today
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "white", marginBottom: 16 }}>
              <span className="mark">B</span>
              <span>
                {brand.name}
                <span className="dot" />
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "#a39e93", maxWidth: "34ch", margin: 0 }}>
              {brand.positioning}
            </p>
          </div>

          <div>
            <h5>The Work</h5>
            <ul>
              <li><button onClick={() => navigate("how-it-works")}>The TEAR Method</button></li>
              <li><button onClick={() => navigate("drills")}>Repair Drills</button></li>
              <li><button onClick={() => navigate("diagnostic")}>The Diagnostic</button></li>
              <li><button onClick={() => navigate("pricing")}>Pricing</button></li>
              <li><a href="/help.html">Help</a></li>
            </ul>
          </div>

          <div>
            <h5>{fellowship.name}</h5>
            <ul>
              <li style={{ color: "#a39e93", lineHeight: 1.5 }}>{fellowship.tagline}</li>
              <li><button onClick={() => navigate("prayer-chain")}>Exam-Day Prayer Chain</button></li>
              <li><button onClick={() => navigate("prayer")}>Prayer Requests</button></li>
              <li style={{ color: "#8b8576", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
                {scripture.community.ref}
              </li>
            </ul>
          </div>

          <div>
            <h5>Account</h5>
            <ul>
              <li><a href="/login.html">Sign in</a></li>
              <li><a href="/checkout.html">Enroll</a></li>
            </ul>
          </div>
        </div>

        <blockquote className="fellowship-scripture" style={{ marginTop: 40 }}>
          {daily.text}
          <span className="ref">{daily.ref} · KJV · Today&rsquo;s verse</span>
        </blockquote>

        <p className="disclaimer">{pricing.honesty} {brand.closingLine}</p>

        <div className="footer-bottom">
          <span>© {brand.name} · {brand.domain}</span>
          <span>Judge righteous judgment.</span>
        </div>
      </div>
    </footer>
  );
}
