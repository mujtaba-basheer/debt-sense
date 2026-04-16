import { z } from "zod";

export const addTransactionSchema = z.object({
  type: z.enum(["lent", "borrowed"], {
    message: "Please select a transaction type",
  }),

  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Enter a valid amount")
    .refine((v) => parseFloat(v) > 0, "Amount must be greater than 0"),

  friendId: z
    .string()
    .min(1, "Please select a friend")
    .uuid("Invalid friend"),

  date: z
    .string()
    .min(1, "Date is required")
    .refine((v) => !isNaN(Date.parse(v)), "Enter a valid date"),

  category: z.string().nullable().default(null),

  notes: z.string().max(500, "Notes must be 500 characters or fewer").optional(),

  receipt: z.instanceof(File).optional(),
});

export type AddTransactionValues = z.infer<typeof addTransactionSchema>;

export const addTransactionInitialValues: AddTransactionValues = {
  type: "lent",
  amount: "",
  friendId: "",
  date: new Date().toISOString().split("T")[0],
  category: null,
  notes: "",
  receipt: undefined,
};
