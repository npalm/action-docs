#!/usr/bin/env node

import yargs from "yargs";
import { generateActionMarkdownDocs, defaultOptions } from ".";
import chalk from "chalk";
import figlet from "figlet";
import { getLineBreakType } from "./linebreak";

const args = yargs.options({
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
  "line-breaks": {
    description: "Used line breaks in the generated docs.",
    default: "LF",
    choices: ["CR", "LF", "CRLF"],
    demandOption: false,
    type: "string",
    alias: "l",
  },
}).argv;

args["banner"] === undefined &&
  console.info(
    chalk.blue(figlet.textSync("ACTION-DOCS", { horizontalLayout: "full" }))
  );

const updateReadme = args["update-readme"] === undefined ? false : true;

/* eslint-disable github/no-then */
generateActionMarkdownDocs({
  actionFile: args.action,
  tocLevel: args["toc-level"],
  updateReadme: updateReadme,
  readmeFile:
    args["update-readme"] === undefined || args["update-readme"] === ""
      ? defaultOptions.readmeFile
      : args["update-readme"],
  lineBreaks: getLineBreakType(args["line-breaks"]),
})
  .then((r) => {
    // if (updateReadme) {
    console.info(r);
    // }
  })
  .catch((e) => console.error(e.message));
/* eslint-enable */
