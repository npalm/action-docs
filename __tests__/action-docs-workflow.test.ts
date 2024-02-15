import { generateActionMarkdownDocs, Options } from "../src";
import { readFileSync, writeFileSync, copyFileSync, unlink } from "fs";
import * as path from "path";

const fixtureDir = path.join("__tests__", "fixtures", "workflow");

// By default a 'workflow.yml' is expected at the runtime location. Therefore we copy one during the test.
beforeAll(() => {
  copyFileSync(path.join(fixtureDir, "workflow.yml"), "workflow.yml");
});

afterAll(() => {
  return unlink("workflow.yml", (err) => {
    if (err) throw err;
  });
});

describe("Test output", () => {
  test("With defaults.", async () => {
    const markdown = await generateActionMarkdownDocs({
      actionFile: path.join(fixtureDir, "workflow.yml"),
      includeNameHeader: true,
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "default.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("A minimal workflow definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      actionFile: path.join(fixtureDir, "minimal_workflow.yml"),
      includeNameHeader: true,
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "minimal_workflow.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("All fields workflow definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      actionFile: path.join(fixtureDir, "all_fields_workflow.yml"),
      includeNameHeader: true,
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "all_fields_workflow.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });
});

describe("Test update readme ", () => {
  test("Empty readme (all fields)", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_workflow.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_readme.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_readme.output"),
    });
  });

  test("Filled readme (all fields)", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_workflow.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_readme_filled.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_readme_filled.output"),
    });
  });

  //   test("Readme (all fields) with CRLF line breaks", async () => {
  //     await testReadme(
  //       {
  //         actionFile: path.join(fixtureDir, "all_fields_workflow.yml.crlf"),
  //         originalReadme: path.join(fixtureDir, "all_fields_readme.input.crlf"),
  //         fixtureReadme: path.join(fixtureDir, "all_fields_readme.output.crlf"),
  //       },
  //       { lineBreaks: "CRLF" },
  //     );
  //   });

  //   test("Readme (inputs) for action_docs_workflow", async () => {
  //     await testReadme({
  //       actionFile: path.join(fixtureDir, "action_docs_workflow.yml"),
  //       originalReadme: path.join(fixtureDir, "action_docs_workflow_readme.input"),
  //       fixtureReadme: path.join(fixtureDir, "action_docs_workflow_readme.output"),
  //     });
  //   });

  //   test("Readme for two workflow.yml-s", async () => {
  //     await testReadme(
  //       {
  //         actionFile: path.join(fixtureDir, "action_docs_workflow.yml"),
  //         originalReadme: path.join(fixtureDir, "two_workflows_readme.input"),
  //         fixtureReadme: path.join(fixtureDir, "two_workflows_readme.output"),
  //       },
  //       {},
  //       false,
  //     );

  //     await testReadme({
  //       actionFile: path.join(fixtureDir, "all_fields_workflow.yml"),
  //       originalReadme: path.join(fixtureDir, "two_workflows_readme.input"),
  //       fixtureReadme: path.join(fixtureDir, "two_workflows_readme.output"),
  //     });
  //   });
});

describe("Test usage format", () => {
  test("Multi-line descriptions.", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "workflow.yml"),
      originalReadme: path.join(fixtureDir, "workflow_usage_readme.input"),
      fixtureReadme: path.join(fixtureDir, "workflow_usage_readme.output"),
    });
  });

  test("With and without defaults.", async () => {
    await testReadme({
      actionFile: path.join(fixtureDir, "all_fields_workflow.yml"),
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
    includeNameHeader: true,
    ...overwriteOptions,
  });

  const updated = <string>readFileSync(files.originalReadme, "utf-8");

  if (doExpect) {
    writeFileSync(files.originalReadme, original);
    expect(updated).toEqual(expected);
  }
}
