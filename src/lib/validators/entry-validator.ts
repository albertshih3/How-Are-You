import { z } from 'zod';
import { MOOD_TYPES, COMMON_TAGS } from '@/lib/constants/moods';

const moodTypeKeys = Object.keys(MOOD_TYPES) as Array<keyof typeof MOOD_TYPES>;

export const EntryValidator = z.object({
  moodType: z.enum(moodTypeKeys as [string, ...string[]], {
    required_error: 'Please select how you\'re feeling',
  }),
  moodIntensity: z
    .number()
    .min(1, { message: 'Intensity must be at least 1' })
    .max(10, { message: 'Intensity cannot exceed 10' }),
  notes: z
    .string()
    .max(500, { message: 'Notes cannot exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  weather: z.string().optional(),
  socialContext: z.array(z.string()).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

export type TEntryValidator = z.infer<typeof EntryValidator>;
