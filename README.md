# Action docs

A clie to generate, and update documentation for GitHub actions based on the action definition yml. To update your README in a GitHub workflow you can use the [action-docs-action](https://github.com/npalm/action-docs-action).

## TL;DR

Generate docs via cli.

```bash
npm install -g action-docs
cd <your github action>

# write docs to console
action-docs

# update reamde
action-docs --update-readme
```

Update your README.md

```
## Add the following comment blocks to your README.md
<!-- action-docs-description -->

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

<!-- action-docs-runs -->

## Run the cli
action-docs -u
```

## CLI

### Options

The following options are available via the CLI

```
Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -t, --toc-level      TOC level used for markdown
                                                [number] [required] [default: 2]
  -a, --action         GitHub action file       [string] [default: "action.yml"]
      --no-banner      Print no banner
  -u, --update-readme  Update readme file.                              [string]
```


### Update the README.

Action-docs can update your README based on the `action.yml`. The following sections can be updated: description, inputs, outputs and runs. Add the following tags to your README and run `actiond-docs -u`.

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

We welcome contribution, please checkout the [contribution guide](CONTRIBUTING.md). 


## License

This project are released under the [MIT License](./LICENSE).
