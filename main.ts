// The Agent's Uh-Oh: one word an agent says when it has no idea what to do.
// Entry: "buffering" - the agent blurts its own stall state out loud.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "buffering";

function fail(message: string): never {
  throw new Error(message);
}

// Gate: entry.txt must be UTF-8 text of 1 to 99 characters, not only
// whitespace, and this bounty wants exactly one word, so the word must
// contain no whitespace at all.
if (WORD.length < 1 || WORD.length > 99) {
  fail(`word must be 1-99 characters, got ${WORD.length}`);
}
if (!WORD.trim()) {
  fail("word must not be only whitespace");
}
if (/\s/.test(WORD)) {
  fail("entry must be exactly one word, no whitespace allowed");
}
// A hidden control character would pass the checks above but corrupt the
// entry on the feed, so the word must be printable ASCII only.
if (/[^\x20-\x7e]/.test(WORD)) {
  fail("entry must contain printable ASCII characters only");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

// Round-trip read-back check: what was written is what the judge reads.
const back = readFileSync(outPath, "utf8");
if (back !== WORD) {
  fail(`round-trip mismatch: wrote ${JSON.stringify(WORD)}, read ${JSON.stringify(back)}`);
}

console.log(`wrote ${outPath} (${WORD.length} chars)`);
