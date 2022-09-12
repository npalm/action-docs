import { LineBreakType, getLineBreak } from "./linebreak";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import replaceInFile from "replace-in-file";

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
  description: string;
  default?: string;
}

interface ActionOutput {
  description: string;
}

function createMdTable(
  data: ActionInputsOutputs,
  options: DefaultOptions,
  type: "input" | "output"
): string {
  const tableData = getInputOutput(data, type);
  const tableArray = tableData.headers.concat(tableData.rows);

  let result = "";

  for (const line of tableArray) {
    result = `${result}|`;
    for (const c of line) {
      result = `${result} ${c} |`;
    }
    result = `${result}${getLineBreak(options.lineBreaks)}`;
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
  inputOptions?: Options
): Promise<string> {
  const options: DefaultOptions = {
    ...defaultOptions,
    ...inputOptions,
  };

  const docs = generateActionDocs(options);
  if (options.updateReadme) {
    await updateReadme(options, docs.description, "description");
    await updateReadme(options, docs.inputs, "inputs");
    await updateReadme(options, docs.outputs, "outputs");
    await updateReadme(options, docs.runs, "runs");
  }

  return `${docs.description + docs.inputs + docs.outputs + docs.runs}`;
}

function generateActionDocs(options: DefaultOptions): ActionMarkdown {
  const yml = load(readFileSync(options.actionFile, "utf-8"), {
    json: true,
  }) as ActionYml;

  const inputMdTable = createMdTable(yml.inputs, options, "input");
  const outputMdTable = createMdTable(yml.outputs, options, "output");

  return {
    description: createMarkdownSection(options, yml.description, "Description"),
    inputs: createMarkdownSection(options, inputMdTable, "Inputs"),
    outputs: createMarkdownSection(options, outputMdTable, "Outputs"),
    runs: createMarkdownSection(
      options,
      // eslint-disable-next-line i18n-text/no-en
      `This action is a \`${yml.runs.using}\` action.`,
      "Runs"
    ),
  };
}

async function updateReadme(
  options: DefaultOptions,
  text: string,
  section: string
): Promise<void> {
  const to = new RegExp(
    `<!-- action-docs-${section} -->(?:(?:\r\n|\r|\n.*)+<!-- action-docs-${section} -->)?`
  );

  await replaceInFile.replaceInFile({
    files: options.readmeFile,
    from: to,
    to: `<!-- action-docs-${section} -->${getLineBreak(
      options.lineBreaks
    )}${text}${getLineBreak(
      options.lineBreaks
    )}<!-- action-docs-${section} -->`,
  });
}

function createMarkdownSection(
  options: DefaultOptions,
  data: string,
  header: string
): string {
  return data !== ""
    ? `${getToc(options.tocLevel)} ${header}${getLineBreak(
        options.lineBreaks
      )}${getLineBreak(options.lineBreaks)}${data}${getLineBreak(
        options.lineBreaks
      )}${getLineBreak(options.lineBreaks)}`
    : "";
}

function getInputOutput(
  data: ActionInputsOutputs,
  type: "input" | "output"
): { headers: string[][]; rows: string[][] } {
  const headers: string[][] = [];
  const rows: string[][] = [];
  if (data === undefined) {
    return { headers, rows };
  }

  headers[0] =
    type === "input"
      ? ["parameter", "description", "required", "default"]
      : ["parameter", "description"];
  headers[1] = Array(headers[0].length).fill("-");

  for (let i = 0; i < Object.keys(data).length; i++) {
    const key = Object.keys(data)[i];
    const value = data[key] as ActionInput;
    rows[i] = [];
    rows[i].push(key);
    rows[i].push(value.description);

    if (type === "input") {
      rows[i].push(
        value.required ? `\`${String(value.required)}\`` : "`false`"
      );

      if (value.default !== undefined) {
        rows[i].push(value.default.toString().replace(/\r\n|\r|\n/g, " "));
      } else {
        rows[i].push("");
      }
    }
  }
  return { headers, rows };
}
