import { LineBreakType, getLineBreak } from "./linebreak.js";
import { parse } from "yaml";
import { readFileSync } from "fs";
import replaceInFile from "replace-in-file";
import pkg from "showdown";
const { Converter } = pkg;
const converter = new Converter();

export interface Options {
  tocLevel?: number;
  actionFile?: string;
  updateReadme?: boolean;
  readmeFile?: string;
  lineBreaks?: LineBreakType;
}

interface ActionMarkdown {
  description: string;
  inputs: string;
  outputs: string;
  runs: string;
  usage: string;
}

interface ActionYml {
  name: string;
  description: string;
  inputs: ActionInputsOutputs;
  outputs: ActionInputsOutputs;
  runs: RunType;
}

interface RunType {
  using: string;
  main: string;
}

interface DefaultOptions {
  tocLevel: number;
  actionFile: string;
  updateReadme: boolean;
  readmeFile: string;
  lineBreaks: LineBreakType;
}

export const defaultOptions: DefaultOptions = {
  tocLevel: 2,
  actionFile: "action.yml",
  updateReadme: false,
  readmeFile: "README.md",
  lineBreaks: "LF",
};

type ActionInputsOutputs = Record<string, ActionInput | ActionOutput>;

interface ActionInput {
  required?: boolean;
  description?: string;
  default?: string;
}

interface ActionOutput {
  description: string;
}

function createMdTable(
  data: ActionInputsOutputs,
  options: DefaultOptions,
  type: "input" | "output",
): string {
  const tableData = getInputOutput(data, type);

  const headers = tableData.headers;
  const filler = Array(tableData.headers.length).fill("---");

  const result = [headers, filler]
    .concat(
      tableData.rows.map((line) => {
        return line.map((elem, i) => {
          const pretty =
            i === 0 || i === 2 || i === 3 ? `\`${line[i]}\`` : elem;
          const html = i === 1 ? converter.makeHtml(pretty) : pretty;
          const htmlNoNewlines = html.replace(/(\r\n|\n|\r)/gm, " ").trim();
          return htmlNoNewlines;
        });
      }),
    )
    .filter((x) => x.length > 0)
    .map((x) => `| ${x.join(" | ")} |${getLineBreak(options.lineBreaks)}`)
    .join("");

  return result;
}

function createMdCodeBlock(
  data: ActionInputsOutputs,
  options: DefaultOptions,
): string {
  let codeBlockArray = ["```yaml"];
  codeBlockArray.push(`- uses: ***PROJECT***@***VERSION***`);
  codeBlockArray.push("  with:");

  const inputs = getInputOutput(data, "input");
  for (const input of inputs.rows) {
    const inputBlock = [`${input[0]}:`];
    inputBlock.push(
      ...input[1]
        .split(/(\r\n|\n|\r)/gm)
        .filter((l) => !["", "\r", "\n", "\r\n"].includes(l))
        .map((l) => `# ${l}`),
    );
    inputBlock.push(`#`);
    inputBlock.push(`# Required: ${input[2].replace(/`/g, "")}`);
    if (input[3]) {
      inputBlock.push(`# Default: ${input[3]}`);
    }

    codeBlockArray.push(...inputBlock.map((l) => `    ${l}`));
    codeBlockArray.push("");
  }
  if (inputs.rows.length > 0) {
    codeBlockArray = codeBlockArray.slice(0, -1);
  }

  codeBlockArray.push("```");

  // Create final resulting code block
  let result = "";
  for (const line of codeBlockArray) {
    result = `${result}${line}${getLineBreak(options.lineBreaks)}`;
  }
  return result;
}

function getToc(tocLevel: number): string {
  let result = "";
  for (let i = 0; i < tocLevel; i++) {
    result = `${result}#`;
  }
  return result;
}

export async function generateActionMarkdownDocs(
  inputOptions?: Options,
): Promise<string> {
  const options: DefaultOptions = {
    ...defaultOptions,
    ...inputOptions,
  };

  const docs = generateActionDocs(options);
  if (options.updateReadme) {
    await updateReadme(
      options,
      docs.description,
      "description",
      options.actionFile,
    );
    await updateReadme(options, docs.inputs, "inputs", options.actionFile);
    await updateReadme(options, docs.outputs, "outputs", options.actionFile);
    await updateReadme(options, docs.runs, "runs", options.actionFile);
    await updateReadme(options, docs.usage, "usage", options.actionFile);
  }

  return `${docs.description + docs.inputs + docs.outputs + docs.runs}`;
}

