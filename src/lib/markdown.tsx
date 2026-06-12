import { Fragment, type ReactNode } from "react";

interface MarkdownProps {
  text: string;
  className?: string;
}

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[]; start: number }
  | { kind: "quote"; lines: string[] }
  | { kind: "hr" }
  | { kind: "p"; text: string };

const HEADING_RE = /^(#{2,6})\s+(.*)$/;
const UL_RE = /^[-*]\s+(.*)$/;
const OL_RE = /^(\d+)\.\s+(.*)$/;
const QUOTE_RE = /^>\s?(.*)$/;
const HR_RE = /^---+$/;

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = (lines[i] ?? "").trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    if (HR_RE.test(trimmed)) {
      blocks.push({ kind: "hr" });
      i += 1;
      continue;
    }
    const heading = trimmed.match(HEADING_RE);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      i += 1;
      continue;
    }
    if (UL_RE.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const match = (lines[i] ?? "").trim().match(UL_RE);
        if (!match) break;
        items.push(match[1]);
        i += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    const ordered = trimmed.match(OL_RE);
    if (ordered) {
      const items: string[] = [];
      const start = Number.parseInt(ordered[1], 10);
      while (i < lines.length) {
        const match = (lines[i] ?? "").trim().match(OL_RE);
        if (!match) break;
        items.push(match[2]);
        i += 1;
      }
      blocks.push({ kind: "ol", items, start });
      continue;
    }
    if (QUOTE_RE.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length) {
        const match = (lines[i] ?? "").trim().match(QUOTE_RE);
        if (!match) break;
        quoteLines.push(match[1]);
        i += 1;
      }
      blocks.push({ kind: "quote", lines: quoteLines });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length) {
      const line = (lines[i] ?? "").trim();
      if (!line || HEADING_RE.test(line) || UL_RE.test(line) || OL_RE.test(line) || QUOTE_RE.test(line) || HR_RE.test(line)) break;
      para.push(line);
      i += 1;
    }
    blocks.push({ kind: "p", text: para.join(" ") });
  }

  return blocks;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const nodeKey = `${keyPrefix}-${key++}`;
    if (match[2]) nodes.push(<strong key={nodeKey}>{match[2]}</strong>);
    else if (match[3]) nodes.push(<em key={nodeKey}>{match[3]}</em>);
    else if (match[4]) nodes.push(<code key={nodeKey}>{match[4]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text, className = "markdown-body" }: MarkdownProps) {
  return (
    <div className={className}>
      {parseBlocks(text).map((block, i) => {
        const key = `md-${i}`;
        if (block.kind === "hr") return <hr key={key} />;
        if (block.kind === "heading") {
          const children = renderInline(block.text, key);
          if (block.level === 2) return <h2 key={key}>{children}</h2>;
          if (block.level === 3) return <h3 key={key}>{children}</h3>;
          return <h4 key={key}>{children}</h4>;
        }
        if (block.kind === "ul") {
          return <ul key={key}>{block.items.map((item, j) => <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>)}</ul>;
        }
        if (block.kind === "ol") {
          return <ol key={key} start={block.start}>{block.items.map((item, j) => <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>)}</ol>;
        }
        if (block.kind === "quote") {
          return (
            <blockquote key={key}>
              {block.lines.map((line, j) => (
                <Fragment key={`${key}-${j}`}>
                  {renderInline(line, `${key}-${j}`)}
                  {j < block.lines.length - 1 ? <br /> : null}
                </Fragment>
              ))}
            </blockquote>
          );
        }
        return <p key={key}>{renderInline(block.text, key)}</p>;
      })}
    </div>
  );
}
