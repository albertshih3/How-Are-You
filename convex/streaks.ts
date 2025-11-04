import { query } from "./_generated/server";

type Identity = {
  tokenIdentifier: string;
  subject?: string;
  name?: string;
  email?: string;
};

function getStableUserId(identity: Identity) {
  return identity.subject ?? identity.tokenIdentifier;
}

// Convert timestamp to day string (YYYY-MM-DD) in UTC
function getDayString(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

// Get date string for a specific number of days ago
function getDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export const getStreakData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      };
    }

    const userId = getStableUserId(identity);

    // Get all user entries
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (entries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      };
    }

    // Group entries by day
    const entryDays = new Set<string>();
    entries.forEach((entry) => {
      entryDays.add(getDayString(entry.timestamp));
    });

    // Convert to sorted array (most recent first)
    const sortedDays = Array.from(entryDays).sort().reverse();

    const today = getDaysAgo(0);
    const yesterday = getDaysAgo(1);

    // Calculate current streak
    let currentStreak = 0;

    // Check if there's an entry today or yesterday to start the streak
    if (sortedDays.includes(today) || sortedDays.includes(yesterday)) {
      let checkDay = sortedDays.includes(today) ? 0 : 1;

      while (sortedDays.includes(getDaysAgo(checkDay))) {
        currentStreak++;
        checkDay++;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < sortedDays.length - 1; i++) {
      const currentDate = new Date(sortedDays[i]);
      const nextDate = new Date(sortedDays[i + 1]);

      // Check if dates are consecutive (1 day apart)
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastEntryDate: sortedDays[0],
    };
  },
});
