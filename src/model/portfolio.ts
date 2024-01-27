import { z } from "zod";

export const portfolioSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: "name-required",
    })
    .min(5, {
      message: "name-min",
    })
    .max(30, {
      message: "name-max",
    }),
  description: z.string().optional(),
  startDate: z.coerce.date({
    required_error: "start-date-required",
  }),
  startBalance: z.coerce
    .number({
      required_error: "start-balance-required",
      invalid_type_error: "start-balance-positive",
    })
    .gte(0, { message: "start-balance-positive" })
    .max(9999999999, { message: "start-balance-max" }),
  currency: z.string({
    required_error: "currency-required",
  }),
  currentBalance: z.coerce.number().optional(),
});

export const portfolioBalanceSchema = z.object({
  balance: z.coerce.number(),
  startBalance: z.coerce.number(),
});

export type Portfolio = z.infer<typeof portfolioSchema>;
export type PortfolioBalance = z.infer<typeof portfolioBalanceSchema>;
