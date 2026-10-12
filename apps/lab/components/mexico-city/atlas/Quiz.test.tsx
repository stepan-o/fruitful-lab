import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quiz from "./Quiz";
import { LocaleProvider } from "@/lib/mexico-city/locale";
import { QUESTIONS } from "@/lib/mexico-city/atlas/quizzes";
jest.mock("./AtlasMap", () => ({ __esModule: true, default: () => null }));
beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = jest.fn();
});
test("a wrong answer earns nothing, a correction shows one reward, and the next question starts clean", async () => {
  const user = userEvent.setup();
  render(
    <LocaleProvider>
      <Quiz track="history" onExit={jest.fn()} />
    </LocaleProvider>,
  );
  await user.click(screen.getByRole("button", { name: "AICM", exact: true }));
  expect(screen.getByRole("status")).toHaveTextContent("Aún no hay puntos");
  expect(screen.queryByText(/\+25/)).not.toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Cuicuilco", exact: true }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("+25 puntos");
  expect(
    screen.getByRole("button", { name: "Cuicuilco", exact: true }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
    QUESTIONS.history[1].prompt.es,
  );
  expect(window.localStorage.length).toBe(0);
});
test("finishing a run shows a practice completion without an account points total", async () => {
  const user = userEvent.setup();
  const exit = jest.fn();
  render(
    <LocaleProvider>
      <Quiz track="nahuatl" onExit={exit} />
    </LocaleProvider>,
  );
  for (const q of QUESTIONS.nahuatl) {
    await user.click(
      screen.getByRole("button", {
        name: q.options.find((o) => o.id === q.correct)!.label.es,
        exact: true,
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: q === QUESTIONS.nahuatl.at(-1) ? "Terminar" : "Siguiente",
      }),
    );
  }
  expect(screen.getByText(/Completaste 8 preguntas/)).toBeInTheDocument();
  expect(
    screen.getByText(/No se guardan ni modifican tu cuenta/),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Volver a los retos" }));
  expect(exit).toHaveBeenCalledTimes(1);
  expect(window.localStorage.length).toBe(0);
});
