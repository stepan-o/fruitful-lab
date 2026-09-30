import { fireEvent, render, screen } from "@testing-library/react";
import StepanoskinLanding from "@/app/(stepanoskin)/stepanoskin/StepanoskinLanding";

describe("Stepanoskin landing", () => {
    beforeEach(() => {
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
});
