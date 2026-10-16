/**
 * Request schemas shared by API routes and client forms, so validation rules
 * (and error messages) are defined exactly once.
 */
import { z } from "zod";

const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(254);
const SIZES = ["XS", "S", "M", "L", "XL"] as const;

/** Honeypot: real users never see or fill this field. */
const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email,
  subject: z.string().trim().min(3, "Add a short subject").max(120),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
  orderNumber: z
    .string()
    .trim()
    .max(20)
    .regex(/^$|^EL-?\d{5}$/i, "Order numbers look like EL-10421")
    .optional(),
  company: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email,
  source: z.enum(["footer", "popup", "checkout"]).default("footer"),
  company: honeypot,
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  author: z.string().trim().min(2, "Please add your name").max(60),
  email,
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short title").max(100),
  body: z.string().trim().min(15, "Share a little more (15+ characters)").max(1500),
  sizePurchased: z.enum(SIZES).optional(),
  fit: z.enum(["Runs small", "True to size", "Runs large"]).optional(),
  company: honeypot,
});
export type ReviewInput = z.infer<typeof reviewSchema>;

const cartLine = z.object({
  productId: z.string().min(1),
  color: z.string().min(1),
  size: z.enum(SIZES),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  email,
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  country: z.string().trim().min(2, "Select a country"),
  address1: z.string().trim().min(4, "Address is required").max(160),
  city: z.string().trim().min(2, "City is required").max(80),
  postalCode: z.string().trim().min(3, "Postal code is required").max(12),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number for delivery updates")
    .max(20)
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces, + ( ) or -"),
  shippingMethod: z.enum(["standard", "express"]),
  marketingOptIn: z.boolean().optional(),
  items: z.array(cartLine).min(1, "Your bag is empty").max(30),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Card fields are validated in the browser only and never sent to the server. */
export const cardSchema = z.object({
  cardName: z.string().trim().min(2, "Name on card is required"),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\d{13,19}$/.test(v), "Enter a valid card number"),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/, "Use MM / YY"),
  cvc: z.string().trim().regex(/^\d{3,4}$/, "3 or 4 digits"),
});

export const abandonedCartSchema = z.object({
  cartId: z.string().min(1).max(64),
  email,
  items: z.array(cartLine).min(1).max(30),
});

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(20)
    .default([]),
  escalateEmail: z.string().email().optional(),
});
