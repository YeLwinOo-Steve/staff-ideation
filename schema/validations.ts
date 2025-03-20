import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const departmentSchema = z.object({
  department_name: z.string().min(1, "Department name is required"),
  QACoordinatorID: z.number().positive("QA Coordinator ID is required"),
});

export const ideaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  is_anonymous: z.boolean(),
  category: z.number().positive("Category is required"),
  document: z
    .array(
      z.object({
        file_name: z.string(),
        file_path: z.string(),
      }),
    )
    .optional(),
});

export const systemSettingSchema = z.object({
  idea_closure_date: z.string().min(1, "Idea closure date is required"),
  final_closure_date: z.string().min(1, "Final closure date is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  status: z.boolean(),
});

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role_id: z.string().min(1, "Role is required"),
  department_id: z.string().min(1, "Department is required"),
  permissions_id: z.array(z.string()).optional(),
});
