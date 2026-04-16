import { z } from "zod";

export const addFriendSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or fewer")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),

  relation: z.enum(["Friend", "Family", "Work", "Other"], {
    message: "Please select a relation",
  }),

  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),

  photo: z.instanceof(File).optional(),
});

export type AddFriendValues = z.infer<typeof addFriendSchema>;

export const addFriendInitialValues: AddFriendValues = {
  name: "",
  relation: "Friend",
  gender: "Male",
  photo: undefined,
};
