#!/usr/bin/env node
import { Command as u } from "commander";
import v, { readFileSync as $ } from "fs";
import { dirname as M, join as w } from "path";
import { fileURLToPath as C } from "url";
import b from "mermaid";
import p from "chalk";
import { marked as E } from "marked";
let h = !1;
async function S() {
  h || (b.initialize({
    startOnLoad: !1,
    theme: "default",
    securityLevel: "loose"
  }), h = !0);
}
async function x(e, n) {
  try {
    return await S(), await b.parse(e), { isValid: !0 };
  } catch (i) {
    const a = i instanceof Error ? i.message : String(i);
    return a.includes("DOMPurify") && (a.includes("is not a function") || a.includes("is not defined") || a.includes("sanitize")) ? { isValid: !0 } : {
      isValid: !1,
      error: a
    };
  }
}
const r = {
  success: (e) => {
    console.log(p.green(e));
  },
  error: (e) => {
    console.error(p.red(e));
  },
  info: (e) => {
    console.info(p.blue(e));
  }
};
function V(e) {
  const n = [];
  let i = 0;
  const a = E.lexer(e), t = e.split(`
`);
  for (const c of a)
    if (c.type === "code" && (c.lang === "mermaid" || c.lang?.startsWith("mermaid"))) {
      const l = c.text.trim();
      if (l.length > 0) {
        let s = 0, d = 0;
        for (let o = 0; o < t.length; o++) {
          const k = t[o].trim();
          if (k === "```mermaid" || k.startsWith("```mermaid ")) {
            s = o + 2;
            for (let m = o + 1; m < t.length; m++)
              if (t[m].trim() === "```") {
                d = m;
                break;
              }
            if (t.slice(o + 1, d).join(`
`).trim() === l) {
              n.push({
                content: l,
                lineStart: s,
                lineEnd: d,
                blockIndex: i++
              });
              break;
            }
          }
        }
      }
    }
  return n;
}
const T = new u("validate").description("Validate a Mermaid diagram from file or string").arguments("[input]").option("-t, --type <diagramType>", "The type of the Mermaid diagram").option("-s, --string", "Treat input as diagram string instead of file path").action(async (e, n) => {
  try {
    let i;
    if (e || (r.error("Please provide either a file path or diagram string"), process.exit(1)), n.string)
      i = e;
    else
      try {
        i = v.readFileSync(e, "utf-8");
      } catch (t) {
        r.error(`Error reading file: ${t.message}`), r.info("Tip: Use --string flag if you want to validate a diagram string directly"), process.exit(1);
      }
    const a = await x(i, n.type);
    a.isValid ? r.success("Mermaid diagram is valid.") : (r.error("Mermaid diagram is invalid:"), a.error && r.error(a.error), process.exit(1));
  } catch (i) {
    r.error("An unexpected error occurred:"), r.error(i.message), process.exit(1);
  }
}), F = new u("validate-md").description("Validate all Mermaid diagrams in a Markdown file").arguments("<filePath>").option("--fail-fast", "Stop validation on first error").action(async (e, n) => {
  try {
    let i;
    try {
      i = v.readFileSync(e, "utf-8");
    } catch (s) {
      r.error(`Error reading file: ${s.message}`), process.exit(1);
    }
    const a = V(i);
    if (a.length === 0) {
      r.info("No Mermaid code blocks found in the Markdown file.");
      return;
    }
    r.info(`Found ${a.length} Mermaid code block(s) in ${e}`);
    let t = !1, c = 0, l = 0;
    for (const s of a) {
      const d = `Block ${s.blockIndex + 1} (lines ${s.lineStart}-${s.lineEnd})`;
      try {
        const o = await x(s.content);
        if (o.isValid)
          r.success(`✅ ${d}: Valid`), c++;
        else if (r.error(`❌ ${d}: Invalid`), o.error && r.error(`   Error: ${o.error}`), l++, t = !0, n.failFast) {
          r.error("Stopping validation due to --fail-fast flag");
          break;
        }
      } catch (o) {
        if (r.error(`❌ ${d}: Validation failed`), r.error(`   Error: ${o.message}`), l++, t = !0, n.failFast) {
          r.error("Stopping validation due to --fail-fast flag");
          break;
        }
      }
    }
    r.info(`
Validation Summary:`), r.info(`  Total blocks: ${a.length}`), r.success(`  Valid: ${c}`), l > 0 && r.error(`  Invalid: ${l}`), t ? process.exit(1) : r.success("All Mermaid diagrams are valid! 🎉");
  } catch (i) {
    r.error("An unexpected error occurred:"), r.error(i.message), process.exit(1);
  }
}), I = C(import.meta.url), j = M(I), y = w(j, "..", "package.json");
let f;
try {
  f = JSON.parse($(y, "utf-8"));
} catch {
  console.error(`Error: Could not read package.json from ${y}`), console.error("This is likely a packaging issue. Please reinstall the package."), process.exit(1);
}
const g = new u();
g.name(f.name).description(f.description).version(f.version);
g.addCommand(T);
g.addCommand(F);
g.parse(process.argv);
