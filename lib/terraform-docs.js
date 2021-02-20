"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActionMarkdownDocs = exports.defaultOptions = void 0;
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const replace_in_file_1 = __importDefault(require("replace-in-file"));
exports.defaultOptions = {
    tocLevel: 2,
    actionFile: "action.yml",
    updateReadme: false,
    readmeFile: "README.md",
};
function createMdTable(data) {
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
function getToc(tocLevel) {
    let result = "";
    for (let i = 0; i < tocLevel; i++) {
        result = `${result}#`;
    }
    return result;
}
function generateActionMarkdownDocs(inputOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, exports.defaultOptions), inputOptions);
        const docs = generateActionDocs(options);
        if (options.updateReadme) {
            yield updateReadme(options.readmeFile, docs.description, "description");
            yield updateReadme(options.readmeFile, docs.inputs, "inputs");
            yield updateReadme(options.readmeFile, docs.outputs, "outputs");
            yield updateReadme(options.readmeFile, docs.runs, "runs");
        }
        return `${docs.description + docs.inputs + docs.outputs + docs.runs}`;
    });
}
exports.generateActionMarkdownDocs = generateActionMarkdownDocs;
function updateReadme(file, text, section) {
    return __awaiter(this, void 0, void 0, function* () {
        const to = new RegExp(`<!-- terraform-docs-${section} -->(?:(?:\n.*)+<!-- terraform-docs-${section} -->)?`);
        yield replace_in_file_1.default.replaceInFile({
            files: file,
            from: to,
            to: `<!-- terraform-docs-${section} -->\n${text}\n<!-- terraform-docs-${section} -->`,
        });
    });
}
function createMarkdownSection(tocLevel, data, header) {
    return data !== "" ? `${getToc(tocLevel)} ${header}\n\n${data}\n\n` : "";
}
function generateActionDocs(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yml = js_yaml_1.load(fs_1.readFileSync(options.actionFile, "utf-8"), {
        json: true,
    });
    const inputHeaders = [];
    const inputRows = [];
    if (yml.inputs !== undefined) {
        inputHeaders[0] = ["parameter", "description", "required", "default"];
        inputHeaders[1] = ["-", "-", "-", "-"];
        //let i = 0;
        for (let i = 0; i < Object.keys(yml.inputs).length; i++) {
            const key = Object.keys(yml.inputs)[i];
            const input = yml.inputs[key];
            inputRows[i] = [];
            inputRows[i].push(key);
            inputRows[i].push(input.description);
            inputRows[i].push(input.required ? `\`${String(input.required)}\`` : "`false`");
            inputRows[i].push(input.default ? input.default : "");
        }
    }
    const outputHeaders = [];
    const outputRows = [];
    if (yml.outputs !== undefined) {
        outputHeaders[0] = ["parameter", "description"];
        outputHeaders[1] = ["-", "-"];
        let i = 0;
        for (const key of Object.keys(yml.outputs)) {
            const output = yml.outputs[key];
            outputRows[i] = [];
            outputRows[i].push(key);
            outputRows[i].push(output.description);
            i++;
        }
    }
    const inputMdTable = createMdTable(inputHeaders.concat(inputRows));
    const outputMdTable = createMdTable(outputHeaders.concat(outputRows));
    const descriptionMd = createMarkdownSection(options.tocLevel, yml.description, "Description");
    const inputMd = createMarkdownSection(options.tocLevel, inputMdTable, "Inputs");
    const outputMd = createMarkdownSection(options.tocLevel, outputMdTable, "Outputs");
    const runMd = createMarkdownSection(options.tocLevel, `This action is an \`${yml.runs.using}\` action.`, "Runs");
    return {
        description: descriptionMd,
        inputs: inputMd,
        outputs: outputMd,
        runs: runMd,
    };
}
