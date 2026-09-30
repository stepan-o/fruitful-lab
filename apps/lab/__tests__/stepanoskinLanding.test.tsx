import { fireEvent, render, screen } from "@testing-library/react";
import StepanoskinLanding from "@/app/(stepanoskin)/stepanoskin/StepanoskinLanding";

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

describe("Stepanoskin landing", () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.cookie = "stepanoskin_locale_v1=; Path=/; Max-Age=0";
        document.documentElement.lang = "en";
    });

    it("defaults to English and links to the first menu module", () => {
        render(<StepanoskinLanding initialLocale="en" />);

        expect(screen.getByRole("heading", { name: "Select a path" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Game Monetization/i })).toHaveAttribute("href", "/stepanoskin/game-monetization");
    });

    it("switches languages and remembers the selection", () => {
        render(<StepanoskinLanding initialLocale="en" />);

        fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
            target: { value: "ru" },
        });

        expect(screen.getByRole("heading", { name: "Выберите направление" })).toBeInTheDocument();
        expect(document.cookie).toContain("stepanoskin_locale_v1=ru");
        expect(document.documentElement.lang).toBe("ru");
    });

    it("persists the sound preference", () => {
        render(<StepanoskinLanding initialLocale="en" />);

        const soundToggle = screen.getByRole("button", { name: "Sound on" });
        fireEvent.click(soundToggle);

        expect(screen.getByRole("button", { name: "Sound off" })).toHaveAttribute("aria-pressed", "false");
        expect(window.localStorage.getItem("stepanoskin_sound_v1")).toBe("off");
    });
});
