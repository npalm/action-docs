import * as lb from "../src/linebreak";

describe("Verify line break utils.", () => {
  test("Test line break string to type conversion.", () => {
    expect(lb.getLineBreakType("CRLF")).toEqual("CRLF");
    expect(lb.getLineBreakType("LF")).toEqual("LF");
    expect(lb.getLineBreakType("CR")).toEqual("CR");
    expect(lb.getLineBreakType("unknown")).toEqual("LF");
  });

  test("Verify line break character.", () => {
    expect(lb.getLineBreak("CR")).toEqual("\r");
    expect(lb.getLineBreak("CRLF")).toEqual("\r\n");
    expect(lb.getLineBreak("LF")).toEqual("\n");
  });
});
