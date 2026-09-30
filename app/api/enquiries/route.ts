import { getProduct } from "../../../lib/catalog";
import { enquiryPayloadSchema } from "../../../lib/form-schema";

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json({ error: "The enquiry could not be read." }, { status: 400 });
  }

  const parsed = enquiryPayloadSchema.safeParse(requestBody);
  if (!parsed.success) {
    return Response.json(
      { error: "Check the enquiry details and workspace items, then try again." },
      { status: 400 },
    );
  }

  const endpoint = process.env.ENQUIRY_ENDPOINT?.trim();
  if (!endpoint) {
    return Response.json(
      { error: "Enquiry delivery is not configured yet." },
      { status: 503 },
    );
  }

  let destination: URL;
  try {
    destination = new URL(endpoint);
  } catch {
    return Response.json(
      { error: "Enquiry delivery is not configured correctly." },
      { status: 503 },
    );
  }

  if (
    destination.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" && destination.hostname === "localhost")
  ) {
    return Response.json(
      { error: "The enquiry endpoint must use HTTPS." },
      { status: 503 },
    );
  }

  const items = parsed.data.items.map(({ productId, quantity }) => {
    const product = getProduct(productId);
    if (quantity > product.placement.maxQuantity) {
      return null;
    }

    return {
      productId,
      name: product.name,
      quantity,
      monthlyPrice: product.monthlyPrice,
      lineTotal: product.monthlyPrice * quantity,
    };
  });

  if (items.some((item) => item === null)) {
    return Response.json(
      { error: "One or more workspace quantities are no longer available." },
      { status: 400 },
    );
  }

  const validItems = items.filter((item) => item !== null);
  const setup = {
    items: validItems,
    monthlyTotal: validItems.reduce((total, item) => total + item.lineTotal, 0),
  };

  try {
    const headers = new Headers({ "content-type": "application/json" });
    if (process.env.ENQUIRY_API_KEY) {
      headers.set("authorization", `Bearer ${process.env.ENQUIRY_API_KEY}`);
    }

    const response = await fetch(destination, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...parsed.data.enquiry, setup }),
      cache: "no-store",
      redirect: "error",
    });

    if (!response.ok) {
      return Response.json(
        { error: "The enquiry service could not accept this request. Try again shortly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "The enquiry service could not be reached. Try again shortly." },
      { status: 502 },
    );
  }
}
