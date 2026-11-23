import { money, monthlyCost, savedMarker, type SavedItem } from "./saved-city";
const item = (data: SavedItem["data"], kind: SavedItem["kind"] = "rent") =>
  ({ id: "a", kind, url: "https://example.com/flat", data }) as SavedItem;
it("preserves explicit free prices and distinguishes unknown prices and currencies", () => {
  expect(money({ price: 0, currency: "MXN" })).toBe("0 MXN");
  expect(money({ price: 0 })).toBe("0 ?");
  expect(money({}, "en")).toBe("Price unknown");
});
it("only totals rent with an explicit monthly basis and known maintenance", () => {
  expect(
    monthlyCost(item({ price: 22000, pricePeriod: "month", maintenance: 0 })),
  ).toBe(22000);
  expect(monthlyCost(item({ price: 22000, maintenance: 1200 }))).toBeNull();
  expect(monthlyCost(item({ price: 22000, pricePeriod: "month" }))).toBeNull();
  expect(
    monthlyCost(
      item({ price: 22000, pricePeriod: "month", maintenance: 1200 }, "buy"),
    ),
  ).toBeNull();
});
it("never fabricates a position and retains uncertainty on imported coordinates", () => {
  expect(savedMarker(item({ address: "Roma" }))).toBeNull();
  expect(
    savedMarker(item({ lat: 19.4, lng: -99.1, precision: "source" })),
  ).toMatchObject({ approximate: true, lat: 19.4, lng: -99.1 });
  expect(
    savedMarker(item({ lat: 19.4, lng: -99.1, precision: "exact" })),
  ).toMatchObject({ approximate: false });
});
