#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const _1 = require(".");
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const args = yargs_1.default.options({
    "toc-level": {
        description: "TOC level used for markdown",
        type: "number",
        default: _1.defaultOptions.tocLevel,
        demandOption: true,
        alias: "t",
    },
    action: {
        description: "GitHub action file",
        type: "string",
        default: _1.defaultOptions.actionFile,
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
args["no-banner"] &&
    console.info(chalk_1.default.blue(figlet_1.default.textSync("ACTION-DOCS", { horizontalLayout: "full" })));
/* eslint-disable github/no-then */
_1.generateActionMarkdownDocs({
    actionFile: args.action,
    tocLevel: args["toc-level"],
    updateReadme: args["update-readme"] !== "" ? false : true,
    readmeFile: args["update-readme"] && args["update-readme"] !== ""
        ? args["update-readme"]
        : _1.defaultOptions.readmeFile,
})
    .then((r) => {
    console.info(r);
})
    .catch((e) => console.error(e.message));
/* eslint-enable */
// if (args["update-readme"]) {
//   console.log("--------ddd-");
// }
// console.log(args);
