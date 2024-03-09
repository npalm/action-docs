#!/usr/bin/env node

import { defaultOptions, generateActionMarkdownDocs } from "./index.js";
import chalk from "chalk";
import figlet from "figlet";
import { getLineBreakType } from "./linebreak.js";
import yargs from "yargs";

const args = await yargs(process.argv.slice(2))
  .options({
    "toc-level": {
      description: "TOC level used for markdown",
      type: "number",
      default: defaultOptions.tocLevel,
      demandOption: false,
      alias: "t",
    },
    action: {
      description: "GitHub action file",
      type: "string",
      default: defaultOptions.sourceFile,
      demandOption: false,
      alias: "a",
      deprecated: 'use "source" instead',
    },
    source: {
      description: "GitHub source file",
      type: "string",
      default: defaultOptions.sourceFile,
      demandOption: false,
      alias: "s",
    },
    "no-banner": {
      description: "Print no banner",
      requiresArg: false,
    },
    "update-readme": {
      description: "Update readme file.",
      requiresArg: false,
      type: "string",
      alias: "u",
    },
    "line-breaks": {
      description: "Used line breaks in the generated docs.",
      default: "LF",
      choices: ["CR", "LF", "CRLF"],
      demandOption: false,
      type: "string",
      alias: "l",
    },
    "include-name-header": {
      description: "Include a header with the action/workflow name",
      type: "boolean",
      alias: "n",
    },
  })
  .help().argv;

args.banner === undefined &&
  console.info(
    chalk.blue(figlet.textSync("ACTION-DOCS", { horizontalLayout: "full" })),
  );

const updateReadme = args["update-readme"] !== undefined;

const sourceFile =
  args.source === defaultOptions.sourceFile ? args.action : args.source;

const options = {
  sourceFile,
  tocLevel: args["toc-level"],
  updateReadme,
  readmeFile:
    args["update-readme"] === undefined || args["update-readme"] === ""
      ? defaultOptions.readmeFile
      : args["update-readme"],
  lineBreaks: getLineBreakType(args["line-breaks"]),
  includeNameHeader:
    args["include-name-header"] === undefined
      ? defaultOptions.includeNameHeader
      : args["include-name-header"],
};

/* eslint-disable github/no-then */
generateActionMarkdownDocs(options)
  .then((r) => {
    if (!updateReadme) {
      console.info(r);
    }
  })
  .catch((e) => console.error(e.message));
/* eslint-enable */
