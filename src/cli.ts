#!/usr/bin/env node

import yargs from "yargs";
import { generateActionMarkdownDocs, defaultOptions } from ".";
import chalk from "chalk";
import figlet from "figlet";

const args = yargs.options({
  "toc-level": {
    description: "TOC level used for markdown",
    type: "number",
    default: defaultOptions.tocLevel,
    demandOption: true,
    alias: "t",
  },
  action: {
    description: "GitHub action file",
    type: "string",
    default: defaultOptions.actionFile,
    demandOption: false,
    alias: "a",
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
}).argv;

args["banner"] === undefined &&
  console.info(
    chalk.blue(figlet.textSync("ACTION-DOCS", { horizontalLayout: "full" }))
  );

/* eslint-disable github/no-then */
generateActionMarkdownDocs({
  actionFile: args.action,
  tocLevel: args["toc-level"],
  updateReadme: args["update-readme"] === undefined ? false : true,
  readmeFile:
    args["update-readme"] === undefined || args["update-readme"] === ""
      ? defaultOptions.readmeFile
      : args["update-readme"],
})
  .then((r) => {
    console.info(r);
  })
  .catch((e) => console.error(e.message));
/* eslint-enable */
