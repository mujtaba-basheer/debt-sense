export interface Friend {
  id: string;
  name: string;
  initials: string;
  relation: "Friend" | "Family" | "Work" | "Other";
  gender: "Male" | "Female" | "Other";
  avatar_color: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}
