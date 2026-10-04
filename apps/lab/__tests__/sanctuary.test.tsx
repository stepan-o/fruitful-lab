import { fireEvent, render, screen } from "@testing-library/react";
import Reader from "@/components/sanctuary/Reader";
import { PriceLab, ProbabilityLab } from "@/components/sanctuary/Experiments";
import { appendix, chapters, parts, sources } from "@/lib/sanctuary/content";
import { chapterHref, successProbability } from "@/lib/sanctuary/types";
import { sanctuaryMedia as manifest } from "@/lib/sanctuary/media";
import { readerCopy } from "@/lib/sanctuary/ui";
import { locales } from "@/app/(stepanoskin)/stepanoskin/translations";
import landingManifest from "@/lib/assets/generated/stepanoskin.json";
import { assetUrl, parseManifest } from "@/lib/assets/types";

const play = jest.fn().mockResolvedValue(undefined);
const audio = { play, volume: 0, currentTime: 0 };
const AudioMock = jest.fn(() => audio);
Object.defineProperty(window, "Audio", { writable: true, value: AudioMock });
beforeEach(() => {
  window.localStorage.clear();
  play.mockClear();
});

const refresh = jest.fn();
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest
    .fn()
    .mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
});
jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
const navigation = chapters.map(({ id, title, part }) => ({ id, title, part }));
const props = {
  locale: "en" as const,
  current: null,
  index: -1,
  navigation,
  parts,
  assets: manifest,
  sources: [],
  rules: appendix,
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

describe("Sanctuary reader", () => {
  it("has a complete navigable 22-chapter edition with resolvable evidence and media", () => {
    expect(chapters).toHaveLength(22);
    expect(new Set(chapters.map((c) => c.id)).size).toBe(22);
    expect(new Set(chapters.map((c) => c.part)).size).toBe(7);
    for (const chapter of chapters) {
      expect(chapter.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.evidence.length).toBeGreaterThan(30);
      expect(chapter.visual.diagram.nodes).toHaveLength(4);
      expect(chapter.visual.sceneTitle.length).toBeGreaterThan(3);
      expect(chapter.figures?.some(figure=>figure.asset === chapter.visual.screenshot.asset)).toBe(true);
      for (const [paragraphIndex, ids] of Object.entries(
        chapter.paragraphCitations ?? {},
      )) {
        expect(Number(paragraphIndex)).toBeGreaterThanOrEqual(0);
        expect(Number(paragraphIndex)).toBeLessThan(chapter.paragraphs.length);
        for (const id of ids) expect(chapter.sources).toContain(id);
      }
      for (const section of chapter.sections ?? []) {
        expect(section.at).toBeGreaterThanOrEqual(0);
        expect(section.at).toBeLessThan(chapter.paragraphs.length);
      }
      for (const id of chapter.sources)
        expect(sources.some((s) => s.id === id)).toBe(true);
      for (const figure of chapter.figures ?? []) {
        expect(manifest.assets[figure.asset]?.kind).toBe("image");
        if (figure.afterParagraph !== undefined) {
          expect(figure.afterParagraph).toBeGreaterThanOrEqual(0);
          expect(figure.afterParagraph).toBeLessThan(chapter.paragraphs.length);
          expect(figure.placement).toBeUndefined();
        }
      }
    }
    expect(appendix).toHaveLength(10);
    for (const locale of locales)
      expect(Object.values(readerCopy[locale]).every(Boolean)).toBe(true);
  });
  it("keeps the landing screen to its hero and single study-entry action", () => {
    render(<Reader {...props} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Sanctuary.*Economics/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Enter the study/ }),
    ).toHaveAttribute("href", chapterHref("insert-coin"));
    expect(screen.queryByText("Module loading")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.queryByText("English editorial edition")).not.toBeInTheDocument();
  });
  it("combines credited publisher images with original art in the public edition", () => {
    const index = chapters.findIndex(c => c.id === "the-fork");
    const current = chapters[index];
    const { container } = render(
      <Reader {...props} current={current} index={index} />,
    );
    expect(screen.getByRole("figure", { name: /Diagram:/ })).toBeVisible();
    expect(screen.getByRole("group", { name: "What happens after purchase?" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Chapter" }).querySelector("a:last-child"))
      .toHaveAttribute("href", chapterHref("concord"));
    expect(container.querySelectorAll("img")).toHaveLength(current.figures!.length + 1);
    expect(container.querySelector('[data-inscription="the gap"]')).toHaveTextContent("the gap");
    expect(container.querySelector('[data-inscription="future sales"]')).toHaveTextContent("future sales");
    expect(container.querySelector('[data-inscription="subscription"]')).toHaveTextContent("subscription");
    expect(screen.getByRole("img", { name: "Netflix" })).toHaveAttribute("loading", "lazy");
    expect(screen.getAllByRole("link", { name: /Source & use/ })).toHaveLength(current.figures!.length + 1);
    expect(screen.getByRole("link", { name: /Rights & credits/ })).toHaveAttribute("href", "/stepanoskin/game-monetization/credits");
    expect(container.querySelector("main")).toHaveAttribute(
      "data-media-mode",
      "editorial",
    );
    expect(screen.queryByText(/INTERNAL REFERENCE/)).not.toBeInTheDocument();
  });
  it("opens at the arcade, keeps its evidence inline and continues through the purchase history", () => {
    expect(chapters.slice(0,4).map(c=>c.id)).toEqual(["insert-coin","several-histories","the-fork","concord"]);
    const current = chapters[0];
    const { container } = render(<Reader {...props} current={current} index={0}/>);
    expect(screen.getByRole("heading", { level:1, name:"Insert coin. Join in." })).toBeVisible();
    const openingScene = screen.getByRole("img", {name:/An imagined arcade bar:/});
    const firstParagraph = screen.getByText(current.paragraphs[0]);
    expect(openingScene.compareDocumentPosition(firstParagraph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("group", {name:"Where does the gathering happen?"})).not.toBeInTheDocument();
    expect(container.querySelector("blockquote")).toBeNull();
    expect(screen.queryByRole("img", {name:"Netflix"})).not.toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(6);
    expect(screen.getByRole("navigation", {name:"Chapter"}).querySelector("a:last-child"))
      .toHaveAttribute("href", chapterHref("several-histories"));
    const evidence = screen.getByRole("img", {name:current.figures![0].alt});
    const nextParagraph = screen.getByText(current.paragraphs[current.figures![0].afterParagraph!+1]);
    expect(evidence.compareDocumentPosition(nextParagraph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const image of container.querySelectorAll("img")) expect(image).toHaveAttribute("loading", "lazy");
    const exchange = screen.getByRole("button", {name:"The exchange rate"});
    fireEvent.click(exchange);
    expect(exchange).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/700 is a visible setting here/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", {name:"Room to join"}));
    expect(exchange).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(/joining does not require waiting/)).toBeVisible();
    fireEvent.change(screen.getByRole("combobox", {name:"Health per coin"}), {target:{value:"2000"}});
    expect(screen.getByText(/2,000 health per coin selected/)).toBeVisible();
    expect(screen.getByRole("img", {name:"An original arcade cabinet with its coin door open to show the health-per-coin setting"})).toBeVisible();
    fireEvent.change(screen.getByRole("combobox", {name:"Health per coin"}), {target:{value:"100"}});
    expect(screen.getByText(/100 health per coin selected/)).toBeVisible();
  });
  it("opens and closes contents and persists the navigation language", () => {
    render(<Reader {...props} current={chapters[0]} index={0}/>);
    fireEvent.click(screen.getByRole("button", { name: /Contents/ }));
    expect(screen.getByRole("dialog", { name: "Contents" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Close ×" }));
    expect(
      screen.queryByRole("dialog", { name: "Contents" }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "English" }), {
      target: { value: "ru" },
    });
    expect(document.cookie).toContain("stepanoskin_locale_v1=ru");
    expect(refresh).toHaveBeenCalled();
  });
  it("plays the exact landing clang on chapter activation, with silent hover and persistent mute", () => {
    const {rerender} = render(<Reader {...props} />);
    const link = screen.getByRole("link", { name: /Enter the study/ });
    fireEvent.mouseOver(link);
    fireEvent.focus(link);
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(link, { ctrlKey: true });
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(play).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith(
      assetUrl(parseManifest(landingManifest, "stepanoskin"), "click"),
    );
    rerender(<Reader {...props} current={chapters[0]} index={0}/>);
    fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
    expect(window.localStorage.getItem("stepanoskin_sound_v1")).toBe("off");
    fireEvent.click(screen.getByRole("link", {name:/Next chapter →/}));
    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Motion on" }));
    expect(window.localStorage.getItem("stepanoskin_motion_v1")).toBe("off");
    expect(document.querySelector("main")).toHaveAttribute(
      "data-motion",
      "off",
    );
  });
  it("keeps source notes and chapter links available and mounts zoom on request", () => {
    const index = chapters.findIndex(chapter => chapter.id === "the-reset");
    const current = chapters[index];
    render(
      <Reader
        {...props}
        current={current}
        index={index}
        sources={sources.filter((s) => current.sources.includes(s.id))}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Where progress lives" }),
    ).toBeVisible();
    expect(
      screen
        .getByRole("navigation", { name: "Chapter" })
        .querySelector("a:last-child"),
    ).toHaveAttribute("href", chapterHref(chapters[index + 1].id));
    expect(
      screen.queryByRole("dialog", { name: "Enlarge image" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getAllByRole("button", { name: /Enlarge image:/ })[0],
    );
    expect(screen.getByRole("dialog", { name: "Enlarge image" })).toBeVisible();
  });
  it("links paragraph references to the matching numbered evidence source", () => {
    const current = chapters.find((chapter) => chapter.id === "access")!;
    const evidence = sources.filter((source) =>
      current.sources.includes(source.id),
    );
    render(
      <Reader {...props} current={current} index={13} sources={evidence} />,
    );
    const reference = screen.getByRole("link", {
      name: /^Source 1: Bandai Namco/,
    });
    expect(reference).toHaveAttribute("href", evidence[0].url);
    expect(reference).toHaveTextContent("1");
    expect(
      screen.getByRole("heading", { name: "What does “unlock” unlock?" }),
    ).toBeVisible();
  });
  it("calculates independent fixed-chance attempts, including endpoints", () => {
    expect(successProbability(0, 20)).toBe(0);
    expect(successProbability(100, 20)).toBe(1);
    expect(successProbability(5, 20)).toBeCloseTo(0.641514, 5);
    render(<ProbabilityLab />);
    expect(screen.getByText("64.2%")).toBeVisible();
    fireEvent.change(
      screen.getByRole("slider", { name: /Number of attempts/ }),
      { target: { value: "1" } },
    );
    expect(screen.getByText("5.0%")).toBeVisible();
  });
  it("keeps CAD cash and virtual-currency shortfall separate", () => {
    render(<PriceLab />);
    expect(screen.getByText("400 PT")).toBeVisible();
    fireEvent.change(
      screen.getByRole("combobox", { name: "One pack purchase" }),
      { target: { value: "0" } },
    );
    expect(screen.getByText("1,900 PT")).toBeVisible();
    expect(screen.getByText("Still needed for item")).toBeVisible();
    expect(screen.getAllByText("CAD 6.99")).toHaveLength(2);
  });
});
