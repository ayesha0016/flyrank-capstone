import { z } from 'zod'

export const settingsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(200, 'Bio must be 200 characters or fewer')
    .optional(),
  emailNotifications: z.boolean(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>

export function saveSettings(_values: SettingsFormValues): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}
