import { fireEvent, render, screen, within } from "@testing-library/react";
import { RivalsInterface, RivalsWallet } from "@/components/sanctuary/RivalsStudies";
import { chapters } from "@/lib/sanctuary/content";
import { chapterVisualSources } from "@/lib/sanctuary/visual-sources";

it("connects the two neighbouring chapters and credits each visual citation", () => {
  const index = chapters.findIndex(chapter => chapter.id === "marvel-rivals");
  expect(chapters.slice(index - 1, index + 2).map(c => c.id)).toEqual(["rockstar-world", "marvel-rivals", "the-fork"]);
  expect(chapterVisualSources(chapters[index]).map(record => record.id)).toEqual([
    "rivals-dolphin", "rivals-wheel", "rivals-gallery", "rivals-selection",
    "rivals-van-dyne", "rivals-incursion", "rivals-art-film",
  ]);
});

it("changes the screenshot, reading and attribution together and loads the film on request", () => {
  render(<RivalsInterface/>);
  expect(screen.getByRole("img", {name:/Development concept for Hulk/})).toBeVisible();
  fireEvent.click(screen.getByRole("button", {name:"Released gallery"}));
  expect(screen.getByRole("img", {name:/grid of illustrated portrait cards/})).toBeVisible();
  expect(screen.getByRole("link", {name:"Source & use"})).toHaveAttribute("href", expect.stringContaining("#rivals-gallery"));
  fireEvent.click(screen.getByRole("button", {name:"Match selection"}));
  expect(screen.getByRole("img", {name:/along an arc/})).toBeVisible();
  expect(screen.queryByTitle(/official Marvel Rivals interface design film/)).toBeNull();
  fireEvent.click(screen.getByRole("button", {name:/Load film/}));
  expect(screen.getByTitle(/official Marvel Rivals interface design film/)).toHaveAttribute("src", expect.stringContaining("youtube-nocookie.com/embed/JaNAqe180Hc"));
  fireEvent.click(screen.getByRole("button", {name:"Close film"}));
  expect(screen.queryByTitle(/official Marvel Rivals interface design film/)).toBeNull();
});

it("uses earned Units before calculating the missing balance", () => {
  render(<RivalsWallet/>);
  const remaining = () => screen.getByText("Still to cover").parentElement!;
  fireEvent.change(screen.getByLabelText("Units already earned"), {target:{value:"1400"}});
  expect(within(remaining()).getByText("200 Units")).toBeVisible();
  fireEvent.click(screen.getByRole("button", {name:"Costume"}));
  expect(within(remaining()).getByText("0 Units")).toBeVisible();
  expect(screen.queryByText("MVP animation")).toBeNull();
  fireEvent.click(screen.getByRole("button", {name:"Play Jeff"}));
  expect(within(screen.getByText("From your balance").parentElement!).getByText("0 Units")).toBeVisible();
});
