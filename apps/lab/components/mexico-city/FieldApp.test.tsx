import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FieldApp from "./FieldApp";

const mockFocus = jest.fn();
jest.mock("./FieldMap", () => {
  const React = jest.requireActual("react");
  return {
    __esModule: true,
    default: React.forwardRef(function MapStub(
      props: { objective?: { id: string } },
      ref: React.Ref<unknown>,
    ) {
      React.useImperativeHandle(ref, () => ({
        focus: mockFocus,
        center: () => ({ lat: 19.43, lng: -99.13 }),
      }));
      return (
        <div data-testid="field-map" data-objective={props.objective?.id} />
      );
    }),
  };
});

beforeAll(() => {
  const { serialize, deserialize } = jest.requireActual("node:v8");
  global.structuredClone = (value) => deserialize(serialize(value));
  Object.defineProperty(crypto, "randomUUID", {
    value: jest.requireActual("node:crypto").randomUUID,
  });
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/mexico-city/play?demo=1");
  mockFocus.mockClear();
});
const openGame = () =>
  render(
    <FieldApp
      initialUser={null}
      guest={false}
      demo
      initialMode="home"
      invite=""
    />,
  );

test("starts on the play field and keeps the same map when switching focused mode screens", () => {
  openGame();
  const map = screen.getByTestId("field-map");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Tu siguiente hallazgo no está en esta pantalla."),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Aventura" }));
  expect(screen.getByRole("dialog", { name: "Aventura" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cerrar Aventura" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Amigos/ }));
  expect(screen.getByRole("dialog", { name: "Amigos" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cerrar Amigos" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByTestId("field-map")).toBe(map);
  expect(screen.getByRole("button", { name: /Amigos/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("selecting a geographic goal returns to the map, exposes its objective and can recenter it", async () => {
  openGame();
  const map = screen.getByTestId("field-map");
  fireEvent.click(screen.getByRole("button", { name: "Aventura" }));
  fireEvent.click(
    screen.getByRole("button", { name: /Dos épocas en una foto/ }),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(screen.getByTestId("field-map")).toBe(map);
  expect(map).toHaveAttribute("data-objective", "history");
  expect(mockFocus).toHaveBeenCalledWith({ lat: 19.425283, lng: -99.132708 });
  fireEvent.click(
    screen.getByRole("button", { name: "Mostrar mi objetivo en el mapa" }),
  );
  expect(mockFocus).toHaveBeenCalledTimes(2);
});

test("an open exploration goal has no invented destination and keeps a visible next action", async () => {
  openGame();
  fireEvent.click(screen.getByRole("button", { name: "Aventura" }));
  fireEvent.click(
    screen.getByRole("button", { name: /Una librería que no conocías/ }),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(mockFocus).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: "Mostrar mi objetivo en el mapa" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Tú eliges dónde · foto + lugar"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Guardar un hallazgo" }),
  ).toBeInTheDocument();
});

test("browser Back dismisses a focused mode without replacing the map", () => {
  openGame();
  const map = screen.getByTestId("field-map");
  fireEvent.click(screen.getByRole("button", { name: "Aventura" }));
  window.history.replaceState({}, "", "/mexico-city/play?demo=1&mode=home");
  fireEvent.popState(window);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByTestId("field-map")).toBe(map);
});

test("the single Explore shortcut leads to the expansion landing", () => {
  openGame();
  expect(screen.getByRole("link", { name: /Explorar/ })).toHaveAttribute(
    "href",
    "/mexico-city/explore?from=demo",
  );
});
