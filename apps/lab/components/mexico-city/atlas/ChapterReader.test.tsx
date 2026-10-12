import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChapterReader from "./ChapterReader";
import { LocaleProvider } from "@/lib/mexico-city/locale";
import { loadChapter } from "@/lib/mexico-city/atlas/history";
jest.mock("../Artwork", () => ({ __esModule: true, default: () => null }));
beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});
test("chapter quiz gives only correct-answer points, locks submitted answers, and leads to the next chapter", async () => {
  const user = userEvent.setup();
  const open = jest.fn();
  render(
    <LocaleProvider>
      <ChapterReader id="basin" back={jest.fn()} openChapter={open} />
    </LocaleProvider>,
  );
  const submit = await screen.findByRole("button", {
    name: "Comprobar respuestas",
  });
  expect(submit).toBeDisabled();
  const chapter = await loadChapter("basin");
  for (const [i, q] of chapter.quiz.entries())
    await user.click(
      screen.getByRole("radio", {
        name: q.options[
          i === 0 ? (q.correct + 1) % q.options.length : q.correct
        ].es,
      }),
    );
  await user.click(submit);
  expect(screen.getByRole("status")).toHaveTextContent(
    "2 / 3 respuestas correctas · +50 puntos",
  );
  for (const radio of screen.getAllByRole("radio"))
    expect(radio).toBeDisabled();
  expect(screen.getAllByText("Una pista para repasar")).toHaveLength(1);
  expect(window.localStorage.length).toBe(0);
  await user.click(
    screen.getByRole("button", { name: "Leer el siguiente capítulo" }),
  );
  expect(open).toHaveBeenCalledWith("chinampas");
});
test("guided figure buttons change the explanation, while full text and its sources stay available", async () => {
  const user = userEvent.setup();
  render(
    <LocaleProvider>
      <ChapterReader id="chinampas" back={jest.fn()} openChapter={jest.fn()} />
    </LocaleProvider>,
  );
  const figure = (
    await screen.findByRole("group", { name: "Vistas del diagrama" })
  ).closest("figure")!;
  await user.click(
    within(figure).getByRole("button", { name: "Canales", exact: true }),
  );
  expect(
    within(figure).getByRole("button", { name: "Canales", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(within(figure).getByText(/aportan lodo para preparar/)).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "La parcela no flota" }),
  ).toBeVisible();
  expect(
    screen.getAllByRole("link", { name: /El chapín/ }).length,
  ).toBeGreaterThan(0);
  expect(document.querySelectorAll(".at-book-passage")).toHaveLength(
    (await loadChapter("chinampas")).sections.flatMap((s) => s.paragraphs)
      .length,
  );
});
