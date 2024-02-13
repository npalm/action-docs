import { generateActionMarkdownDocs, Options } from "../src";
import { readFileSync, writeFileSync, copyFileSync, unlink } from "fs";
import * as path from "path";

const fixtureDir = path.join("__tests__", "fixtures", "action");

// By default an 'action.yml' is expected at the runtime location. Therefore we copy one during th test.
beforeAll(() => {
  copyFileSync(path.join(fixtureDir, "action.yml"), "action.yml");
});

afterAll(() => {
  return unlink("action.yml", (err) => {
    if (err) throw err;
  });
});

describe("Test output", () => {
  test("With defaults.", async () => {
    const markdown = await generateActionMarkdownDocs();
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "default.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("A minimal action definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      actionFile: path.join(fixtureDir, "minimal_action.yml"),
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "minimal_action.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("All fields action definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      actionFile: path.join(fixtureDir, "all_fields_action.yml"),
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "all_fields_action.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });
});

describe("Test update readme ", () => {
  test("Empty readme (all fields)", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_readme.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_readme.output"),
    });
  });

  test("Filled readme (all fields)", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_readme_filled.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_readme_filled.output"),
    });
  });

  test("Readme (all fields) with CRLF line breaks", async () => {
    await testReadme(
      {
        actionFile: path.join(fixtureDir, "all_fields_action.yml.crlf"),
        originalReadme: path.join(fixtureDir, "all_fields_readme.input.crlf"),
        fixtureReadme: path.join(fixtureDir, "all_fields_readme.output.crlf"),
      },
      { lineBreaks: "CRLF" },
    );
  });

  test("Readme (inputs) for action-docs-action", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "action_docs_action_action.yml"),
      originalReadme: path.join(fixtureDir, "action_docs_action_readme.input"),
      fixtureReadme: path.join(fixtureDir, "action_docs_action_readme.output"),
    });
  });

  test("Readme for two action.yml-s", async () => {
    await testReadme(
      {
        actionFile: path.join(fixtureDir, "action_docs_action_action.yml"),
        originalReadme: path.join(fixtureDir, "two_actions_readme.input"),
        fixtureReadme: path.join(fixtureDir, "two_actions_readme.output"),
      },
      {},
      false,
    );

    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "two_actions_readme.input"),
      fixtureReadme: path.join(fixtureDir, "two_actions_readme.output"),
    });
  });
});

describe("Test usage format", () => {
  test("Multi-line descriptions.", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "action.yml"),
      originalReadme: path.join(fixtureDir, "action_usage_readme.input"),
      fixtureReadme: path.join(fixtureDir, "action_usage_readme.output"),
    });
  });

  test("With and without defaults.", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_usage_readme.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_usage_readme.output"),
    });
  });
});

interface ReadmeTestFixtures {
  actionFile: string;
  originalReadme: string;
  fixtureReadme: string;
}

async function testReadme(
  files: ReadmeTestFixtures,
  overwriteOptions?: Options,
  doExpect: boolean = true,
) {
  const expected = <string>readFileSync(files.fixtureReadme, "utf-8");
  const original = <string>readFileSync(files.originalReadme, "utf-8");

  await generateActionMarkdownDocs({
    actionFile: files.actionFile,
    updateReadme: true,
    readmeFile: files.originalReadme,
    ...overwriteOptions,
  });

  const updated = <string>readFileSync(files.originalReadme, "utf-8");

  if (doExpect) {
    writeFileSync(files.originalReadme, original);
    expect(updated).toEqual(expected);
  }
}
