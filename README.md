<!-- BADGES/ -->

![example workflow](https://github.com/npalm/action-docs/actions/workflows/ci.yml/badge.svg) [![npm](https://img.shields.io/npm/v/action-docs.svg)](https://npmjs.org/package/action-docs) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=action-docs&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=action-docs) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=action-docs&metric=coverage)](https://sonarcloud.io/dashboard?id=action-docs) [![CodeScene Code Health](https://codescene.io/projects/49602/status-badges/code-health)](https://codescene.io/projects/49602)

<!-- /BADGES -->

# Action docs

A CLI to generate and update documentation for GitHub actions or workflows, based on the definition `.yml`. To update your README in a GitHub workflow you can use the [action-docs-action](https://github.com/npalm/action-docs-action).

## TL;DR

### Add the following comment blocks to your README.md

```md
<!-- action-docs-header action="action.yml" -->

<!-- action-docs-description action="action.yml" -->

<!-- action-docs-inputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

<!-- action-docs-runs action="action.yml" --> # only applicable for actions, not workflows
```

Optionally you can also add the following section to generate a usage guide, replacing \<project\> and \<version\> with the name and version of your project you would like to appear in your usage guide.

```md
<!-- action-docs-usage action="action.yml" project="<project>" version="<version>" -->
```

### Generate docs via CLI

```bash
npm install -g action-docs
cd <your github action>

# write docs to console
action-docs

# update README
action-docs --update-readme
```

### Run the cli

```
action-docs -u
```

## CLI

### Options

The following options are available via the CLI

```
Options:
      --help                  Show help                                       [boolean]
      --version               Show version number                             [boolean]
  -t, --toc-level             TOC level used for markdown         [number] [default: 2]
  -a, --action                GitHub action file       [string] [default: "action.yml"]
      --no-banner             Print no banner
  -u, --update-readme         Update readme file.                              [string]
  -l, --line-breaks           Used line breaks in the generated docs.
                                 [string] [choices: "CR", "LF", "CRLF"] [default: "LF"]
  -h, --include-name-header   Include a header with the action/workflow name.
```

### Update the README

Action-docs can update your README based on the `action.yml`. The following sections can be updated: description, inputs, outputs and runs. Add the following tags to your README and run `action-docs -u`.

```md
<!-- action-docs-header action="action.yml" -->

<!-- action-docs-description action="action.yml" -->

<!-- action-docs-inputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

<!-- action-docs-runs action="action.yml" -->
```

For updating other Markdown files add the name of the file to the command `action-docs -u <file>`.

If you need to use `another/action.yml`:

1. write it in tags like `action="another/action.yml"`;
1. specify in a command via the `-a` option like `action-docs -a another/action.yml`

### Examples

#### Print action markdown docs to console

```bash
action-docs
```

#### Update README.md

```bash
action-docs --update-readme
```

#### Print action markdown for non default action file

```bash
action-docs --action another/action.yaml
```

#### Update readme, custom action file and set TOC level 3, custom readme

```bash
action-docs --action ./some-dir/action.yml --toc-level 3 --update-readme docs.md
```

## API

```javascript
import { generateActionMarkdownDocs } from 'action-docs'

await generateActionMarkdownDocs({
  actionFile: 'action.yml'
  tocLevel: 2
  updateReadme: true
  readmeFile: 'README.md'
});
```

## Contribution

We welcome contributions, please checkout the [contribution guide](CONTRIBUTING.md).

## License

This project is released under the [MIT License](./LICENSE).
