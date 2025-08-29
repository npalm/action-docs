import { generateActionMarkdownDocs, Options } from "../src";
import { readFileSync, writeFileSync, copyFileSync, unlink } from "fs";
import * as path from "path";

const fixtureDir = path.join("__tests__", "fixtures", "action");

// By default an 'action.yml' is expected at the runtime location. Therefore we copy one during the test.
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

  test("With name header included.", async () => {
    const markdown = await generateActionMarkdownDocs({
      includeNameHeader: true,
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "default-with-header.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("A minimal action definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, "minimal_action.yml"),
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "minimal_action.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });

  test("All fields action definition.", async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
    });
    const expected = <string>(
      readFileSync(path.join(fixtureDir, "all_fields_action.output"), "utf-8")
    );

    expect(markdown).toEqual(expected);
  });
});

describe("Test update readme ", () => {
  test("With defaults.", async () => {
    await testReadme(
      {
        sourceFile: "action.yml", // Default value
        originalReadme: path.join(fixtureDir, "default_readme.input"),
        fixtureReadme: path.join(fixtureDir, "default_readme.output"),
      },
      {
        includeNameHeader: true,
      },
    );
  });

  test("Empty readme (all fields)", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
        originalReadme: path.join(fixtureDir, "all_fields_readme.input"),
        fixtureReadme: path.join(fixtureDir, "all_fields_readme.output"),
      },
      {
        includeNameHeader: true,
      },
    );
  });
  test("Empty readme (all fields) with header", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
        originalReadme: path.join(fixtureDir, "all_fields_readme.input"),
        fixtureReadme: path.join(fixtureDir, "all_fields_readme_header.output"),
      },
      {
        includeNameHeader: true,
      },
      false,
      true,
    );
  });

  test("All fields one annotation", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_one_annotation.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_one_annotation.output"),
    });
  });

  test("Filled readme (all fields)", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_readme_filled.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_readme_filled.output"),
    });
  });

  test("Filled readme (all fields) with header", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
        originalReadme: path.join(fixtureDir, "all_fields_readme.input"),
        fixtureReadme: path.join(fixtureDir, "all_fields_readme_header.output"),
      },
      {
        includeNameHeader: true,
      },
      false,
      true,
    );
  });

  test("Readme (all fields) with CRLF line breaks", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "all_fields_action.yml.crlf"),
        originalReadme: path.join(fixtureDir, "all_fields_readme.input.crlf"),
        fixtureReadme: path.join(fixtureDir, "all_fields_readme.output.crlf"),
      },
      { lineBreaks: "CRLF" },
    );
  });

  test("Readme (inputs) for action-docs-action", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "action_docs_action_action.yml"),
      originalReadme: path.join(fixtureDir, "action_docs_action_readme.input"),
      fixtureReadme: path.join(fixtureDir, "action_docs_action_readme.output"),
    });
  });

  test("Readme for two action.yml-s", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "action_docs_action_action.yml"),
        originalReadme: path.join(fixtureDir, "two_actions_readme.input"),
        fixtureReadme: path.join(fixtureDir, "two_actions_readme.output"),
      },
      {},
      false,
    );

    await testReadme({
      sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "two_actions_readme.input"),
      fixtureReadme: path.join(fixtureDir, "two_actions_readme.output"),
    });
  });

  test("Readme for deprecated inputs", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "deprecated_input_action.yml"),
      originalReadme: path.join(fixtureDir, "deprecated_input_action.input"),
      fixtureReadme: path.join(fixtureDir, "deprecated_input_action.output"),
    });
  });
});

describe("Test usage format", () => {
  test("Multi-line descriptions.", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "action.yml"),
      originalReadme: path.join(fixtureDir, "action_usage_readme.input"),
      fixtureReadme: path.join(fixtureDir, "action_usage_readme.output"),
    });
  });

  test("With and without defaults.", async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
      originalReadme: path.join(fixtureDir, "all_fields_usage_readme.input"),
      fixtureReadme: path.join(fixtureDir, "all_fields_usage_readme.output"),
    });
  });
});

describe("Backwards compatibility", () => {
  test("Deprecated action option still works correctly", async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, "all_fields_action.yml"),
        originalReadme: path.join(fixtureDir, "action_deprecated.input"),
        fixtureReadme: path.join(fixtureDir, "action_deprecated.output"),
      },
      {
        includeNameHeader: true,
      },
    );
  });
});

interface ReadmeTestFixtures {
  sourceFile: string;
  originalReadme: string;
  fixtureReadme: string;
}

async function testReadme(
  files: ReadmeTestFixtures,
  overwriteOptions?: Options,
  doExpect: boolean = true,
  includeNameHeader: boolean = false,
) {
  const expected = <string>readFileSync(files.fixtureReadme, "utf-8");
  const original = <string>readFileSync(files.originalReadme, "utf-8");

  try {
    await generateActionMarkdownDocs({
      sourceFile: files.sourceFile,
      updateReadme: true,
      includeNameHeader: includeNameHeader,
      readmeFile: files.originalReadme,
      ...overwriteOptions,
    });

    const updated = <string>readFileSync(files.originalReadme, "utf-8");

    if (doExpect) {
      expect(updated).toEqual(expected);
    }
  } finally {
    writeFileSync(files.originalReadme, original);
  }
}