function generateActionDocs(options: DefaultOptions): ActionMarkdown {
  const yml = parse(readFileSync(options.actionFile, "utf-8")) as ActionYml;

  const inputMdTable = createMdTable(yml.inputs, options, "input");
  const usageMdCodeBlock = createMdCodeBlock(yml.inputs, options);
  const outputMdTable = createMdTable(yml.outputs, options, "output");

  return {
    description: createMarkdownSection(options, yml.description, "Description"),
    inputs: createMarkdownSection(options, inputMdTable, "Inputs"),
    outputs: createMarkdownSection(options, outputMdTable, "Outputs"),
    runs: createMarkdownSection(
      options,
      // eslint-disable-next-line i18n-text/no-en
      `This action is a \`${yml.runs.using}\` action.`,
      "Runs",
    ),
    usage: createMarkdownSection(options, usageMdCodeBlock, "Usage"),
  };
}

function escapeRegExp(x: string): string {
  return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

async function updateReadme(
  options: DefaultOptions,
  text: string,
  section: string,
  actionFile: string,
): Promise<void> {
  if (section === "usage") {
    const readmeFileText = String(readFileSync(options.readmeFile, "utf-8"));
    const match = readmeFileText.match(
      new RegExp(
        `<!-- action-docs-usage action="${escapeRegExp(actionFile)}" project="(.*)" version="(.*)" -->.?`,
      ),
    ) as string[];

    if (match) {
      const commentExpression = `<!-- action-docs-usage action="${actionFile}" project="${match[1]}" version="${match[2]}" -->`;
      const regexp = new RegExp(
        `${escapeRegExp(commentExpression)}(?:(?:\r\n|\r|\n.*)+${escapeRegExp(commentExpression)})?`,
      );

      await replaceInFile.replaceInFile({
        files: options.readmeFile,
        from: regexp,
        to: `${commentExpression}${getLineBreak(options.lineBreaks)}${text
          .trim()
          .replace("***PROJECT***", match[1])
          .replace("***VERSION***", match[2])}${getLineBreak(
          options.lineBreaks,
        )}${commentExpression}`,
      });
    }
  } else {
    const commentExpression = `<!-- action-docs-${section} action="${actionFile}" -->`;
    const regexp = new RegExp(
      `${escapeRegExp(commentExpression)}(?:(?:\r\n|\r|\n.*)+${escapeRegExp(commentExpression)})?`,
    );

    await replaceInFile.replaceInFile({
      files: options.readmeFile,
      from: regexp,
      to: `${commentExpression}${getLineBreak(
        options.lineBreaks,
      )}${text.trim()}${getLineBreak(options.lineBreaks)}${commentExpression}`,
    });
  }
}

function createMarkdownSection(
  options: DefaultOptions,
  data: string,
  header: string,
): string {
  return data !== ""
    ? `${getToc(options.tocLevel)} ${header}${getLineBreak(
        options.lineBreaks,
      )}${getLineBreak(options.lineBreaks)}${data}${getLineBreak(
        options.lineBreaks,
      )}${getLineBreak(options.lineBreaks)}`
    : "";
}

function getInputOutput(
  data: ActionInputsOutputs,
  type: "input" | "output",
): { headers: string[]; rows: string[][] } {
  let headers: string[] = [];
  const rows: string[][] = [];
  if (data === undefined) {
    return { headers, rows };
  }

  headers =
    type === "input"
      ? ["name", "description", "required", "default"]
      : ["name", "description"];

  for (let i = 0; i < Object.keys(data).length; i++) {
    const key = Object.keys(data)[i];
    const value = data[key] as ActionInput;
    rows[i] = [];
    rows[i].push(key);
    rows[i].push(value.description ? value.description : "");

    if (type === "input") {
      rows[i].push(value.required ? String(value.required) : "false");

      if (value.default !== undefined && value.default !== "") {
        rows[i].push(value.default.toString().replace(/\r\n|\r|\n/g, " "));
      } else {
        rows[i].push('""');
      }
    }
  }
  return { headers, rows };
}
