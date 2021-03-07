import { load } from "js-yaml";
import { readFileSync } from "fs";
import replaceInFile from "replace-in-file";
import { LineBreakType, getLineBreak } from "./linebreak";

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
interface ActionInput {
  required?: boolean;
  description: string;
  default?: string;
}

function createMdTable(options: DefaultOptions, data: string[][]): string {
  let result = "";

  for (const line of data) {
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

function generateActionDocs(options: DefaultOptions): ActionMarkdown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yml: any = load(readFileSync(options.actionFile, "utf-8"), {
    json: true,
  });

  const inputData = getInputOutput(yml.inputs, "input");
  const inputMdTable = createMdTable(
    options,
    inputData.headers.concat(inputData.rows)
  );

  const outputData = getInputOutput(yml.outputs, "output");
  const outputMdTable = createMdTable(
    options,
    outputData.headers.concat(outputData.rows)
  );

  return {
    description: createMarkdownSection(options, yml.description, "Description"),
    inputs: createMarkdownSection(options, inputMdTable, "Inputs"),
    outputs: createMarkdownSection(options, outputMdTable, "Outputs"),
    runs: createMarkdownSection(
      options,
      `This action is an \`${yml.runs.using}\` action.`,
      "Runs"
    ),
  };
}

function getInputOutput(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
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
      rows[i].push(value.default ? value.default : "");
    }
  }
  return { headers, rows };
}
