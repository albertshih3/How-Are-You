export const POST_CATEGORIES = {
  wins: {
    label: "Wins & Gratitude",
    icon: "🌟",
    color: "amber",
    description: "Celebrate your achievements and express gratitude for the positive moments in your life.",
  },
  support: {
    label: "Seeking Support",
    icon: "🤝",
    color: "blue",
    description: "Share what you're struggling with and receive compassionate support from the community.",
  },
  coping: {
    label: "Coping Strategies",
    icon: "🧘",
    color: "green",
    description: "Share techniques and strategies that help you manage stress and maintain wellbeing.",
  },
  resources: {
    label: "Resources & Tips",
    icon: "📚",
    color: "purple",
    description: "Share helpful resources, apps, books, or tips that support mental wellness.",
  },
  questions: {
    label: "Questions",
    icon: "❓",
    color: "indigo",
    description: "Ask questions and seek guidance from others who may have similar experiences.",
  },
  reflections: {
    label: "Reflections",
    icon: "💭",
    color: "pink",
    description: "Share your thoughts, realizations, and personal growth insights.",
  },
} as const;

export const POST_PROMPTS = {
  wins: [
    "What's a small victory you'd like to celebrate today?",
    "What moment of gratitude stood out to you recently?",
    "What positive change have you noticed in yourself lately?",
    "What accomplishment, big or small, are you proud of?",
  ],
  support: [
    "What are you struggling with right now?",
    "What's been weighing on your mind lately?",
    "What challenge could use some perspective or support?",
    "What would help you feel less alone right now?",
  ],
  coping: [
    "What strategy has helped you manage stress or difficult emotions?",
    "What self-care practice has been beneficial for you?",
    "What do you do when you're feeling overwhelmed?",
    "What technique helps you stay grounded during tough times?",
  ],
  resources: [
    "What resource has been helpful for your mental health journey?",
    "What book, app, or tool would you recommend to others?",
    "What practical tip has made a difference in your wellbeing?",
    "What professional or community resource has supported you?",
  ],
  questions: [
    "What question about mental health or wellbeing has been on your mind?",
    "What aspect of student life are you seeking advice about?",
    "What would you like to understand better about managing stress?",
    "What experience are you curious to hear others' perspectives on?",
  ],
  reflections: [
    "What insight or realization have you had recently?",
    "What have you learned about yourself through a recent experience?",
    "What pattern or theme are you noticing in your wellness journey?",
    "What shift in perspective has been meaningful for you?",
  ],
} as const;

export const POSTING_RULES = {
  MIN_CONTENT_LENGTH: 50,
  MAX_CONTENT_LENGTH: 2000,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 100,
  COOLDOWN_MINUTES: 30,
  MIN_RESPONSE_LENGTH: 20,
  MAX_RESPONSE_LENGTH: 1000,
} as const;

export const REPORT_REASONS = [
  { value: "harmful", label: "Harmful or triggering content" },
  { value: "spam", label: "Spam or irrelevant content" },
  { value: "inappropriate", label: "Inappropriate or offensive" },
  { value: "misinformation", label: "Misinformation or unsafe advice" },
  { value: "other", label: "Other (please describe)" },
] as const;

export const COMMUNITY_GUIDELINES = {
  title: "Community Guidelines",
  intro: "This is a wellness-focused space for intentional sharing and mutual support. Our community is built on respect, empathy, and authenticity.",
  values: [
    {
      title: "Be Kind & Compassionate",
      description: "Offer support with empathy. Remember that everyone is on their own unique journey.",
    },
    {
      title: "Be Authentic",
      description: "Share your genuine experiences. There's no need to have all the answers or appear perfect.",
    },
    {
      title: "Be Respectful",
      description: "Honor others' experiences and perspectives, even when they differ from your own.",
    },
    {
      title: "Be Thoughtful",
      description: "Consider the impact of your words. Use content warnings when sharing potentially triggering topics.",
    },
  ],
  supportiveBehaviors: [
    "Validating others' feelings and experiences",
    "Sharing from your own experience using 'I' statements",
    "Offering perspective without imposing solutions",
    "Asking clarifying questions with genuine curiosity",
    "Respecting boundaries and diverse coping strategies",
  ],
  unsupportiveBehaviors: [
    "Dismissing or minimizing others' struggles",
    "Giving medical or professional advice (suggest resources instead)",
    "Sharing graphic details without content warnings",
    "Making comparisons or judgments",
    "Pressuring others to take specific actions",
  ],
  crisisResources: {
    intro: "If you or someone you know is in crisis, please reach out for immediate support:",
    resources: [
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        description: "24/7 support via text message",
      },
      {
        name: "National Suicide Prevention Lifeline",
        contact: "Call or text 988",
        description: "24/7 phone support",
      },
      {
        name: "Campus Counseling Services",
        contact: "Check your university's student health portal",
        description: "Free or low-cost counseling for students",
      },
    ],
  },
} as const;
