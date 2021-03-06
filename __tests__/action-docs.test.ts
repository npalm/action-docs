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
    await testReadme(
      path.join(fixtureDir, "all_fields_action.yml"),
      path.join(fixtureDir, "all_fields_readme.input"),
      path.join(fixtureDir, "all_fields_readme.output")
    );
  });

  test("Filled readme (all fields)", async () => {
    await testReadme(
      path.join(fixtureDir, "all_fields_action.yml"),
      path.join(fixtureDir, "all_fields_readme_filled.input"),
      path.join(fixtureDir, "all_fields_readme_filled.output")
    );
  });

  test("Readme (all fields) with CRLF line breaks", async () => {
    await testReadme(
      path.join(fixtureDir, "all_fields_action.yml.crlf"),
      path.join(fixtureDir, "all_fields_readme.input.crlf"),
      path.join(fixtureDir, "all_fields_readme.output.crlf"),
      { lineBreaks: "CRLF" }
    );
  });
});

async function testReadme(
  actionFile: string,
  originalReadme: string,
  fixtureReadme: string,
  overwriteOptions?: Options
) {
  const expected = <string>readFileSync(fixtureReadme, "utf-8");
  const original = <string>readFileSync(originalReadme, "utf-8");

  await generateActionMarkdownDocs({
    actionFile: actionFile,
    updateReadme: true,
    readmeFile: originalReadme,
    ...overwriteOptions,
  });

  const updated = <string>readFileSync(originalReadme, "utf-8");

  writeFileSync(originalReadme, original);
  expect(updated).toEqual(expected);
}
