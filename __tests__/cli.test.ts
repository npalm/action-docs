import * as cp from "child_process";
import * as path from "path";

import { readFileSync, writeFileSync } from "fs";

test("CLI: update readme default", async () => {
  await testReadme(
    "__tests__/fixtures/all_fields_action.yml",
    "__tests__/fixtures/all_fields_readme.input",
    "__tests__/fixtures/all_fields_readme.output"
  );
});

test("CLI: update readme CRLF", async () => {
  await testReadme(
    "__tests__/fixtures/all_fields_action.yml.crlf",
    "__tests__/fixtures/all_fields_readme.input.crlf",
    "__tests__/fixtures/all_fields_readme.output.crlf",
    "--lb CRLF"
  );
});

interface CliRespone {
  code: number;
  error: cp.ExecException | null;
  stdout: string;
  stderr: string;
}

function cli(args: string): Promise<CliRespone> {
  return new Promise((resolve) => {
    cp.exec(
      `ts-node ${path.resolve("src/cli.ts")} ${args}`,
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      }
    );
  });
}

async function testReadme(
  actionFile: string,
  originalReadme: string,
  fixtureReadme: string,
  extraArgs = "",
  exitCode = 0
) {
  const expected = <string>readFileSync(fixtureReadme, "utf-8");
  const original = <string>readFileSync(originalReadme, "utf-8");

  const result = await cli(
    `-u ${originalReadme} -a ${actionFile} ${extraArgs}`
  );
  expect(result.code).toBe(exitCode);

  const updated = <string>readFileSync(originalReadme, "utf-8");

  writeFileSync(originalReadme, original);
  expect(updated).toEqual(expected);
}
