const fs = require("fs");
const ts = require("typescript");

const enums = parseEnums("./src/enum/index.ts");

let INDEX_MD = "";
let BODY_MD = "";

for (const e of enums) {
  const esc = toSpace(e.name);

  INDEX_MD += "- [" + esc + "](#" + toUrl(esc + "-" + toUrl(e.name)) + ")";

  BODY_MD += "## " + esc;
  BODY_MD +=
    " <sub><sup>[" +
    e.name +
    "](./src/enum/index.ts#L" +
    e.line +
    ")</sup></sub>\n\n";

  if (e.comment) {
    INDEX_MD += ", " + e.comment.trim();
    BODY_MD += e.comment + "\n";
  }

  INDEX_MD += "\n";

  BODY_MD += "<table>\n";
  for (const m of e.members) {
    BODY_MD +=
      "<tr><td>" +
      toSpace(m.name) +
      (m.comment ? " (" + m.comment + ")" : "") +
      "</td><td>" +
      m.value +
      "</td></tr>\n";
  }
  BODY_MD += "\n</table>\n\n";
}

let README_MD =
  "<small><sup>This file is generated from the source code. Do not edit directly, use `npm run docs`</sup></small>\n\n";
README_MD += "# Statuses and types\n\n";

README_MD += INDEX_MD;
README_MD += BODY_MD;

fs.writeFileSync("./README.md", README_MD);

function parseEnums(path) {
  const file = ts.createProgram([path], { allowJs: true }).getSourceFile(path);

  if (!file) {
    throw new Error("file not found");
  }

  const fulltext = file.getFullText();

  /**
   * @type {{
   *     name: string;
   *     line: number;
   *     comment?: string;
   *     members: {
   *         name: string;
   *         value: string;
   *         comment?: string;
   *     }[];
   * }[]}
   */
  const result = [];

  function visit(node, nest = 0) {
    node.forEachChild((node) => {
      const isEnumDeclaration = ts.isEnumDeclaration(node);
      const isEnumMember = ts.isEnumMember(node);

      if (!isEnumDeclaration && !isEnumMember) {
        return;
      }

      const name = node.name.getText(file);

      const commentRange =
        ts.getLeadingCommentRanges(fulltext, node.getFullStart()) || [];

      let comment;

      if (commentRange?.length) {
        comment = commentRange
          .map((r) => cleanComment(fulltext.slice(r.pos, r.end)))
          .join(" ");
      }

      if (isEnumDeclaration) {
        const line =
          ts.getLineAndCharacterOfPosition(file, node.getStart(file)).line + 1;

        result.push({
          name,
          line,
          comment,
          members: [],
        });
      }

      if (isEnumMember) {
        const value = node.initializer?.getText(file) || "";

        result[result.length - 1].members.push({
          name,
          value,
          comment,
        });
      }

      visit(node, nest + 1);
    });
  }

  visit(file);

  return result;
}

function cleanComment(comment) {
  return comment.replace(/(^ *\/+\** *|\**\/|\n *\*)/g, "").trim();
}

function toSpace(str) {
  return str
    .replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, "$1$4 $2$3$5")
    .replace("_", " ");
}

function toUrl(str) {
  return str.toLowerCase().replace(/ /g, "-");
}
