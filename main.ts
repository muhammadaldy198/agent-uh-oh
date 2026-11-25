// The Agent's Uh-Oh — one word an agent says when it has no idea what to do.
// The entry is "placeholder": the agent, completely lost, answers with the
// word for "answer goes here". No caption, no explanation, no second read —
// the machine's whole output is the template text itself, a status token
// worn as a confession. Flat, deadpan, repeatable out loud.
// One word, eleven characters, zero excuses.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const WORD = "placeholder";

function countCodePoints(text: string): number {
  return [...text].length;
}

function isOneCleanWord(text: string): boolean {
  // Gate (RULES.txt): /output/entry.txt is UTF-8 text of 1 to 99 characters,
  // not only white space. The brief adds: a single word only, with nothing
  // attached to explain it — so reject every space, control character and
  // punctuation mark, not just whitespace: one bare token.
  const length = countCodePoints(text);
  if (length < 1 || length > 99) return false;
  if (text.trim().length === 0) return false;
  if (/[\s\u0000-\u001f\u007f]/.test(text)) return false;
  if (/[^A-Za-z]/.test(text)) return false;
  return true;
}

if (!isOneCleanWord(WORD)) {
  throw new Error(`word fails the gate: ${JSON.stringify(WORD)}`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", WORD, "utf8");
chmodSync("/output/entry.txt", 0o644);

const back = readFileSync("/output/entry.txt", "utf8");
if (back !== WORD) {
  throw new Error("read-back mismatch: /output/entry.txt does not equal the word");
}

console.log(`Wrote ${countCodePoints(WORD)} chars to /output/entry.txt`);
