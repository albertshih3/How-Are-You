import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type Identity = {
  tokenIdentifier: string;
  subject?: string;
  name?: string;
  email?: string;
};

function getStableUserId(identity: Identity) {
  return identity.subject ?? identity.tokenIdentifier;
}

// Curated mental health articles for students
const SEED_ARTICLES = [
  {
    title: "5 Mindfulness Techniques for Exam Stress",
    description: "Simple breathing exercises and grounding techniques to help manage anxiety during high-pressure academic periods.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    externalLink: "https://www.headspace.com/meditation/stress",
    tags: ["anxiety", "stress", "academic-pressure", "mindfulness"],
    category: "stress-management",
  },
  {
    title: "Building Healthy Sleep Habits in College",
    description: "Evidence-based strategies for improving sleep quality and establishing consistent sleep routines despite a busy schedule.",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
    externalLink: "https://www.sleepfoundation.org/sleep-hygiene",
    tags: ["sleep", "self-care", "wellness"],
    category: "self-care",
  },
  {
    title: "Recognizing and Managing Academic Burnout",
    description: "Learn the signs of burnout and practical steps to recover your motivation and well-being.",
    imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88",
    externalLink: "https://www.verywellmind.com/stress-and-burnout-symptoms-and-causes-3144516",
    tags: ["stress", "burnout", "academic-pressure", "overwhelmed"],
    category: "stress-management",
  },
  {
    title: "Navigating Relationships and Boundaries",
    description: "Setting healthy boundaries in friendships, romantic relationships, and with family while at school.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    externalLink: "https://www.psychologytoday.com/us/blog/romantically-attached/202110/how-set-boundaries-in-relationships",
    tags: ["relationships", "boundaries", "social"],
    category: "relationships",
  },
  {
    title: "Quick Exercises to Boost Your Mood",
    description: "Short, effective physical activities that can improve mental health even with a packed schedule.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    externalLink: "https://www.health.harvard.edu/mind-and-mood/exercise-is-an-all-natural-treatment-to-fight-depression",
    tags: ["exercise", "self-care", "wellness", "depression"],
    category: "self-care",
  },
  {
    title: "Understanding and Managing Social Anxiety",
    description: "Practical tips for navigating social situations and building confidence in group settings.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    externalLink: "https://www.anxietycanada.com/articles/what-is-social-anxiety-disorder/",
    tags: ["anxiety", "social", "self-esteem"],
    category: "mental-health",
  },
  {
    title: "Time Management for Student Mental Health",
    description: "Balance academics, social life, and self-care with effective planning strategies.",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    externalLink: "https://www.mindtools.com/pages/article/newHTE_00.htm",
    tags: ["stress", "academic-pressure", "organization"],
    category: "productivity",
  },
  {
    title: "When to Seek Professional Help",
    description: "Understanding the signs that it's time to talk to a counselor or therapist, and how to access campus resources.",
    imageUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
    externalLink: "https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Finding-a-Mental-Health-Professional",
    tags: ["mental-health", "therapy", "support"],
    category: "mental-health",
  },
  {
    title: "Coping with Homesickness and Loneliness",
    description: "Strategies for dealing with feelings of isolation and staying connected to loved ones.",
    imageUrl: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f",
    externalLink: "https://www.psychologytoday.com/us/blog/the-gen-y-psy/202009/homesickness-what-it-is-and-how-cope",
    tags: ["loneliness", "social", "homesickness", "sad"],
    category: "emotional-health",
  },
  {
    title: "Healthy Ways to Manage Anger and Frustration",
    description: "Constructive techniques for processing and expressing difficult emotions.",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a",
    externalLink: "https://www.apa.org/topics/anger/control",
    tags: ["anger", "emotions", "coping"],
    category: "emotional-health",
  },
  {
    title: "Finding Joy: Small Pleasures in Daily Life",
    description: "Cultivating gratitude and noticing positive moments even during difficult times.",
    imageUrl: "https://images.unsplash.com/photo-1470218091926-22a08a325802",
    externalLink: "https://greatergood.berkeley.edu/article/item/five_ways_to_cultivate_gratitude",
    tags: ["happiness", "gratitude", "self-care", "calm"],
    category: "wellness",
  },
  {
    title: "Managing Test Anxiety: Before, During, and After",
    description: "Proven strategies to reduce anxiety and perform your best on exams.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    externalLink: "https://www.anxietycanada.com/articles/test-anxiety/",
    tags: ["anxiety", "academic-pressure", "stress"],
    category: "academic",
  },
];

export const seedArticles = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if articles already exist
    const existing = await ctx.db.query("articles").first();
    if (existing) {
      return { message: "Articles already seeded" };
    }

    // Insert all seed articles
    const promises = SEED_ARTICLES.map((article) =>
      ctx.db.insert("articles", article)
    );

    await Promise.all(promises);

    return { message: `Seeded ${SEED_ARTICLES.length} articles` };
  },
});

export const getRecommendedArticles = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const limit = args.limit ?? 3;

    // Get user's recent entries to analyze mood patterns
    let userTags: string[] = [];

    if (identity) {
      const userId = getStableUserId(identity);

      // Get entries from the last 7 days
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const recentEntries = await ctx.db
        .query("entries")
        .withIndex("by_userId_and_timestamp", (q) =>
          q.eq("userId", userId).gte("timestamp", sevenDaysAgo)
        )
        .collect();

      // Extract mood types and tags from recent entries
      const moodTypes = recentEntries.map((e) => e.moodType.toLowerCase());
      const entryTags = recentEntries
        .flatMap((e) => e.tags || [])
        .map((t) => t.toLowerCase());

      userTags = Array.from(new Set([...moodTypes, ...entryTags]));
    }

    // Get all articles
    const allArticles = await ctx.db.query("articles").collect();

    if (userTags.length === 0) {
      // No user data, return general wellness articles
      return allArticles.slice(0, limit);
    }

    // Score articles based on tag matches
    const scoredArticles = allArticles.map((article) => {
      const articleTags = article.tags.map((t) => t.toLowerCase());
      const matchCount = articleTags.filter((tag) =>
        userTags.includes(tag)
      ).length;

      return {
        ...article,
        score: matchCount,
      };
    });

    // Sort by score (highest first) and return top N
    scoredArticles.sort((a, b) => b.score - a.score);

    return scoredArticles.slice(0, limit).map(({ score, ...article }) => article);
  },
});

export const getAllArticles = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("articles").collect();
  },
});
