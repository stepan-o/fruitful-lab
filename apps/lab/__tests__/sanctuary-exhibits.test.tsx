import { fireEvent, render, screen, within } from "@testing-library/react";
import { chapters } from "@/lib/sanctuary/content";
import { artDirection } from "@/lib/sanctuary/art-direction";
import ChapterDiagram from "@/components/sanctuary/ChapterDiagram";
import ChapterScene from "@/components/sanctuary/ChapterScene";
import {
  Checklist,
  Vault,
  Access,
  Wardrobe,
  Disclosure,
  Encounter,
} from "@/components/sanctuary/plates/Contracts";
import { Transfer } from "@/components/sanctuary/plates/Instruments";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

describe("Sanctuary exhibits", () => {
  it("gives every chapter an original plate and a renderable exhibit without external media", () => {
    expect(Object.keys(artDirection).sort()).toEqual(
      chapters.map((c) => c.id).sort(),
    );
    for (const [index, c] of chapters.entries()) {
      const { container, unmount } = render(
        <>
          <ChapterScene chapter={c.id} index={index} />
          <ChapterDiagram
            chapter={c.id}
            index={index}
            diagram={c.visual.diagram}
          />
        </>,
      );
      expect(
        screen.getByRole("heading", { name: artDirection[c.id].title }),
      ).toBeVisible();
      expect(
        screen.getByRole("figure", {
          name: `Diagram: ${c.visual.diagram.title}`,
        }),
      ).toBeVisible();
      expect(container.querySelector("img,video,audio,image")).toBeNull();
      expect(container.querySelector("dialog svg")).toBeNull();
      unmount();
    }
  });
  it("mounts the enlarged illustration only on request and removes it when closed", () => {
    render(
      <ChapterScene
        chapter={chapters[0].id}
        index={0}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Enlarge illustration:/ }),
    );
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img")).toBeVisible();
    fireEvent.click(
      within(dialog).getByRole("button", { name: /Close illustration/ }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(dialog.querySelector("svg")).toBeNull();
  });
  it("separates the availability policy from identical attendance and effort", () => {
    render(<Checklist />);
    expect(screen.getByText("3 / 4 sessions")).toBeVisible();
    expect(screen.getByText("WINDOW CLOSED")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Progress stays available" }),
    );
    expect(screen.getByText("3 / 4 sessions")).toBeVisible();
    expect(screen.getByText("PROGRESS KEPT")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: /Play one return session/ }),
    );
    expect(screen.getByText("4 / 4 sessions")).toBeVisible();
    expect(screen.getByText("REWARD READY")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Expires after week 4" }),
    );
    expect(screen.getByText("3 / 4 sessions")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /Play one return session/ }),
    ).not.toBeInTheDocument();
  });
  it("requires both vault keys, caps held Favor and allows lifetime earning beyond the cap", () => {
    render(<Vault />);
    const claim = screen.getByRole("button", { name: "Claim for 30 Favor" });
    const earn = screen.getByRole("button", { name: "Earn up to 25 Favor" });
    expect(claim).toBeDisabled();
    for (let i = 0; i < 4; i++) fireEvent.click(earn);
    expect(screen.getByRole("meter", { name: "Favor held" })).toHaveAttribute(
      "aria-valuenow",
      "99",
    );
    expect(earn).toBeDisabled();
    expect(claim).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Simulate catalog unlock" }),
    );
    fireEvent.click(claim);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "69");
    fireEvent.click(earn);
    expect(
      screen.getByText("94 Favor held · 124 earned in this model · 30 spent."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Remove access key" }));
    expect(claim).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Reset the model/ }));
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "0");
  });
  it("keeps remaining effort after purchase and resets it with ownership", () => {
    render(<Access />);
    const work = screen.getByRole("button", {
      name: "Complete the requirement",
    });
    expect(work).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Simulate purchase" }));
    expect(work).toBeEnabled();
    expect(
      screen.getByText(
        "The entitlement changed. The unfinished requirement did not.",
      ),
    ).toBeVisible();
    fireEvent.click(work);
    expect(screen.getByText("BOTH CONDITIONS MET")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reset ownership" }));
    expect(
      screen.getByRole("button", { name: "Complete the requirement" }),
    ).toBeDisabled();
  });
  it("changes appearance without changing mechanical scope", () => {
    render(<Wardrobe />);
    fireEvent.click(screen.getByRole("button", { name: "Ash-bearer" }));
    expect(
      screen.getByRole("img", {
        name: /Ash-bearer appearance; mechanical power unchanged/,
      }),
    ).toBeVisible();
    expect(screen.getByText("UNCHANGED")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Collection", exact: true }),
    );
    expect(
      screen.getByText(/This belongs in a collection I care about/),
    ).toBeVisible();
  });
  it("keeps the contract facts when their presentation changes", () => {
    render(<Disclosure />);
    const facts = [
      "Catalog access, not a finished reward.",
      "Earn and spend a separate claim resource.",
      "Read when this catalog closes.",
      "Check pack cost, item cost and tokens left over.",
    ];
    fireEvent.click(
      screen.getByRole("button", { name: "One complete decision" }),
    );
    for (const fact of facts) expect(screen.getByText(fact)).toBeVisible();
    expect(screen.getAllByText("SAME DECISION")).toHaveLength(4);
  });
  it("changes encounter geometry and explanation when the constraint changes", () => {
    render(<Encounter />);
    fireEvent.click(
      screen.getByRole("button", { name: "Cover blocks approach" }),
    );
    expect(
      screen.getByRole("img", {
        name: "The same attack with cover between player and enemy",
      }),
    ).toBeVisible();
    expect(screen.getByText(/The direct line is closed/)).toBeVisible();
  });
  it("moves the existing character to Eternal and allows rewinding the explanation", () => {
    render(<Transfer />);
    fireEvent.click(screen.getByRole("button", { name: /End the season/ }));
    expect(
      screen.getByText("The existing character continues here."),
    ).toBeVisible();
    expect(screen.getByText(/It was not erased/)).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: /Rewind the transition/ }),
    );
    expect(screen.getByText("The character plays here.")).toBeVisible();
  });
});
