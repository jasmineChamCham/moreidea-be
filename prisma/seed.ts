import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = (process.env.DATABASE_URL ||
  process.env.DIRECT_URL) as string;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding mentors brain...');

  /*
   --------------------------------
   TOPICS
   --------------------------------
  */

  const topics = [
    'psychology',
    'human nature',
    'power',
    'strategy',
    'social dynamics',
    'influence',
    'money',
    'wealth',
    'entrepreneurship',
    'confidence',
    'discipline',
    'relationships',
    'dating',
    'communication',
    'spirituality',
    'purpose',
    'meaning of life',
    'leadership',
    'success mindset',
  ];

  const topicMap: Record<string, any> = {};

  for (const name of topics) {
    const topic = await prisma.topic.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    topicMap[name] = topic;
  }

  /*
   --------------------------------
   MENTORS
   --------------------------------
  */

  const robertGreene = await prisma.mentor.upsert({
    where: { name: 'Robert Greene' },
    update: {},
    create: {
      name: 'Robert Greene',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Robert_Greene_2011.jpg',
      archetype: 'Strategist',
      philosophy:
        'Human behavior is driven by hidden motives and power dynamics. Understanding human nature allows strategic navigation of life.',
      mindset:
        'Strategic thinking, emotional control, observation of human behavior',
      style: 'Analytical historical storytelling',
      speakingStyle: 'Slow, reflective, intellectual',
      bodyLanguage: 'Calm, composed, observant',
      bio: 'American author known for books such as The 48 Laws of Power and The Laws of Human Nature, focusing on strategy, power dynamics, and human psychology.',
      era: 'Modern strategy',
    },
  });

  const codie = await prisma.mentor.upsert({
    where: { name: 'Codie Sanchez' },
    update: {},
    create: {
      name: 'Codie Sanchez',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Codie_Sanchez.jpg',
      archetype: 'Operator',
      philosophy:
        'Financial independence comes from owning assets that produce cash flow.',
      mindset: 'Ownership mindset',
      style: 'Direct, pragmatic, tactical',
      speakingStyle: 'Fast, confident',
      bodyLanguage: 'Assertive, strong eye contact',
      bio: 'Entrepreneur and investor known for advocating small business acquisitions as a path to financial independence.',
      era: 'Modern entrepreneurship',
    },
  });

  const mel = await prisma.mentor.upsert({
    where: { name: 'Mel Robbins' },
    update: {},
    create: {
      name: 'Mel Robbins',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Mel_Robbins_2019.jpg',
      archetype: 'Activator',
      philosophy: 'Action creates motivation.',
      mindset: 'Behavioral activation',
      style: 'Practical, motivational',
      speakingStyle: 'Energetic',
      bodyLanguage: 'Expressive and encouraging',
      bio: 'Motivational speaker and bestselling author focused on practical psychology and habit-building strategies.',
      era: 'Behavioral productivity',
    },
  });

  const jay = await prisma.mentor.upsert({
    where: { name: 'Jay Shetty' },
    update: {},
    create: {
      name: 'Jay Shetty',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Jay_Shetty_2020.jpg',
      archetype: 'Monk',
      philosophy: 'Purpose and mindfulness create a meaningful life.',
      mindset: 'Spiritual self development',
      style: 'Storytelling and philosophy',
      speakingStyle: 'Calm and reflective',
      bodyLanguage: 'Warm and empathetic',
      bio: 'Former monk turned storyteller and podcast host who teaches mindfulness, relationships, and purposeful living.',
      era: 'Digital spirituality',
    },
  });

  const jung = await prisma.mentor.upsert({
    where: { name: 'Carl Jung' },
    update: {},
    create: {
      name: 'Carl Jung',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Carl_Gustav_Jung.jpg',
      archetype: 'Mystic',
      philosophy:
        'The unconscious mind shapes personality and behavior through archetypes and the shadow.',
      mindset: 'Depth psychology',
      style: 'Philosophical and symbolic',
      speakingStyle: 'Complex theoretical thinking',
      bodyLanguage: 'Reserved academic demeanor',
      bio: 'Swiss psychiatrist and psychoanalyst who founded analytical psychology and developed theories of archetypes, individuation, and the collective unconscious.',
      era: 'Early depth psychology',
    },
  });

  const peterson = await prisma.mentor.upsert({
    where: { name: 'Jordan Peterson' },
    update: {},
    create: {
      name: 'Jordan Peterson',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Jordan_Peterson_2018.jpg',
      archetype: 'Philosopher',
      philosophy:
        'Meaning in life comes from responsibility, discipline, and confronting chaos.',
      mindset: 'Responsibility and order',
      style: 'Philosophical psychology',
      speakingStyle: 'Passionate intellectual lectures',
      bodyLanguage: 'Intense and expressive',
      bio: 'Clinical psychologist and public intellectual known for exploring meaning, responsibility, and the psychological foundations of culture.',
      era: 'Modern psychology',
    },
  });

  /*
   --------------------------------
   MENTOR TOPICS
   --------------------------------
  */

  async function connectTopic(mentorId: string, topicName: string) {
    await prisma.mentorTopic.create({
      data: {
        mentorId,
        topicId: topicMap[topicName].id,
      },
    });
  }

  await connectTopic(robertGreene.id, 'power');
  await connectTopic(robertGreene.id, 'human nature');
  await connectTopic(robertGreene.id, 'strategy');

  await connectTopic(codie.id, 'money');
  await connectTopic(codie.id, 'wealth');
  await connectTopic(codie.id, 'entrepreneurship');

  await connectTopic(mel.id, 'confidence');
  await connectTopic(mel.id, 'discipline');

  await connectTopic(jay.id, 'purpose');
  await connectTopic(jay.id, 'spirituality');

  await connectTopic(peterson.id, 'meaning of life');
  await connectTopic(jung.id, 'psychology');

  /*
   --------------------------------
   SOURCES
   --------------------------------
  */

  const laws48 = await prisma.bookVideoSource.create({
    data: {
      mentorId: robertGreene.id,
      sourceTitle: 'The 48 Laws of Power',
      sourceType: 'book',
      creator: 'Robert Greene',
    },
  });

  const melTed = await prisma.bookVideoSource.create({
    data: {
      mentorId: mel.id,
      sourceTitle: 'The 5 Second Rule',
      sourceType: 'video',
      creator: 'Mel Robbins',
      sourceUrl: 'https://youtube.com',
    },
  });

  /*
   --------------------------------
   IDEAS
   --------------------------------
  */

  await prisma.sourceIdea.createMany({
    data: [
      {
        sourceId: laws48.id,
        topicId: topicMap['power'].id,
        ideaText:
          'Never outshine the master. People in power must feel superior.',
        core: 'Power hierarchy',
        importance: 'High',
        application:
          'Make your superiors feel respected while subtly increasing your own influence.',
      },
      {
        sourceId: laws48.id,
        topicId: topicMap['human nature'].id,
        ideaText: 'People reveal their character through patterns of behavior.',
        core: 'Observe behavior patterns',
        importance: 'High',
        application: 'Trust long-term patterns rather than short-term words.',
      },
      {
        sourceId: melTed.id,
        topicId: topicMap['discipline'].id,
        ideaText: 'Counting 5-4-3-2-1 interrupts hesitation and forces action.',
        core: 'Interrupt procrastination',
        importance: 'High',
        application: 'Use countdown to start tasks before fear takes control.',
      },
    ],
  });


  /*
     --------------------------------
     ANCHORS
     --------------------------------
  */

  console.log('Seeding anchors...');

  const anchors = [
    { content: "Most problems are not about what happened, but how it was interpreted.", category: "perception" },
    { content: "Feeling misunderstood hurts more than being disagreed with.", category: "communication" },
    { content: "People don't react to you — they react to what you represent to them.", category: "perception" },
    { content: "Overthinking is often a form of trying to control love.", category: "relationships" },
    { content: "Clarity in communication is an act of love.", category: "communication" },
    { content: "You can be right and still destroy the connection.", category: "relationships" },
    { content: "Unspoken expectations are premeditated disappointments.", category: "relationships" },
    { content: "The real problem is rarely the surface conversation.", category: "communication" },
    { content: "People don't need solutions first — they need to feel seen.", category: "relationships" },
    { content: "Understanding is more powerful than fixing.", category: "relationships" },
    { content: "We don't fall in love with people — we fall in love with how we feel around them.", category: "relationships" },
    { content: "Love reveals what hasn't been healed.", category: "relationships" },
    { content: "The deeper the feeling, the less language we often have for it.", category: "relationships" },
    { content: "We don't fear losing people — we fear losing how they make us feel.", category: "relationships" },
    { content: "Being chosen once is easy. Feeling chosen consistently is what matters.", category: "relationships" },
    { content: "People often test love instead of trusting it.", category: "relationships" },
    { content: "Intimacy is not closeness — it's being known without editing yourself.", category: "relationships" },
    { content: "We repeat what feels familiar, not what is good for us.", category: "relationships" },
    { content: "Sometimes, love feels like anxiety when you're not used to safety.", category: "relationships" },
    { content: "You don't need more love — you need a better experience of it.", category: "relationships" },
    { content: "Real love is not intense — it is consistent.", category: "relationships" },
    { content: "True love feels safe, not confusing.", category: "relationships" },
    { content: "Love is not about finding the right person — it's about becoming someone who can love well.", category: "relationships" },
    { content: "In real love, you don't have to earn your place.", category: "relationships" },
    { content: "True love doesn't rush clarity — but it never avoids it.", category: "relationships" },
    { content: "Love is choosing someone on days when feelings are quiet.", category: "relationships" },
    { content: "The right love makes you softer, not more guarded.", category: "relationships" },
    { content: "True love respects your reality, not just your potential.", category: "relationships" },
    { content: "Love is not losing yourself — it's being more yourself with someone.", category: "relationships" },
    { content: "When it's real, you don't feel like you're guessing all the time.", category: "relationships" },
    { content: "Your attachment style is not your personality — it's your protection strategy.", category: "psychology" },
    { content: "We don't choose how we attach — we learn it.", category: "psychology" },
    { content: "Anxious people don't want too much — they want reassurance they never received.", category: "psychology" },
    { content: "Avoidant people don't lack feelings — they learned to hide them to stay safe.", category: "psychology" },
    { content: "Conflict feels like danger when your nervous system was trained that way.", category: "psychology" },
    { content: "You're not overreacting — you're reacting from an old place.", category: "psychology" },
    { content: "We don't just seek love — we seek familiar emotional patterns.", category: "psychology" },
    { content: "Healing attachment is not becoming different — it's becoming safer inside yourself.", category: "psychology" },
    { content: "Two people can love each other and still trigger each other constantly.", category: "psychology" },
    { content: "Awareness without new behavior will keep recreating the same relationship.", category: "psychology" },
    { content: "The quality of your love depends on the quality of your inner life.", category: "psychology" },
    { content: "We often expect from others what we haven't learned to give ourselves.", category: "psychology" },
    { content: "Love grows where attention goes.", category: "relationships" },
    { content: "The way you handle small moments defines the future of your relationship.", category: "relationships" },
    { content: "You don't build love in grand gestures — you build it in daily choices.", category: "relationships" },
    { content: "Listening is how love becomes visible.", category: "communication" },
    { content: "A healthy relationship is not two perfect people — it's two people who know how to repair.", category: "relationships" },
    { content: "You can't create a peaceful love with a chaotic mind.", category: "psychology" },
    { content: "Respect is the foundation — love is the expression.", category: "relationships" },
    { content: "The right relationship will challenge you to grow, not force you to shrink.", category: "relationships" },
    { content: "Love is not just how you feel — it's how you show up.", category: "relationships" },
    { content: "If you love someone, learn how they receive love — not just how you give it.", category: "relationships" },
    { content: "Patience is one of the purest forms of love.", category: "relationships" },
    { content: "Don't just hear your partner — try to understand their meaning.", category: "communication" },
    { content: "Apologizing is not losing — it's choosing the relationship over your ego.", category: "relationships" },
    { content: "Love requires effort even when it's real.", category: "relationships" },
    { content: "Give your partner the space to be human, not perfect.", category: "relationships" },
    { content: "Consistency builds trust more than intensity.", category: "relationships" },
    { content: "Speak with care — words can stay longer than emotions.", category: "communication" },
    { content: "Loving well means learning, unlearning, and relearning each other.", category: "relationships" },
    { content: "Stop waiting to feel ready — love is built in action, not in your head.", category: "relationships" },
    { content: "If they're confusing you, they're not choosing you.", category: "relationships" },
    { content: "You teach people how to treat you by what you tolerate.", category: "relationships" },
    { content: "Love doesn't fix your self-worth — you bring your self-worth into love.", category: "psychology" },
    { content: "Stop overanalyzing and start observing what's actually happening.", category: "psychology" },
    { content: "If you're always chasing, you're not in a relationship — you're in a pattern.", category: "relationships" },
    { content: "Respect your time enough to walk away from inconsistency.", category: "relationships" },
    { content: "You don't need closure — you need to decide you're done.", category: "psychology" },
    { content: "The right person will meet you with effort, not excuses.", category: "relationships" },
    { content: "Your life changes the moment you stop settling in love.", category: "relationships" },
    { content: "Stop saying you love them — show it in what you do consistently.", category: "relationships" },
    { content: "If something bothers you, say it early — not after it becomes resentment.", category: "communication" },
    { content: "Don't expect mind-reading — communicate clearly.", category: "communication" },
    { content: "Choose honesty over comfort, even when it's hard.", category: "relationships" },
    { content: "If you need reassurance, ask for it — don't test people.", category: "relationships" },
    { content: "Pay attention to effort, not just words.", category: "relationships" },
    { content: "Set boundaries early, or you'll have to fix damage later.", category: "relationships" },
    { content: "Stop tolerating what you know is wrong.", category: "relationships" },
    { content: "If you're not getting what you need, address it — or walk away.", category: "relationships" },
    { content: "Take responsibility for your behavior, not just your intentions.", category: "psychology" },
    { content: "The right person won't make you question where you stand.", category: "relationships" },
    { content: "When someone is interested, you won't have to chase clarity.", category: "relationships" },
    { content: "Confusion is often a sign to step back, not lean in.", category: "psychology" },
    { content: "You don't win love by proving your worth — you receive it by recognizing it.", category: "psychology" },
    { content: "Attention is not the same as intention.", category: "relationships" },
    { content: "If someone only shows up when it's convenient, they're showing you your place.", category: "relationships" },
    { content: "You deserve consistency, not just chemistry.", category: "relationships" },
    { content: "Stop investing in potential — pay attention to reality.", category: "relationships" },
    { content: "Walking away is sometimes the clearest form of self-respect.", category: "psychology" },
    { content: "The more you value your time, the less you'll tolerate confusion.", category: "relationships" },
    { content: "Don't give relationship-level effort to someone who hasn't earned it.", category: "relationships" },
    { content: "Let people meet you at your standards — don't lower them to keep them.", category: "relationships" },
    { content: "If you want clarity, ask for it — don't wait and hope.", category: "communication" },
    { content: "Pay attention to patterns, not promises.", category: "relationships" },
    { content: "The right connection won't require you to chase basic respect.", category: "relationships" },
    { content: "Stop overgiving to prove your value.", category: "psychology" },
    { content: "Distance yourself from inconsistency, not from your standards.", category: "relationships" },
    { content: "You can be understanding without accepting bad behavior.", category: "relationships" },
    { content: "Don't stay just because you've invested time — stay because it's right.", category: "relationships" },
    { content: "The way someone treats you early on is information, not something to fix.", category: "relationships" },
    { content: "Fear doesn't mean stop — it often means this matters to you.", category: "psychology" },
    { content: "We don't avoid things because they're hard — we avoid how they make us feel.", category: "psychology" },
    { content: "Fear is rarely about the present — it's about what you imagine could happen.", category: "psychology" },
    { content: "The more you avoid fear, the bigger it feels.", category: "psychology" },
    { content: "You can feel fear and still move — they're not opposites.", category: "psychology" },
    { content: "Fear often protects an older version of you, not who you are now.", category: "psychology" },
    { content: "Clarity reduces fear more than confidence does.", category: "psychology" },
    { content: "Fear grows in silence — it shrinks when you face it directly.", category: "psychology" },
    { content: "What you're afraid to say is often what needs to be said most.", category: "psychology" },
    { content: "Most regret comes from fear we didn't face, not mistakes we made.", category: "psychology" },
    { content: "Insecurity doesn't always look like weakness — sometimes it looks like control.", category: "psychology" },
    { content: "The more you try to be enough for someone else, the less you feel enough within yourself.", category: "psychology" },
    { content: "Insecurity makes you read between the lines that were never written.", category: "psychology" },
    { content: "You don't need constant reassurance — you need a stable sense of self.", category: "psychology" },
    { content: "Insecurity turns small moments into big meanings.", category: "psychology" },
    { content: "When you don't feel secure inside, you look for proof outside.", category: "psychology" },
    { content: "Insecurity often speaks louder than reality.", category: "psychology" },
    { content: "The fear of not being enough can make you act in ways that push people away.", category: "psychology" },
    { content: "You can be deeply loved and still feel insecure.", category: "psychology" },
    { content: "Healing insecurity is not becoming perfect — it's becoming less afraid of being seen.", category: "psychology" },
  ];

  for (const anchor of anchors) {
    const existingAnchor = await prisma.anchor.findFirst({
      where: { content: anchor.content }
    });

    if (!existingAnchor) {
      await prisma.anchor.create({
        data: anchor,
      });
    }
  }

  console.log(`Seeded ${anchors.length} anchors successfully!`);

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
