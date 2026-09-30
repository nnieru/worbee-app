import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkspaceBuilder } from "./WorkspaceBuilder";
import { useWorkspaceStore } from "../../lib/workspace-store";

vi.mock("next/image", () => ({ default: () => null }));

vi.mock("next/link", () => ({
  default: ({ href, ...props }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props} />
  ),
}));

describe("WorkspaceBuilder", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({
      items: [],
      activeCategory: "desk",
      selectedItemId: null,
      statusMessage: "Choose a desk to start your setup.",
      persistenceMessage: "",
      undoItems: null,
      undoLabel: "",
    });
  });

  it("updates the preview and summary as items are chosen, then supports reset and undo", async () => {
    const user = userEvent.setup();
    render(<WorkspaceBuilder />);

    const deskCard = screen.getByRole("heading", { name: "Compact oak desk" }).closest("article");
    expect(deskCard).not.toBeNull();
    await user.click(within(deskCard as HTMLElement).getByRole("button", { name: "Choose" }));

    expect(screen.getByRole("button", { name: "Select Compact oak desk" })).toBeInTheDocument();
    expect(screen.getAllByText("250.000", { exact: false })).not.toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.queryByRole("button", { name: "Select Compact oak desk" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Workspace restored." })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Workspace restored." }));
    expect(screen.getByRole("button", { name: "Select Compact oak desk" })).toBeInTheDocument();
  });

  it("explains when an accessory needs a desk", async () => {
    const user = userEvent.setup();
    render(<WorkspaceBuilder />);

    await user.click(screen.getByRole("tab", { name: "Accessories" }));
    await user.click(screen.getByRole("button", { name: "Add External monitor" }));

    expect(screen.getByText("Choose a desk before adding desktop accessories.")).toBeInTheDocument();
  });

  it("supports arrow-key navigation between category tabs", async () => {
    const user = userEvent.setup();
    render(<WorkspaceBuilder />);

    const desksTab = screen.getByRole("tab", { name: "Desks" });
    desksTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Chairs" })).toHaveAttribute("aria-selected", "true");
  });
});
