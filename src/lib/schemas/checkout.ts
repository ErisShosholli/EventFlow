import { z } from "zod";
import { PaymentType } from "@/generated/prisma/enums";

const paymentTypeValues = Object.values(PaymentType) as [PaymentType, ...PaymentType[]];

export const checkoutSchema = z.object({
  paymentType: z.enum(paymentTypeValues),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
