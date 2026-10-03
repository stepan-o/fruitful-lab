import { fireEvent, render, screen } from "@testing-library/react";
import StepanoskinLanding from "@/app/(stepanoskin)/stepanoskin/StepanoskinLanding";
import LoopforgeLanding from "@/app/(stepanoskin)/stepanoskin/loopforge/LoopforgeLanding";

jest.mock("@/components/loopforge/factory-renderer", () => ({ createFactoryRenderer: () => null }));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe("Stepanoskin landing", () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.cookie = "stepanoskin_locale_v1=; Path=/; Max-Age=0";
        document.documentElement.lang = "en";
    });

    it("offers all three projects and an About destination without the factory entrance", () => {
        render(<StepanoskinLanding initialLocale="en" />);

        expect(screen.getByRole("heading", { name: "Systems, economies & imagined worlds." })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Data Science & Production Systems/i })).toHaveAttribute("href", "/stepanoskin/production-systems");
        expect(screen.getByRole("link", { name: /Game Monetization/i })).toHaveAttribute("href", "/stepanoskin/game-monetization");
        expect(screen.getByRole("link", { name: /Loopforge/i })).toHaveAttribute("href", "/stepanoskin/loopforge");
        expect(screen.getByRole("link", { name: /About/i })).toHaveAttribute("href", "/stepanoskin/about");
        expect(screen.queryByAltText("Loopforge — AI Brain Factory")).not.toBeInTheDocument();
    });

    it("switches languages and remembers the selection", () => {
        render(<StepanoskinLanding initialLocale="en" />);

        fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
            target: { value: "ru" },
        });

        expect(screen.getByRole("heading", { name: "Системы, экономики и придуманные миры." })).toBeInTheDocument();
        expect(document.cookie).toContain("stepanoskin_locale_v1=ru");
        expect(document.documentElement.lang).toBe("ru");
    });

    it("keeps the factory entrance focused on Loopforge and links back to all projects", () => {
        render(<LoopforgeLanding initialLocale="en" />);
        expect(screen.getByRole("link", { name: /all projects/i })).toHaveAttribute("href", "/stepanoskin");
        expect(screen.getByRole("link", { name: /Loopforge — the game/i })).toHaveAttribute("href", "/stepanoskin/loopforge/overview/the-factory");
        expect(screen.getByRole("link", { name: /Loopforge — the engine/i })).toHaveAttribute("href", "/stepanoskin/loopforge/architecture/the-thesis");
        expect(screen.getByRole("link", { name: /Enter the factory/i })).toHaveAttribute("href", "/stepanoskin/loopforge/play");
        expect(screen.queryByRole("link", { name: /Game Monetization/i })).not.toBeInTheDocument();
    });

    it("persists the factory sound preference", () => {
        render(<LoopforgeLanding initialLocale="en" />);

        const soundToggle = screen.getByRole("button", { name: "Sound on" });
        fireEvent.click(soundToggle);

        expect(screen.getByRole("button", { name: "Sound off" })).toHaveAttribute("aria-pressed", "false");
        expect(window.localStorage.getItem("stepanoskin_sound_v1")).toBe("off");
    });

    it("loads the versioned sound only on activation, with silent hover and focus", () => {
        const play = jest.fn().mockResolvedValue(undefined);
        const audio = jest.spyOn(window, "Audio").mockImplementation(() => ({ play, currentTime: 0 }) as unknown as HTMLAudioElement);
        render(<LoopforgeLanding initialLocale="en" />);
        const link = screen.getByRole("link", { name: /Loopforge — the game/i });
        fireEvent.pointerEnter(link);
        fireEvent.focus(link);
        expect(audio).not.toHaveBeenCalled();
        fireEvent.click(link);
        expect(audio).toHaveBeenCalledWith(expect.stringMatching(/^\/media\/files\/[a-f0-9]{64}\.mp3$/));
        expect(play).toHaveBeenCalledTimes(1);
        audio.mockRestore();
    });
});
