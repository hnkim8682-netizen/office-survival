export type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "fn"
  | "type"
  | "plain"
  | "punct";

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "import", "from", "export", "default",
  "async", "await", "if", "else", "for", "while", "type", "interface", "extends",
  "new", "class", "try", "catch", "throw", "of", "in", "as", "null", "undefined",
  "true", "false", "void", "this", "=>", "use", "client", "server",
]);

const RULES: Array<[RegExp, TokenKind]> = [
  [/^\/\/[^\n]*/, "comment"],
  [/^`[^`]*`/, "string"],
  [/^"[^"]*"/, "string"],
  [/^'[^']*'/, "string"],
  [/^\d+(?:\.\d+)?/, "number"],
  [/^[A-Za-z_$][\w$]*(?=\()/, "fn"],
  [/^[A-Z][\w$]*/, "type"],
  [/^[A-Za-z_$][\w$]*/, "plain"],
  [/^\s+/, "plain"],
  [/^./, "punct"],
];

/** Tiny front-to-back tokenizer — enough to *look* like syntax highlighting. */
export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  while (rest.length > 0) {
    let matched = false;

    for (const [pattern, kind] of RULES) {
      const match = pattern.exec(rest);
      if (!match) continue;

      const text = match[0];
      const resolved: TokenKind = kind === "plain" && KEYWORDS.has(text.trim()) ? "keyword" : kind;
      tokens.push({ text, kind: resolved });
      rest = rest.slice(text.length);
      matched = true;
      break;
    }

    if (!matched) {
      tokens.push({ text: rest, kind: "plain" });
      break;
    }
  }

  return tokens;
}

/** VS Code Dark+ palette — deliberately fixed, independent of the site theme. */
export const TOKEN_COLORS: Record<TokenKind, string> = {
  comment: "#6a9955",
  string: "#ce9178",
  keyword: "#569cd6",
  number: "#b5cea8",
  fn: "#dcdcaa",
  type: "#4ec9b0",
  plain: "#9cdcfe",
  punct: "#d4d4d4",
};
