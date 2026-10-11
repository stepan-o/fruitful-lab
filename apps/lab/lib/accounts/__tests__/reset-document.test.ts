/** @jest-environment node */
import { JSDOM } from "jsdom";
import { GET } from "@/app/account/reset/route";

const token = "a".repeat(48);
const request = jest.fn();
let dom: JSDOM;

async function open(locale = "es") {
  request.mockReset();
  dom = new JSDOM(await GET().text(), {
    url: `https://game.test/account/reset?lang=${locale}#token=${token}`,
    runScripts: "dangerously",
    beforeParse(window) {
      window.fetch = request;
    },
  });
}
function choose(password: string, confirmation = password) {
  const document = dom.window.document;
  (document.getElementById("password") as HTMLInputElement).value = password;
  (document.getElementById("confirm") as HTMLInputElement).value = confirmation;
  (document.getElementById("submit") as HTMLButtonElement).click();
}
const settle = () => new Promise<void>((resolve) => setImmediate(resolve));
afterEach(() => dom?.window.close());

test.each(["es", "en"])("reset accepts a simple game password in %s", async (locale) => {
  await open(locale);
  request.mockResolvedValue({ ok: true, status: 200 });
  const document = dom.window.document;
  const password = document.getElementById("password") as HTMLInputElement;
  expect(password.minLength).toBe(1);
  expect(password.required).toBe(true);
  choose("");
  expect(request).not.toHaveBeenCalled();
  choose("a", "b");
  expect(request).not.toHaveBeenCalled();
  choose("a");
  await settle();
  expect(request).toHaveBeenCalledTimes(1);
  expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({ token, password: "a", locale });
  expect(document.getElementById("success")!.hidden).toBe(false);
  expect(dom.window.location.hash).toBe("");
});

test("shared-account password rejection keeps the private link usable for a retry", async () => {
  await open();
  request
    .mockResolvedValueOnce({ ok: false, status: 422, json: async () => ({ detail: "password_too_short" }) })
    .mockResolvedValueOnce({ ok: true, status: 200 });
  choose("a");
  await settle();
  const document = dom.window.document;
  expect(document.getElementById("form")!.hidden).toBe(false);
  expect(document.getElementById("message")!.textContent).toContain("al menos 10 caracteres");
  document.getElementById("language")!.click();
  expect(document.getElementById("message")!.textContent).toContain("at least 10 characters");
  choose("1234567890");
  await settle();
  expect(request).toHaveBeenCalledTimes(2);
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({ token, password: "1234567890", locale: "en" });
  expect(document.getElementById("success")!.hidden).toBe(false);
});
