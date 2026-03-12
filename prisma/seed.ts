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
   QUOTES
   --------------------------------
  */

  await prisma.mentorQuote.createMany({
    data: [
      {
        mentorId: robertGreene.id,
        quote:
          'When you show yourself to the world and display your talents, you naturally stir jealousy.',
      },
      {
        mentorId: peterson.id,
        quote:
          'Compare yourself to who you were yesterday, not to who someone else is today.',
      },
      {
        mentorId: jung.id,
        quote:
          'Until you make the unconscious conscious, it will direct your life and you will call it fate.',
      },
      {
        mentorId: mel.id,
        quote: 'You are one decision away from a completely different life.',
      },
      {
        mentorId: jay.id,
        quote: 'Your purpose is often hidden in your pain.',
      },
    ],
  });

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
