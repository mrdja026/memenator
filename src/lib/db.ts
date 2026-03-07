import { db, Meme, Tag, MemeTag, eq, desc } from 'astro:db';
import { getFileUrl } from './files';

export interface MemeWithTags {
  id: string;
  title: string;
  description: string | null;
  filePath: string;
  fileUrl: string;
  fileType: string;
  createdAt: Date;
  tags: Array<{ id: string; name: string }>;
}

export interface CreateMemeData {
  title: string;
  description?: string;
  filePath: string;
  fileType: string;
  tags: string[];
}

export async function getAllMemes(): Promise<MemeWithTags[]> {
  const memes = await db.select().from(Meme).orderBy(desc(Meme.createdAt));
  return Promise.all(memes.map(addTagsToMeme));
}

export async function getRecentMemes(limit: number = 10): Promise<MemeWithTags[]> {
  const memes = await db
    .select()
    .from(Meme)
    .orderBy(desc(Meme.createdAt))
    .limit(limit);
  return Promise.all(memes.map(addTagsToMeme));
}

export async function getMemesByTag(tagName: string): Promise<MemeWithTags[]> {
  const tag = await db
    .select()
    .from(Tag)
    .where(eq(Tag.name, tagName))
    .limit(1);

  if (tag.length === 0) return [];

  const memeTags = await db
    .select()
    .from(MemeTag)
    .where(eq(MemeTag.tagId, tag[0].id));

  const memeIds = memeTags.map((mt) => mt.memeId);
  if (memeIds.length === 0) return [];

  const memes = await db.select().from(Meme).orderBy(desc(Meme.createdAt));
  const filteredMemes = memes.filter((m) => memeIds.includes(m.id));
  
  return Promise.all(filteredMemes.map(addTagsToMeme));
}

export async function getMemeWithTags(id: string): Promise<MemeWithTags | null> {
  const memes = await db.select().from(Meme).where(eq(Meme.id, id)).limit(1);
  if (memes.length === 0) return null;
  return addTagsToMeme(memes[0]);
}

export async function createMeme(data: CreateMemeData): Promise<MemeWithTags> {
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(Meme).values({
    id,
    title: data.title,
    description: data.description ?? null,
    filePath: data.filePath,
    fileType: data.fileType,
    createdAt: now,
  });

  for (const tagName of data.tags) {
    const tag = await getOrCreateTag(tagName);
    await db.insert(MemeTag).values({
      memeId: id,
      tagId: tag.id,
    });
  }

  const meme = await getMemeWithTags(id);
  return meme!;
}

export async function deleteMeme(id: string): Promise<boolean> {
  const meme = await db.select().from(Meme).where(eq(Meme.id, id)).limit(1);
  if (meme.length === 0) return false;

  await db.delete(MemeTag).where(eq(MemeTag.memeId, id));
  await db.delete(Meme).where(eq(Meme.id, id));

  return true;
}

export async function getAllTags(): Promise<Array<{ id: string; name: string }>> {
  return db.select().from(Tag).orderBy(Tag.name);
}

export async function getOrCreateTag(name: string): Promise<{ id: string; name: string }> {
  const normalizedName = name.toLowerCase().trim();
  
  const existing = await db
    .select()
    .from(Tag)
    .where(eq(Tag.name, normalizedName))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const id = crypto.randomUUID();
  await db.insert(Tag).values({ id, name: normalizedName });
  return { id, name: normalizedName };
}

async function addTagsToMeme(meme: typeof Meme.$inferSelect): Promise<MemeWithTags> {
  const memeTags = await db
    .select()
    .from(MemeTag)
    .where(eq(MemeTag.memeId, meme.id));

  const tagIds = memeTags.map((mt) => mt.tagId);
  
  let tags: Array<{ id: string; name: string }> = [];
  if (tagIds.length > 0) {
    const allTags = await db.select().from(Tag);
    tags = allTags.filter((t) => tagIds.includes(t.id));
  }

  const fileUrl = await getFileUrl(meme.filePath);

  return {
    ...meme,
    fileUrl,
    tags,
  };
}
