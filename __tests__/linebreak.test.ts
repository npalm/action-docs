import * as lb from "../src/linebreak";

test("Line break types", () => {
  expect(lb.getLineBreakType("CR")).toEqual("CR");
  expect(lb.getLineBreakType("CRLF")).toEqual("CRLF");
  expect(lb.getLineBreakType("LF")).toEqual("LF");
  expect(lb.getLineBreakType("unknown")).toEqual("LF");
});

test("Line break types", () => {
  expect(lb.getLineBreak("CR")).toEqual("\r");
  expect(lb.getLineBreak("CRLF")).toEqual("\r\n");
  expect(lb.getLineBreak("LF")).toEqual("\n");
});
