import { generateActionMarkdownDocs, Options } from "../src";
import { readFileSync, writeFileSync, copyFileSync, rmSync, unlink } from "fs";
import * as path from "path";
import { option } from "yargs";

const fixtureDir = path.join("__tests__", "fixtures");

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
      { lineBreaks: "CRLF" }
    );
  });
});

interface ReadmeTestFixtures {
  actionFile: string;
  originalReadme: string;
  fixtureReadme: string;
}

async function testReadme(
  files: ReadmeTestFixtures,
  overwriteOptions?: Options
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

  writeFileSync(files.originalReadme, original);
  expect(updated).toEqual(expected);
}
