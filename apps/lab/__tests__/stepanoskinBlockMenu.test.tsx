import { act, fireEvent, render, screen } from "@testing-library/react";
import StepanoskinLanding from "@/app/(stepanoskin)/stepanoskin/StepanoskinLanding";

const mockPush = jest.fn();
const mockPlayClang = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@/lib/stepanoskin/audio", () => ({ playClang: () => mockPlayClang() }));
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })),
});

beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
    mockPlayClang.mockClear();
    localStorage.clear();
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

it("plays the shared sound once and navigates after the short impact", () => {
    render(<StepanoskinLanding initialLocale="en" />);
    const cv = screen.getByRole("link", { name: "Data Science — Professional CV" });
    fireEvent.click(cv);
    fireEvent.click(cv);
    expect(mockPlayClang).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(170));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/stepanoskin/production-systems");
});

it("navigates immediately when motion is paused", () => {
    localStorage.setItem("stepanoskin_motion_v1", "off");
    render(<StepanoskinLanding initialLocale="en" />);
    fireEvent.click(screen.getByRole("link", { name: "Data Science — Professional CV" }));
    expect(mockPush).toHaveBeenCalledWith("/stepanoskin/production-systems");
    expect(mockPlayClang).toHaveBeenCalledTimes(1);
});

it("cancels a pending navigation when the menu unmounts", () => {
    const { unmount } = render(<StepanoskinLanding initialLocale="en" />);
    fireEvent.click(screen.getByRole("link", { name: "Data Science — Professional CV" }));
    unmount();
    act(() => jest.advanceTimersByTime(170));
    expect(mockPush).not.toHaveBeenCalled();
});
