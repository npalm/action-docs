import * as cp from "child_process";
import * as path from "path";

import { readFileSync, writeFileSync } from "fs";

const fixtureDir = path.join("__tests__", "fixtures");

describe("CLI tests", () => {
  test("Update readme default", async () => {
    await testReadme(
      path.join(fixtureDir, "all_fields_action.yml"),
      path.join(fixtureDir, "all_fields_readme.input"),
      path.join(fixtureDir, "all_fields_readme.output"),
    );
  });

  test("Update readme with CRLF line breaks.", async () => {
    await testReadme(
      path.join(fixtureDir, "all_fields_action.yml.crlf"),
      path.join(fixtureDir, "all_fields_readme.input.crlf"),
      path.join(fixtureDir, "all_fields_readme.output.crlf"),
      "-l CRLF",
    );
  });

  test("Console output with TOC 3 and no banner.", async () => {
    const result = await cli(
      `-a ${path.join(fixtureDir, "all_fields_action.yml")} -t 3 --no-banner`,
    );

    const expected = <string>(
      readFileSync(
        path.join(fixtureDir, "all_fields_action_toc3_cli.output"),
        "utf-8",
      )
    );

    expect(result.code).toBe(0);
    expect(result.stdout).toEqual(`${expected}\n`);
  });

  test("Console output including name header and no banner.", async () => {
    const result = await cli(
      `-a ${path.join(fixtureDir, "action.yml")} -h true --no-banner`,
    );

    const expected = <string>(
      readFileSync(path.join(fixtureDir, "default-with-header.output"), "utf-8")
    );

    expect(result.code).toBe(0);
    expect(result.stdout).toEqual(`${expected}\n`);
  });
});

interface CliResponse {
  code: number;
  error: cp.ExecException | null;
  stdout: string;
  stderr: string;
}

function cli(args: string): Promise<CliResponse> {
  return new Promise((resolve) => {
    cp.exec(
      `node ${path.resolve("lib/cli.js")} ${args}`,
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      },
    );
  });
}

async function testReadme(
  actionFile: string,
  originalReadme: string,
  fixtureReadme: string,
  extraArgs = "",
  exitCode = 0,
) {
  const expected = <string>readFileSync(fixtureReadme, "utf-8");
  const original = <string>readFileSync(originalReadme, "utf-8");

  const result = await cli(
    `-u ${originalReadme} -a ${actionFile} ${extraArgs}`,
  );
  expect(result.code).toBe(exitCode);

  const updated = <string>readFileSync(originalReadme, "utf-8");

  writeFileSync(originalReadme, original);
  expect(updated).toEqual(expected);
}
