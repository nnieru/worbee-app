"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { enquiryFormSchema, type EnquiryFormValues } from "../../lib/form-schema";
import { getWorkspaceSummary } from "../../lib/pricing";
import { useWorkspaceStore } from "../../lib/workspace-store";

function getTodayDate(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

export function EnquiryForm() {
  const items = useWorkspaceStore((state) => state.items);
  const summary = getWorkspaceSummary(items);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      email: "",
      whatsapp: "",
      rentalDuration: "1 month",
      notes: "",
    },
  });

  async function onSubmit(values: EnquiryFormValues) {
    setSubmitError("");
    if (summary.itemCount === 0) {
      setSubmitError("Add at least one item to your workspace before sending an enquiry.");
      return;
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          enquiry: values,
          items: summary.items.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });

      const body: unknown = await response.json();
      if (!response.ok) {
        const message =
          body &&
          typeof body === "object" &&
          "error" in body &&
          typeof body.error === "string"
            ? body.error
            : "We couldn't send your enquiry. Please try again.";
        setSubmitError(message);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("We couldn't reach the enquiry service. Check your connection and try again.");
    }
  }

  if (submitted) {
    return (
      <section className="enquiry-success" role="status" aria-live="polite">
        <span className="success-mark" aria-hidden="true">✓</span>
        <span className="eyebrow">Enquiry sent</span>
        <h2>Your workspace is on its way.</h2>
        <p>We’ve received your setup and contact details. We’ll follow up to confirm availability and delivery.</p>
        <Link href="/" className="text-link">Back to your workspace</Link>
      </section>
    );
  }

  return (
    <section className="enquiry-card" aria-labelledby="enquiry-title">
      <div className="enquiry-heading">
        <span className="eyebrow">One last step</span>
        <h2 id="enquiry-title">Tell us where to reach you</h2>
        <p>Share a few details and we’ll follow up about the setup.</p>
      </div>

      {submitError && (
        <div className="form-alert" role="alert">
          <span aria-hidden="true">!</span>
          {submitError}
        </div>
      )}

      <form className="enquiry-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-field">
          <label htmlFor="name">Your name</label>
          <input id="name" autoComplete="name" placeholder="Name" {...register("name")} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="form-grid-two">
          <div className="form-field">
            <label htmlFor="email">Email <span>optional</span></label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="whatsapp">WhatsApp <span>optional</span></label>
            <input
              id="whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="+62 812 3456 7890"
              {...register("whatsapp")}
            />
            {errors.whatsapp && <span className="field-error">{errors.whatsapp.message}</span>}
          </div>
        </div>
        <p className="field-hint">Provide an email or WhatsApp number so we can reply.</p>

        <div className="form-grid-two">
          <div className="form-field">
            <label htmlFor="deliveryDate">Desired delivery date</label>
            <input
              id="deliveryDate"
              type="date"
              min={getTodayDate()}
              {...register("deliveryDate")}
            />
            {errors.deliveryDate && <span className="field-error">{errors.deliveryDate.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="rentalDuration">Rental duration</label>
            <select id="rentalDuration" {...register("rentalDuration")}>
              <option>1 month</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
            {errors.rentalDuration && <span className="field-error">{errors.rentalDuration.message}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="location">Delivery location</label>
          <input
            id="location"
            autoComplete="street-address"
            placeholder="Area, building, or address"
            {...register("location")}
          />
          {errors.location && <span className="field-error">{errors.location.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="notes">Anything else? <span>optional</span></label>
          <textarea
            id="notes"
            rows={3}
            maxLength={500}
            placeholder="Access notes, preferences, or questions"
            {...register("notes")}
          />
          {errors.notes && <span className="field-error">{errors.notes.message}</span>}
        </div>

        <button type="submit" className="button button-dark submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending enquiry…" : "Send setup enquiry"}
          {!isSubmitting && <span aria-hidden="true">↗</span>}
        </button>
        <p className="form-privacy-note">Your details are used to respond to this enquiry.</p>
      </form>
    </section>
  );
}
