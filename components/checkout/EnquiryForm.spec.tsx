import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "./EnquiryForm";
import { useWorkspaceStore } from "../../lib/workspace-store";

vi.mock("next/link", () => ({
  default: ({ href, ...props }: { href: string } & React.ComponentProps<"a">) => (
    <a href={href} {...props} />
  ),
}));

describe("EnquiryForm", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({ items: [] });
  });

  it("requires at least one reply method", async () => {
    const user = userEvent.setup();
    useWorkspaceStore.getState().placeProduct("desk-compact");
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText("Your name"), "Casey Example");
    await user.type(screen.getByLabelText("Desired delivery date"), "2030-01-10");
    await user.type(screen.getByLabelText("Delivery location"), "Central district");
    await user.click(screen.getByRole("button", { name: "Send setup enquiry" }));

    expect(await screen.findByText("Add an email address or WhatsApp number.")).toBeInTheDocument();
  });

  it("sends the enquiry and displays a confirmation", async () => {
    const user = userEvent.setup();
    useWorkspaceStore.getState().placeProduct("desk-compact");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText("Your name"), "Casey Example");
    await user.type(screen.getByLabelText("Email optional"), "casey@example.com");
    await user.type(screen.getByLabelText("Desired delivery date"), "2030-01-10");
    await user.type(screen.getByLabelText("Delivery location"), "Central district");
    await user.click(screen.getByRole("button", { name: "Send setup enquiry" }));

    expect(await screen.findByRole("heading", { name: "Your workspace is on its way." })).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body))).toMatchObject({
      enquiry: {
        name: "Casey Example",
        email: "casey@example.com",
        location: "Central district",
      },
      items: [{ productId: "desk-compact", quantity: 1 }],
    });
  });
});
