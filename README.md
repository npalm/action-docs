
<!-- BADGES/ -->
![example workflow](https://github.com/npalm/action-docs/actions/workflows/ci.yml/badge.svg) [![npm](https://img.shields.io/npm/v/action-docs.svg)](https://npmjs.org/package/action-docs) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=action-docs&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=action-docs) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=action-docs&metric=coverage)](https://sonarcloud.io/dashboard?id=action-docs)

<!-- /BADGES -->

# Action docs

A CLI to generate and update documentation for GitHub actions, based on the action definition `.yml`. To update your README in a GitHub workflow you can use the [action-docs-action](https://github.com/npalm/action-docs-action).

## TL;DR

### Add the following comment blocks to your README.md

```
<!-- action-docs-description -->

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

<!-- action-docs-runs -->
```

### Generate docs via CLI.

```bash
npm install -g action-docs
cd <your github action>

# write docs to console
action-docs

# update reamde
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
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -t, --toc-level      TOC level used for markdown         [number] [default: 2]
  -a, --action         GitHub action file       [string] [default: "action.yml"]
      --no-banner      Print no banner
  -u, --update-readme  Update readme file.                              [string]
  -l, --line-breaks    Used line breaks in the generated docs.
                          [string] [choices: "CR", "LF", "CRLF"] [default: "LF"]
```

### Update the README

Action-docs can update your README based on the `action.yml`. The following sections can be updated: description, inputs, outputs and runs. Add the following tags to your README and run `action-docs -u`.

```
<!-- action-docs-description -->

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

<!-- action-docs-runs -->
```

For updating other Markdown files add the name of the file to the command `action-docs -u <file>`.


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
action-docs --action ./action.yaml
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
