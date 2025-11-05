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

// Internal articles written by students and admins
const SEED_ARTICLES = [
  {
    title: "Managing Academic Stress: A Student's Guide to Balance",
    description: "Practical strategies for recognizing, managing, and preventing academic stress. Learn how to balance coursework, extracurriculars, and self-care for long-term success.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    tags: ["stress", "school", "anxiety"],
    category: "stress",
    isInternal: true,
    authorType: "admin" as const,
    authorName: "How Are You Team",
    publishedAt: Date.now(),
    status: "published" as const,
    content: `# Managing Academic Stress: A Student's Guide to Balance

Academic stress is one of the most common challenges students face, affecting mental health, physical well-being, and academic performance. Whether you're dealing with multiple deadlines, difficult coursework, or high expectations, learning to manage stress effectively is crucial for both your success and your health.

## Understanding Academic Stress

Stress is your body's natural response to challenges or demands. In small doses, it can actually be helpful—motivating you to study for an exam or complete a project. However, when stress becomes chronic or overwhelming, it can lead to serious problems including anxiety, depression, sleep issues, and physical health concerns.

### Common Signs of Academic Stress

- **Physical symptoms**: Headaches, fatigue, muscle tension, changes in appetite or sleep patterns
- **Emotional symptoms**: Feeling overwhelmed, irritable, anxious, or unable to concentrate
- **Behavioral changes**: Procrastination, avoiding responsibilities, changes in social patterns
- **Cognitive effects**: Racing thoughts, constant worry, difficulty making decisions

Recognizing these signs early is the first step toward managing stress effectively.

## Practical Stress Management Strategies

### 1. Time Management and Organization

One of the biggest sources of academic stress is feeling like there's too much to do and not enough time. Effective time management can dramatically reduce this pressure.

**Create a realistic schedule**: Use a planner or digital calendar to map out your commitments. Be honest about how long tasks actually take—most students underestimate this by 25-50%.

**Break large projects into smaller tasks**: A 20-page research paper feels overwhelming, but "research sources for introduction" is manageable. Breaking work into bite-sized pieces makes it less daunting and gives you a sense of progress.

**Prioritize using the Eisenhower Matrix**: Categorize tasks by urgency and importance. Focus on what's both urgent and important first, but don't neglect important but non-urgent tasks like long-term projects and self-care.

**Use the Pomodoro Technique**: Work in focused 25-minute intervals with 5-minute breaks. This prevents burnout and maintains concentration.

### 2. Set Realistic Expectations

Perfectionism is a major contributor to student stress. While high standards can drive excellence, unrealistic expectations set you up for constant disappointment and anxiety.

**Aim for "good enough" sometimes**: Not every assignment needs to be your magnum opus. Recognize when 85% effort will get you 90% of the results and save your energy for what matters most.

**Reframe failure as learning**: A lower-than-expected grade isn't a reflection of your worth—it's information about what to improve. Research shows students who view challenges as opportunities to learn experience less stress and perform better long-term.

**Compare yourself to yourself**: Social media makes it easy to feel like everyone else has it together. Remember that you're only seeing curated highlights of others' lives while experiencing your full reality.

### 3. Build a Support Network

Social connection is one of the most powerful stress buffers. Students with strong support systems show better mental health outcomes and higher academic achievement.

**Find your people**: Join study groups, clubs, or student organizations. Having classmates who understand your struggles makes stress feel more manageable.

**Communicate with professors**: Most instructors want to help. If you're struggling, reach out during office hours. They may offer extensions, clarifications, or study resources.

**Lean on friends and family**: Don't isolate yourself when stressed. Talking through your concerns, even if the other person can't solve them, reduces emotional burden.

**Consider peer counseling or support groups**: Many campuses offer peer-led groups specifically for academic stress. These provide both practical strategies and emotional validation.

### 4. Practice Active Stress Relief

Passive stress relief (like scrolling social media or watching TV) might feel good in the moment but often leaves you feeling worse. Active stress relief actually reduces cortisol and improves mood.

**Move your body**: Exercise is one of the most effective stress reducers. Even a 10-minute walk between study sessions can reset your nervous system. Aim for 30 minutes of moderate activity most days.

**Try breathwork**: When stressed, your breathing becomes shallow and rapid. Deep, slow breathing activates your parasympathetic nervous system (your "rest and digest" mode). Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8.

**Practice mindfulness**: You don't need to meditate for an hour. Even 5 minutes of focused attention on your breath or a short body scan can reduce anxiety and improve focus.

**Engage in creative activities**: Art, music, writing, or crafts engage different parts of your brain and provide mental breaks from academic thinking.

### 5. Maintain Healthy Habits

When stressed, self-care often falls to the bottom of the priority list. But adequate sleep, nutrition, and rest are essential for both managing stress and performing academically.

**Protect your sleep**: Sleep deprivation impairs memory, focus, and emotional regulation—all crucial for academic success. Aim for 7-9 hours nightly. Keep a consistent sleep schedule, even on weekends.

**Eat regular, balanced meals**: Skipping meals or relying on caffeine and sugar creates blood sugar swings that worsen anxiety and concentration. Plan for simple, nutritious meals even during busy periods.

**Limit alcohol and caffeine**: While they might seem to help in the moment, both substances disrupt sleep and can increase anxiety. If you drink coffee, cut off caffeine intake by early afternoon.

**Take real breaks**: Working for 8 hours straight is less productive than working for 6 hours with breaks. Your brain needs downtime to consolidate learning and recharge.

## When to Seek Additional Help

Sometimes, self-management strategies aren't enough. Consider seeking professional help if:

- Stress is interfering with your ability to attend class, complete work, or maintain relationships
- You're experiencing persistent anxiety, depression, or thoughts of self-harm
- Physical symptoms (headaches, stomach issues, insomnia) are ongoing
- You're using alcohol, drugs, or other unhealthy coping mechanisms

Most college campuses offer free or low-cost counseling services. There's no shame in asking for help—it's a sign of strength and self-awareness.

## Building Long-Term Resilience

Managing academic stress isn't just about getting through this semester—it's about developing skills that will serve you throughout your academic and professional life.

**Develop a growth mindset**: View challenges as opportunities to develop new capabilities rather than threats to your self-worth.

**Build stress management into your routine**: Don't wait until you're overwhelmed to implement these strategies. Make them regular habits.

**Reflect and adjust**: Pay attention to what strategies work best for you. Keep a brief journal noting what helped during stressful periods.

**Remember your "why"**: When stress feels overwhelming, reconnect with the bigger reasons you're pursuing your education. This perspective can help difficult moments feel more manageable.

Academic stress is a normal part of student life, but it doesn't have to overwhelm you. By implementing these strategies consistently and seeking support when needed, you can maintain both your well-being and your academic success. Remember: taking care of yourself isn't a luxury or a distraction from your work—it's an essential foundation for achieving your goals.`,
  },
  {
    title: "Understanding and Overcoming Test Anxiety",
    description: "A comprehensive guide to managing test anxiety, from understanding its roots to implementing practical strategies before, during, and after exams.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    tags: ["anxiety", "school", "stress"],
    category: "anxiety",
    isInternal: true,
    authorType: "student" as const,
    authorName: "Sarah Chen, Psychology Major",
    publishedAt: Date.now(),
    status: "published" as const,
    content: `# Understanding and Overcoming Test Anxiety

*A student's perspective on managing test anxiety*

I'll never forget my first college midterm. I'd studied for days, knew the material inside and out, but the moment I sat down in that exam hall, my mind went blank. My hands shook, my heart raced, and I could barely focus on the questions in front of me. If this sounds familiar, you're not alone. Test anxiety affects 16-20% of students, with another 18% experiencing high anxiety levels.

As a psychology major who's struggled with test anxiety myself, I've spent years researching this phenomenon and developing strategies that actually work. This article shares what I've learned—both from research and personal experience.

## What Is Test Anxiety?

Test anxiety is more than just nervousness before an exam. It's an excessive fear of testing situations that can significantly impair your ability to demonstrate what you actually know. It's a specific type of performance anxiety characterized by:

- **Physical symptoms**: Rapid heartbeat, sweating, nausea, headaches, feeling faint
- **Cognitive symptoms**: Racing thoughts, mind going blank, difficulty concentrating, negative self-talk
- **Behavioral symptoms**: Avoidance, procrastination, fidgeting, reading questions multiple times without processing them

### The Anxiety Cycle

Test anxiety creates a vicious cycle. Worry about the test leads to physical symptoms (increased heart rate, muscle tension) which your brain interprets as danger, triggering more anxiety. Meanwhile, anxious thoughts ("I'm going to fail," "Everyone else knows more than me") occupy mental resources you need for actually answering questions.

This isn't just in your head. Brain imaging studies show that anxiety activates the amygdala (your brain's fear center) while decreasing activity in the prefrontal cortex (responsible for reasoning and working memory). Essentially, your survival brain takes over when you need your thinking brain most.

### What Causes Test Anxiety?

Understanding the root causes helps you address them more effectively:

**Fear of failure**: Perfectionism, high expectations from yourself or others, or past negative experiences with testing can create intense pressure.

**Lack of preparation**: Sometimes "test anxiety" is actually rational concern about being unprepared. Distinguishing between the two is important.

**Poor test history**: Previous experiences of freezing or performing poorly can create anticipatory anxiety about future tests.

**Comparison to others**: Seeing classmates finish early or appear confident can trigger worry that you're falling behind.

**Test format unfamiliarity**: Not knowing what to expect increases anxiety.

## Before the Test: Preparation and Prevention

The foundation for managing test anxiety is laid well before exam day. Here's what research shows actually helps:

### 1. Study Smart, Not Just Hard

**Start early**: Cramming increases anxiety and reduces retention. Spacing out your studying over time (distributed practice) is far more effective. Plan to review material multiple times over days or weeks rather than the night before.

**Test yourself regularly**: Practice tests are one of the most effective study methods. They not only help you learn material but also expose you to the format and pressure of testing, reducing anxiety through familiarity. Use your textbook's practice questions, old exams if available, or create your own.

**Study in varied environments**: Research shows that studying in different locations improves recall because your brain encodes information with multiple contextual cues rather than relying on one environment.

**Join a study group**: Explaining concepts to others deepens your understanding and provides social support. Plus, talking through your anxiety with peers who understand normalizes the experience.

### 2. Develop Pre-Test Rituals

**Create a consistent routine**: Use the same preparation routine before every test. This might include reviewing key concepts the night before, getting a good night's sleep, eating a protein-rich breakfast, and arriving 10 minutes early. Consistency creates a sense of control and predictability.

**Practice relaxation techniques**: Don't wait until test day to try deep breathing or progressive muscle relaxation for the first time. Practice these techniques daily so they become automatic stress responses you can deploy when anxious.

**Visualize success**: Mental rehearsal is powerful. Spend a few minutes visualizing yourself walking into the exam room feeling calm, reading questions confidently, and working through problems successfully. Athletes use this technique extensively—it works for academic performance too.

### 3. Address Catastrophic Thinking

Test anxiety often involves imagining worst-case scenarios. Counter this by:

**Reality-testing your fears**: Write down your anxious thoughts ("If I fail this test, I'll fail the class and lose my scholarship"). Then examine the evidence. What would actually happen? Is there evidence contradicting this thought? Often, our fears are much more extreme than reality.

**Putting the test in perspective**: One exam is rarely as high-stakes as it feels. Ask yourself: Will this matter in a year? Five years? This doesn't mean the test isn't important, but it helps reduce the all-or-nothing thinking that feeds anxiety.

**Preparing for imperfection**: Plan for what you'll do if things don't go perfectly. If you struggle with a section, you'll skip it and return later. If you freeze, you'll take three deep breaths and read the directions again. Having a plan reduces fear of the unknown.

## During the Test: In-the-Moment Strategies

Even with excellent preparation, you might still feel anxious during the exam. Here are research-backed strategies to manage anxiety in real-time:

### 1. Start with a Brain Dump

As soon as you're allowed to begin, spend 1-2 minutes writing down formulas, key dates, concepts, or anything you're afraid you'll forget. This "downloads" information from working memory, freeing up mental space and reducing worry about forgetting important information.

### 2. Use Physiological Calming Techniques

**Box breathing**: Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3-4 times. This activates your parasympathetic nervous system and quickly reduces physical anxiety symptoms.

**Progressive muscle relaxation**: Tense and release muscle groups systematically (fists, shoulders, legs). This interrupts the physical tension cycle.

**Bilateral stimulation**: Tap your knees alternately or move your eyes side to side. This engages both brain hemispheres and can reduce anxiety.

### 3. Reframe Anxiety Symptoms

This is a game-changer that research strongly supports: tell yourself "I'm excited" instead of "I'm anxious." Anxiety and excitement have similar physiological signatures (increased heart rate, alertness). By relabeling the feeling as excitement, you interpret it as energizing rather than threatening. Studies show this reappraisal strategy improves test performance.

### 4. Strategic Question Approach

**Read all instructions first**: Anxiety makes us rush. Taking 30 seconds to understand the format and requirements prevents costly mistakes.

**Answer easiest questions first**: Building momentum and confidence by succeeding on easier questions helps reduce anxiety and frees up mental resources for harder problems.

**Skip and return**: If you're stuck, move on. Ruminating on one difficult question wastes time and increases anxiety. Often, later questions trigger memories that help with earlier ones.

**Cover up multiple choice options**: Read the question and try to answer it before looking at choices. This prevents confusion from similar-looking options.

### 5. Manage Negative Self-Talk

Notice catastrophic thoughts as they arise: "I can't do this," "I'm going to fail," "Everyone else is doing better than me."

**Don't argue with them**: Trying to convince yourself these thoughts are false often backfires. Instead, acknowledge them: "I'm having the thought that I might fail," then return attention to the question in front of you.

**Use a physical anchor**: Wear a specific bracelet or ring that you've associated with calmness during your preparation. Touching it during the exam can serve as a reminder that you've prepared and can handle this.

## After the Test: Processing and Learning

How you handle the post-test period affects your anxiety about future tests.

### 1. Resist the Post-Mortem

Obsessively replaying the exam or comparing answers with classmates usually increases anxiety without changing anything. If you catch yourself doing this, redirect your attention. A brief "that's done, what's next?" mindset helps.

### 2. Reflect Constructively

Once you get your test back (not immediately after), reflect:
- What did I do well?
- What aspects of my preparation were most helpful?
- What would I do differently next time?
- Were there specific question types or content areas I struggled with?

This turns the test into a learning experience rather than just a judgment.

### 3. Challenge the Anxiety Narrative

If you performed better than your anxiety predicted (which is often the case), make note of this. Your anxiety was wrong about the outcome. Building up evidence that you can perform despite anxiety weakens its power over time.

## When to Seek Professional Help

If test anxiety is severe enough that it:
- Causes you to avoid classes or skip exams
- Leads to panic attacks
- Doesn't improve despite trying these strategies
- Significantly impairs your academic performance
- Occurs alongside other anxiety or mental health concerns

Consider seeking help from your campus counseling center. Cognitive-behavioral therapy (CBT) is highly effective for test anxiety, often showing significant improvement in just a few sessions. Some students also benefit from accommodations like extended time, which can be arranged through disability services if anxiety substantially impacts your performance.

## My Personal Journey

I still experience some anxiety before tests. The difference is that I now have tools to manage it, and I no longer let it define my academic experience. Last semester, I felt my heart racing before my statistics final—a subject that historically triggered intense anxiety for me. But I used my breathing techniques, reminded myself that I'd prepared well, and reframed my racing heart as excitement. I ended up with an A-.

More importantly, whether I'd gotten an A or a C, I proved to myself that I could walk into a high-stakes situation and function despite anxiety. That's the real victory.

Test anxiety is challenging, but it's not insurmountable. With understanding, preparation, and the right strategies, you can perform at your best even when anxiety shows up. And each test you get through successfully weakens anxiety's grip a little more.

You've got this.`,
  },
  {
    title: "Building Healthy Sleep Habits in College",
    description: "Evidence-based strategies for improving sleep quality and establishing consistent sleep routines despite the unique challenges of college life.",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
    tags: ["sleep", "stress", "wellness"],
    category: "sleep",
    isInternal: true,
    authorType: "admin" as const,
    authorName: "How Are You Team",
    publishedAt: Date.now(),
    status: "published" as const,
    content: `# Building Healthy Sleep Habits in College

Sleep is one of the most overlooked aspects of student health, yet it's fundamental to academic success, mental health, and physical well-being. College students average only 6-6.9 hours of sleep per night—well below the 7-9 hours recommended for young adults. The consequences extend far beyond feeling tired: insufficient sleep impairs memory consolidation, increases anxiety and depression, weakens immune function, and reduces cognitive performance by up to 40%.

Despite knowing sleep is important, college presents unique challenges to getting enough of it: irregular schedules, late-night socializing, academic demands, noisy dorms, and the newfound freedom to stay up as late as you want. This guide provides evidence-based strategies for building sustainable sleep habits in the college environment.

## Why Sleep Matters for Students

Before diving into strategies, it's worth understanding why sleep is so crucial for academic and mental health.

### Memory and Learning

During sleep, your brain consolidates memories, transferring information from short-term to long-term storage. This process, called memory consolidation, is essential for learning. Students who sleep after studying retain information significantly better than those who stay awake. In fact, pulling an all-nighter before an exam can reduce your performance by up to 40% compared to getting a full night's sleep.

Different sleep stages serve different learning functions:
- **Deep sleep** (stages 3-4) consolidates declarative memory—facts, dates, concepts
- **REM sleep** consolidates procedural memory—skills, problem-solving, patterns
- **Sleep spindles** (brief bursts of brain activity during stage 2) are associated with intelligence and learning capacity

Skipping sleep doesn't just mean you're tired—it literally prevents your brain from properly processing what you studied.

### Mental Health

The relationship between sleep and mental health is bidirectional: poor sleep increases risk of anxiety and depression, while these conditions also disrupt sleep, creating a difficult cycle.

Sleep deprivation affects emotional regulation by overactivating the amygdala (emotional center) while reducing connectivity with the prefrontal cortex (rational thinking). This explains why sleep-deprived people react more emotionally to stressors and have difficulty regulating emotions.

Regular, adequate sleep is as important for mental health as therapy or medication for many people. Students who maintain consistent sleep schedules report lower rates of depression, anxiety, and stress.

### Physical Health

Sleep is when your body repairs tissues, synthesizes proteins, and releases growth hormones. Chronic sleep deprivation:
- Weakens immune function (you're 3x more likely to catch a cold)
- Increases inflammation
- Disrupts metabolism and increases obesity risk
- Elevates cortisol (stress hormone) levels
- Reduces athletic performance and reaction time

## The Science of Sleep: Working with Your Biology

Understanding your body's natural sleep mechanisms helps you work with, rather than against, your biology.

### Circadian Rhythm

Your circadian rhythm is your internal 24-hour clock, primarily regulated by light exposure. It controls when you feel alert or sleepy by regulating hormones like melatonin (makes you sleepy) and cortisol (makes you alert).

For most people, this means:
- Natural alertness peaks in late morning and early evening
- Natural sleepiness occurs between 2-4 PM and 2-4 AM
- Core body temperature drops at night, signaling sleep time

Light is the primary circadian synchronizer. Blue light (from screens and overhead lights) signals "daytime" to your brain, suppressing melatonin production. This is helpful during the day but problematic at night.

### Sleep Pressure

The longer you're awake, the more sleep pressure (homeostatic sleep drive) builds up through accumulation of adenosine in your brain. Caffeine works by blocking adenosine receptors, temporarily masking sleep pressure—but the adenosine is still accumulating.

This is why you experience a "caffeine crash": when caffeine wears off, all that accumulated adenosine floods receptors at once, making you feel suddenly exhausted.

### Sleep Debt

Lost sleep accumulates as sleep debt. You can't "catch up" on sleep completely through weekend sleep-ins. While sleeping more after deprivation helps, it doesn't fully restore the cognitive impairments from chronic sleep loss. Consistency is more protective than occasionally getting extra sleep.

## Building Better Sleep Habits: Practical Strategies

### 1. Establish a Consistent Schedule

**Keep the same sleep and wake times—even on weekends.** This is the single most important sleep hygiene practice. Consistency reinforces your circadian rhythm, making it easier to fall asleep and wake up naturally.

Yes, this means limiting late Friday nights or sleeping until noon on Sunday. If you must shift your schedule, do it gradually (15-30 minutes at a time) rather than dramatic 3-4 hour swings.

**Plan backwards from your wake time.** If you need to be up by 7 AM and need 8 hours of sleep, you should be asleep (not just in bed) by 11 PM. Factor in 20-30 minutes to fall asleep, meaning lights out by 10:30 PM.

### 2. Create a Sleep-Conducive Environment

**Make your room cool, dark, and quiet.**
- **Temperature**: 65-68°F (18-20°C) is optimal. Your body needs to drop its core temperature to initiate sleep.
- **Darkness**: Use blackout curtains or a sleep mask. Even small amounts of light can disrupt sleep.
- **Quiet**: Use earplugs, white noise machines, or fans to mask dorm noise.

**Reserve your bed for sleep only.** Don't study, watch Netflix, or scroll social media in bed. This creates a strong mental association between your bed and sleep, making it easier to fall asleep when you get in bed.

**Consider roommate compatibility.** If your schedules are dramatically mismatched, discuss expectations about noise, lights, and visitors during sleep hours. Some students benefit from room dividers or coordinating schedules.

### 3. Manage Light Exposure Strategically

**Get bright light exposure in the morning.** Open your curtains immediately upon waking, or better yet, go outside for 10-15 minutes. Morning light strengthens your circadian rhythm and shifts your natural bedtime earlier.

**Reduce blue light exposure 2-3 hours before bed.** Use blue light filtering apps (f.lux, Night Shift), wear blue-blocking glasses, or switch to warm-toned lighting in the evening. Better yet, reduce screen time entirely during this window.

**Dim the lights progressively in the evening.** Gradually reducing light levels signals to your body that sleep time is approaching.

### 4. Develop a Wind-Down Routine

Create a consistent 30-60 minute routine before bed that signals to your body it's time to sleep. This might include:

- Taking a warm shower or bath (the post-bath temperature drop promotes sleep)
- Reading fiction (not textbooks)
- Light stretching or yoga
- Journaling
- Meditation or progressive muscle relaxation
- Listening to calm music or podcasts

**Avoid screens, intense exercise, stressful conversations, or stimulating content** during this window.

### 5. Be Strategic About Caffeine and Alcohol

**Cut off caffeine 8-10 hours before bed.** Caffeine has a half-life of 5-7 hours, meaning if you drink coffee at 3 PM, 25% of the caffeine is still in your system at 10 PM. Even if you can fall asleep with caffeine in your system, it reduces deep sleep quality.

**Limit alcohol, especially before bed.** While alcohol might help you fall asleep initially, it severely disrupts sleep architecture, reducing REM sleep and causing more nighttime awakenings. The result is fragmented, unrestorative sleep.

**Stay hydrated, but stop drinking 1-2 hours before bed** to minimize nighttime bathroom trips.

### 6. Exercise Regularly—But Time It Right

Regular exercise dramatically improves sleep quality and reduces time to fall asleep. However, vigorous exercise within 2-3 hours of bedtime can be too stimulating. Morning or afternoon exercise is ideal for sleep.

Light stretching or gentle yoga before bed is fine and may even promote better sleep.

### 7. Manage Stress and Racing Thoughts

**Keep a worry journal.** If anxious thoughts keep you awake, spend 10 minutes before your wind-down routine writing them down along with potential action steps. This "closes the loop" mentally, making it easier to let go.

**Practice cognitive shuffling.** If you can't fall asleep due to racing thoughts, use cognitive shuffle: think of a random word, then list as many words as you can starting with each letter. "Elephant": elbow, eagle, explain, avenue... This occupies your mind without being stimulating.

**Try the 10-3-2-1-0 rule**:
- 10 hours before bed: No more caffeine
- 3 hours before bed: No more food or alcohol
- 2 hours before bed: No more work or studying
- 1 hour before bed: No more screens
- 0: Number of times you hit snooze

### 8. Handle Irregular Schedules

College schedules vary dramatically day-to-day. To maintain consistency despite this:

**Protect your wake time.** Even if you have a late night, wake up within an hour of your usual time. You can take a short nap later if needed.

**Use strategic napping.** A 20-30 minute nap between 1-3 PM can reduce sleep debt without interfering with nighttime sleep. Set an alarm—naps longer than 30 minutes leave you groggy.

**Plan around your chronotype.** Some people are natural "larks" (morning people) while others are "owls" (night people). If possible, schedule demanding classes during your naturally alert times.

## What to Do When You Can't Sleep

Despite your best efforts, sometimes sleep won't come. Here's what to do:

**If you can't fall asleep after 20 minutes, get up.** Lying in bed awake creates an association between your bed and wakefulness. Get up, do something calming in low light, and return to bed when you feel sleepy.

**Practice acceptance.** Anxiety about not sleeping makes it harder to sleep. Remind yourself that resting quietly is still restorative, even if you're not fully asleep.

**Don't check the time.** Clock-watching increases anxiety. Turn your clock away from view.

## When to Seek Help

If you've consistently practiced good sleep hygiene for 2-3 weeks without improvement, or if you experience:
- Loud snoring or gasping during sleep (possible sleep apnea)
- Difficulty falling asleep or staying asleep most nights
- Excessive daytime sleepiness despite adequate time in bed
- Uncomfortable sensations in your legs at night (possible restless leg syndrome)
- Acting out dreams physically

Consult your campus health center or a sleep specialist. Many sleep disorders are highly treatable but require professional intervention.

## The Long Game

Building healthy sleep habits requires consistency and patience. You won't see dramatic changes overnight (pun intended), but within 2-3 weeks of maintaining a consistent schedule and good sleep hygiene, most students notice significant improvements in energy, mood, and cognitive function.

Sleep isn't a luxury or a sign of laziness—it's a biological necessity as fundamental as eating or breathing. Prioritizing sleep is one of the highest-ROI investments you can make in your academic success and overall well-being. The assignments will still be there in the morning, but you'll be far better equipped to tackle them after a good night's rest.`,
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
    // Only return published articles
    return ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const getArticleById = query({
  args: {
    articleId: v.id("articles"),
  },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // Only return published articles (or drafts for admins in the future)
    if (article.status !== "published") {
      throw new Error("Article not available");
    }

    return article;
  },
});
