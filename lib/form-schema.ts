import { z } from "zod";
import { PRODUCT_IDS } from "./catalog";

export const enquiryFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(100),
    email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional(),
    whatsapp: z.string().trim().max(40).optional(),
    deliveryDate: z.iso.date("Choose a valid delivery date."),
    rentalDuration: z.enum(["1 month", "3 months", "6 months", "12 months"]),
    location: z.string().trim().min(3, "Enter a delivery location.").max(180),
    notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional(),
  })
  .refine((values) => Boolean(values.email?.trim() || values.whatsapp?.trim()), {
    path: ["whatsapp"],
    message: "Add an email address or WhatsApp number.",
  });

export const enquiryPayloadSchema = z
  .object({
    enquiry: enquiryFormSchema,
    items: z
      .array(
        z
          .object({
            productId: z.enum(PRODUCT_IDS),
            quantity: z.number().int().positive().max(2),
          })
          .strict(),
    )
      .min(1)
      .max(10)
      .refine(
        (items) => new Set(items.map((item) => item.productId)).size === items.length,
        "List each product once with its total quantity.",
      ),
  })
  .strict();

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;
