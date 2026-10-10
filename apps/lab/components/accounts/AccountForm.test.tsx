import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountForm from "./AccountForm";

jest.mock("@/lib/mexico-city/locale", () => ({
  useLocale: () => ({ locale: "es" }),
}));
const request = jest.fn();
const response = (status: number, data = {}) => ({
  ok: status < 400,
  status,
  json: async () => data,
});
beforeEach(() => {
  request.mockReset();
  global.fetch = request;
});
function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

test("wrong password keeps the email and offers recovery without resetting automatically", async () => {
  request
    .mockResolvedValueOnce(response(401))
    .mockResolvedValueOnce(response(202));
  const success = jest.fn();
  render(<AccountForm next="/mexico-city/play" success={success} />);
  fill("Correo electrónico", "Susy@example.com");
  fill("Contraseña", "wrong-passphrase");
  fireEvent.click(screen.getByRole("button", { name: "Entrar al juego" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "El correo o la contraseña no coinciden",
  );
  expect(request).toHaveBeenCalledTimes(1);
  expect(success).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Olvidé mi contraseña" }));
  expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
    "Susy@example.com",
  );
  expect(screen.queryByLabelText("Contraseña")).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Enviar enlace de recuperación" }),
  );
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Si hay una cuenta con ese correo",
  );
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({
    email: "susy@example.com",
    locale: "es",
  });
});

test("existing-email signup points to login or recovery and does not try another login", async () => {
  request.mockResolvedValue(response(409, { detail: "account_exists" }));
  render(
    <AccountForm
      initialMode="register"
      next="/mexico-city/play"
      success={jest.fn()}
    />,
  );
  fill("Cómo te llamas", "Susy");
  fill("Correo electrónico", "susy@example.com");
  fill("Contraseña", "a-test-passphrase");
  fireEvent.click(
    screen.getByRole("button", { name: "Crear cuenta y entrar" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Ese correo ya tiene una cuenta",
  );
  expect(request).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /^Entrar$/ }));
  expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
    "susy@example.com",
  );
  expect(screen.getByLabelText("Contraseña")).toHaveValue("");
});

test("successful signup authenticates and enters the game", async () => {
  request
    .mockResolvedValueOnce(response(201))
    .mockResolvedValueOnce(response(200));
  const success = jest.fn().mockResolvedValue(undefined);
  render(
    <AccountForm
      initialMode="register"
      next="/mexico-city/play?mode=friends"
      success={success}
    />,
  );
  fill("Cómo te llamas", "Susy");
  fill("Correo electrónico", "susy@example.com");
  fill("Contraseña", "a-test-passphrase");
  fireEvent.click(
    screen.getByRole("button", { name: "Crear cuenta y entrar" }),
  );
  await waitFor(() => expect(success).toHaveBeenCalledTimes(1));
  expect(request.mock.calls.map((call) => call[0])).toEqual([
    "/api/mexico-city/register",
    "/api/auth/login",
  ]);
  expect(JSON.parse(request.mock.calls[1][1].body).next).toBe(
    "/mexico-city/play?mode=friends",
  );
});

test("unconfigured email delivery displays a useful error instead of a false success", async () => {
  request.mockResolvedValue(response(503, { detail: "email_unavailable" }));
  render(
    <AccountForm
      initialMode="forgot"
      next="/mexico-city/play"
      success={jest.fn()}
    />,
  );
  fill("Correo electrónico", "susy@example.com");
  fireEvent.click(
    screen.getByRole("button", { name: "Enviar enlace de recuperación" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "La recuperación por correo todavía no está disponible",
  );
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
