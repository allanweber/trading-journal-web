import { z } from 'zod';
import { Direction } from './direction';
import { EntryType } from './entryType';
import { journalSchema } from './journal';

export const tradeSchema = z
  .object({
    id: z.string().optional(),
    journalId: z
      .string({
        required_error: 'journal-required',
      })
      .min(1, { message: 'journal-required' }),
    date: z.coerce.date({
      required_error: 'date-required',
    }),
    price: z
      .number({
        required_error: 'price-required',
        invalid_type_error: 'price-positive',
      })
      .positive({ message: 'price-positive' })
      .max(9999999999, { message: 'price-max' }),

    entryType: z.nativeEnum(EntryType, {
      required_error: 'entry-type-required',
    }),
    description: z
      .string()
      .max(100, {
        message: 'description-max',
      })
      .optional(),
    symbol: z
      .string({
        required_error: 'symbol-required',
      })
      .min(1, { message: 'symbol-required' })
      .max(30, {
        message: 'symbol-max',
      }),
    direction: z.nativeEnum(Direction, {
      required_error: 'direction-required',
    }),
    size: z
      .number({
        required_error: 'size-required',
        invalid_type_error: 'size-positive',
      })
      .positive({ message: 'size-positive' })
      .max(9999999999, { message: 'size-max' }),
    profit: z.coerce
      .number()
      .positive({ message: 'profit-positive' })
      .max(9999999999, { message: 'profit-max' })
      .nullish(),
    loss: z.coerce
      .number()
      .positive({ message: 'loss-positive' })
      .max(9999999999, { message: 'loss-max' })
      .nullish(),
    exitDate: z.coerce.date().nullish(),
    exitPrice: z.coerce
      .number()
      .positive({ message: 'exitPrice-positive' })
      .max(9999999999, { message: 'exitPrice-max' })
      .nullish(),
    costs: z.coerce
      .number()
      .positive({ message: 'costs-positive' })
      .max(9999999999, { message: 'costs-max' })
      .nullish(),
  })
  .superRefine(({ date, exitDate }, context) => {
    if (exitDate && exitDate < date) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'exit-date-after-date',
        path: ['exitDate'],
      });
    }
  });

export const depositSchema = z.object({
  id: z.string().optional(),
  journalId: z
    .string({
      required_error: 'journal-required',
    })
    .min(1, { message: 'journal-required' }),

  date: z.coerce.date({
    required_error: 'date-required',
  }),
  price: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .positive({ message: 'price-positive' })
    .max(9999999999, { message: 'price-max' }),

  entryType: z.nativeEnum(EntryType, {
    required_error: 'entry-type-required',
  }),
  description: z
    .string()
    .max(100, {
      message: 'description-max',
    })
    .optional(),
});

export const withdrawalSchema = z.object({
  id: z.string().optional(),
  journalId: z
    .string({
      required_error: 'journal-required',
    })
    .min(1, { message: 'journal-required' }),
  date: z.coerce.date({
    required_error: 'date-required',
  }),
  price: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .positive({ message: 'price-positive' })
    .max(9999999999, { message: 'price-max' }),

  entryType: z.nativeEnum(EntryType, {
    required_error: 'entry-type-required',
  }),
  description: z
    .string()
    .max(100, {
      message: 'description-max',
    })
    .optional(),
});

export const taxesSchema = z.object({
  id: z.string().optional(),
  journalId: z
    .string({
      required_error: 'journal-required',
    })
    .min(1, { message: 'journal-required' }),
  date: z.coerce.date({
    required_error: 'date-required',
  }),
  price: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .positive({ message: 'price-positive' })
    .max(9999999999, { message: 'price-max' }),

  entryType: z.nativeEnum(EntryType, {
    required_error: 'entry-type-required',
  }),
  description: z
    .string()
    .max(100, {
      message: 'description-max',
    })
    .optional(),
});

export const dividendSchema = z.object({
  id: z.string().optional(),
  journalId: z
    .string({
      required_error: 'journal-required',
    })
    .min(1, { message: 'journal-required' }),
  date: z.coerce.date({
    required_error: 'date-required',
  }),
  price: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .positive({ message: 'price-positive' })
    .max(9999999999, { message: 'price-max' }),

  entryType: z.nativeEnum(EntryType, {
    required_error: 'entry-type-required',
  }),
  description: z
    .string()
    .max(100, {
      message: 'description-max',
    })
    .optional(),
  symbol: z
    .string({
      required_error: 'symbol-required',
    })
    .min(1, { message: 'symbol-required' })
    .max(30, {
      message: 'symbol-max',
    }),
});

export const entrySchema = z.object({
  id: z.string().optional(),
  journalId: z
    .string({
      required_error: 'journal-required',
    })
    .min(1, { message: 'journal-required' }),
  date: z.coerce.date({
    required_error: 'date-required',
  }),
  price: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .positive({ message: 'price-positive' })
    .max(9999999999, { message: 'price-max' }),
  result: z
    .number({
      required_error: 'price-required',
      invalid_type_error: 'price-positive',
    })
    .max(9999999999, { message: 'price-max' }),
  entryType: z.nativeEnum(EntryType, {
    required_error: 'entry-type-required',
  }),
  description: z
    .string()
    .max(100, {
      message: 'description-max',
    })
    .optional(),
  symbol: z.string().optional(),
  direction: z.nativeEnum(Direction).optional(),
  size: z
    .number()
    .positive({ message: 'size-positive' })
    .max(9999999999, { message: 'size-max' })
    .optional(),
  profit: z.coerce
    .number()
    .positive({ message: 'profit-positive' })
    .max(9999999999, { message: 'profit-max' })
    .optional(),
  loss: z.coerce
    .number()
    .positive({ message: 'loss-positive' })
    .max(9999999999, { message: 'loss-max' })
    .optional(),
  exitDate: z.coerce.date().optional(),
  exitPrice: z.coerce
    .number()
    .positive({ message: 'exitPrice-positive' })
    .max(9999999999, { message: 'exitPrice-max' })
    .optional(),
  costs: z.coerce
    .number()
    .positive({ message: 'costs-positive' })
    .max(9999999999, { message: 'costs-max' })
    .optional(),
  grossResult: z.number().optional(),
  accountChange: z.number().optional(),
  journal: journalSchema,
});

export type Trade = z.infer<typeof tradeSchema>;
export type Deposit = z.infer<typeof depositSchema>;
export type Withdrawal = z.infer<typeof withdrawalSchema>;
export type Taxes = z.infer<typeof taxesSchema>;
export type Dividend = z.infer<typeof dividendSchema>;
export type Entry = z.infer<typeof entrySchema>;
