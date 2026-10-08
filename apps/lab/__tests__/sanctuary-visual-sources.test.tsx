import { render, screen, within } from "@testing-library/react";
import VisualSources from "@/components/sanctuary/VisualSources";
import CreditsPage from "@/app/(stepanoskin)/stepanoskin/game-monetization/credits/page";
import { chapters } from "@/lib/sanctuary/content";
import { chapterVisualSources, visualSourceRecords } from "@/lib/sanctuary/visual-sources";
import { coverReferences } from "@/lib/sanctuary/cover-references";

const chapter = (id: string) => chapters.find(chapter => chapter.id === id)!;

it("indexes only cited works, including embedded wordmarks and reference illustrations", () => {
  expect(chapterVisualSources(chapter("insert-coin")).map(record => record.id)).toEqual(["pong-cabinet", "pong-doubles-social-1973"]);
  const fork = chapterVisualSources(chapter("platform-business"));
  expect(fork.map(record => record.id)).toEqual(expect.arrayContaining(["netflix-wordmark", ...coverReferences.map(cover => cover.id)]));
  for (const item of chapters) {
    const records = chapterVisualSources(item);
    expect(new Set(records.map(record => record.id)).size).toBe(records.length);
    for (const figure of item.figures ?? []) expect(records.some(record => record.id === figure.asset)).toBe(true);
    for (const record of records) {
      expect(record.id in visualSourceRecords || coverReferences.some(cover => cover.id === record.id)).toBe(true);
      expect(record.recordHref).toBe(`/stepanoskin/game-monetization/credits#${record.id}`);
      expect(record).not.toHaveProperty("description");
      expect(record).not.toHaveProperty("behavior");
    }
  }
});

it("provides direct source and rights links without copying captions or design explanations", () => {
  const records = chapterVisualSources(chapter("insert-coin"));
  const { container } = render(<VisualSources records={records}/>);
  const disclosure = container.querySelector("details")!;
  expect(disclosure).not.toHaveAttribute("open");
  disclosure.open = true;
  expect(screen.getByText("Visual sources & use")).toBeVisible();
  expect(screen.getAllByRole("link")).toHaveLength(4);
  expect(screen.getByRole("link", {name:`Source for ${records[0].title}`})).toHaveAttribute("href", records[0].sourceUrl);
  expect(screen.getByRole("link", {name:`Rights and use record for ${records[0].title}`})).toHaveAttribute("href", records[0].recordHref);
  for (const figure of chapter("insert-coin").figures ?? []) expect(screen.queryByText(figure.caption)).not.toBeInTheDocument();
  expect(screen.queryByText(/Motion & interaction|About the visuals|How these images were made/)).not.toBeInTheDocument();
});

it("does not invent a source URL for a supplied capture or render an empty disclosure", () => {
  const supplied = chapters.flatMap(chapterVisualSources).find(record => record.sourceUrl === null)!;
  const { rerender } = render(<VisualSources records={[supplied]}/>);
  expect(screen.getAllByRole("link", {hidden:true})).toHaveLength(1);
  expect(screen.queryByRole("link", {name:`Source for ${supplied.title}`,hidden:true})).not.toBeInTheDocument();
  rerender(<VisualSources records={[]}/>);
  expect(screen.queryByText("Visual sources & use")).not.toBeInTheDocument();
});

it("keeps attribution, licensing and analytical use in the register and removes the art commentary", () => {
  const { container } = render(<CreditsPage/>);
  const photo = within(container.querySelector("#pong-cabinet") as HTMLElement);
  expect(photo.getByText(/Photograph by Rob Boudon; crop and retouching by Ubcule/)).toBeVisible();
  expect(photo.getByRole("link", {name:/Creative Commons Attribution 2.0/})).toHaveAttribute("href", "https://creativecommons.org/licenses/by/2.0/");
  expect(photo.getByText("Analytical purpose")).toBeVisible();
  expect(photo.getByText("Use basis")).toBeVisible();
  expect(photo.getByText("Use reviewed")).toBeVisible();
  const gauntlet = within(container.querySelector("#gauntlet-flyer-front-1985") as HTMLElement);
  expect(gauntlet.queryByRole("link", {name:"Insert coin. Join in. ↗"})).not.toBeInTheDocument();
  expect(screen.queryByText("The original visual atlas")).not.toBeInTheDocument();
  expect(screen.queryByText(/Motion & interaction/)).not.toBeInTheDocument();
  for (const cover of coverReferences) {
    expect(container.querySelector(`#${cover.id}`)).not.toBeNull();
    expect(screen.queryByText(cover.detail)).not.toBeInTheDocument();
  }
});
