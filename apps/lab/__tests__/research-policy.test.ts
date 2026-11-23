/** @jest-environment node */
import { isInternalResearchMode } from "@/lib/stepanoskin/media-policy";
import { GET } from "@/app/research-media/[file]/route";
import { readFile } from "node:fs/promises";

jest.mock("node:fs/promises",()=>({readFile:jest.fn()}));
const read = jest.mocked(readFile);
const originalEnv = process.env;
const filename = `${"a".repeat(64)}.webp`;
const request = (file=filename) => GET(new Request(`http://localhost/research-media/${file}?research=1`),{params:Promise.resolve({file})});

afterEach(()=>{process.env=originalEnv;jest.clearAllMocks();});

it.each([
  [{NODE_ENV:"development"},false],
  [{NODE_ENV:"development",STEPANOSKIN_RESEARCH_MODE:"1"},true],
  [{NODE_ENV:"production",STEPANOSKIN_RESEARCH_MODE:"1"},false],
  [{NODE_ENV:"test",STEPANOSKIN_RESEARCH_MODE:"1"},false],
  [{NODE_ENV:"development",STEPANOSKIN_RESEARCH_MODE:"1",VERCEL:"1"},false],
])("requires explicit local development execution: %j",(env,expected)=>{
  expect(isInternalResearchMode(env)).toBe(expected);
});

it("does not read publisher files in production, even with a research flag and URL parameter",async()=>{
  process.env={NODE_ENV:"production",STEPANOSKIN_RESEARCH_MODE:"1"};
  const response=await request();
  expect(response.status).toBe(404);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(read).not.toHaveBeenCalled();
});

it("serves only hashed research images privately in local research mode",async()=>{
  process.env={NODE_ENV:"development",STEPANOSKIN_RESEARCH_MODE:"1"};
  read.mockResolvedValue(Buffer.from("research image"));
  const response=await request();
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("image/webp");
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(response.headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  expect(await response.text()).toBe("research image");
  read.mockClear();
  expect((await request("../../secrets.webp")).status).toBe(404);
  expect(read).not.toHaveBeenCalled();
  read.mockRejectedValue(new Error("missing archive"));
  expect((await request()).status).toBe(404);
});
