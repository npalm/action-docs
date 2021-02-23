import { load } from "js-yaml";
import { readFileSync } from "fs";
import replaceInFile from "replace-in-file";

export interface Options {
  tocLevel?: number;
  actionFile?: string;
  updateReadme?: boolean;
  readmeFile?: string;
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
}

export const defaultOptions: DefaultOptions = {
  tocLevel: 2,
  actionFile: "action.yml",
  updateReadme: false,
  readmeFile: "README.md",
};
interface ActionInput {
  required?: boolean;
  description: string;
  default?: string;
}

function createMdTable(data: string[][]): string {
  let result = "";

  for (const line of data) {
    result = `${result}|`;
    for (const c of line) {
      result = `${result} ${c} |`;
    }
    result = `${result}\n`;
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
    await updateReadme(options.readmeFile, docs.description, "description");
    await updateReadme(options.readmeFile, docs.inputs, "inputs");
    await updateReadme(options.readmeFile, docs.outputs, "outputs");
    await updateReadme(options.readmeFile, docs.runs, "runs");
  }

  return `${docs.description + docs.inputs + docs.outputs + docs.runs}`;
}

async function updateReadme(
  file: string,
  text: string,
  section: string
): Promise<void> {
  const to = new RegExp(
    `<!-- action-docs-${section} -->(?:(?:\n.*)+<!-- action-docs-${section} -->)?`
  );

  await replaceInFile.replaceInFile({
    files: file,
    from: to,
    to: `<!-- action-docs-${section} -->\n${text}\n<!-- action-docs-${section} -->`,
  });
}

function createMarkdownSection(
  tocLevel: number,
  data: string,
  header: string
): string {
  return data !== "" ? `${getToc(tocLevel)} ${header}\n\n${data}\n\n` : "";
}

function generateActionDocs(options: DefaultOptions): ActionMarkdown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yml: any = load(readFileSync(options.actionFile, "utf-8"), {
    json: true,
  });

  const inputHeaders: string[][] = [];
  const inputRows: string[][] = [];
  if (yml.inputs !== undefined) {
    inputHeaders[0] = ["parameter", "description", "required", "default"];
    inputHeaders[1] = ["-", "-", "-", "-"];

    //let i = 0;
    for (let i = 0; i < Object.keys(yml.inputs).length; i++) {
      const key = Object.keys(yml.inputs)[i];
      const input = yml.inputs[key] as ActionInput;
      inputRows[i] = [];
      inputRows[i].push(key);
      inputRows[i].push(input.description);
      inputRows[i].push(
        input.required ? `\`${String(input.required)}\`` : "`false`"
      );
      inputRows[i].push(input.default ? input.default : "");
    }
  }

  const outputHeaders: string[][] = [];
  const outputRows: string[][] = [];
  if (yml.outputs !== undefined) {
    outputHeaders[0] = ["parameter", "description"];
    outputHeaders[1] = ["-", "-"];
    let i = 0;
    for (const key of Object.keys(yml.outputs)) {
      const output = yml.outputs[key] as ActionInput;
      outputRows[i] = [];
      outputRows[i].push(key);
      outputRows[i].push(output.description);
      i++;
    }
  }

  const inputMdTable = createMdTable(inputHeaders.concat(inputRows));
  const outputMdTable = createMdTable(outputHeaders.concat(outputRows));

  const descriptionMd = createMarkdownSection(
    options.tocLevel,
    yml.description,
    "Description"
  );
  const inputMd = createMarkdownSection(
    options.tocLevel,
    inputMdTable,
    "Inputs"
  );
  const outputMd = createMarkdownSection(
    options.tocLevel,
    outputMdTable,
    "Outputs"
  );
  const runMd = createMarkdownSection(
    options.tocLevel,
    `This action is an \`${yml.runs.using}\` action.`,
    "Runs"
  );

  return {
    description: descriptionMd,
    inputs: inputMd,
    outputs: outputMd,
    runs: runMd,
  };
}
