import { db, Meme, Tag, MemeTag, count } from 'astro:db';

export default async function seed() {
  const [tagCount] = await db.select({ count: count() }).from(Tag);
  if (tagCount.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  await db.insert(Tag).values([
    { id: 'tag-1', name: 'funny' },
    { id: 'tag-2', name: 'reaction' },
    { id: 'tag-3', name: 'classic' },
  ]);
  console.log('Seeded initial tags');
}
