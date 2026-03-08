import { defineDb, defineTable, column, NOW } from 'astro:db';

const Meme = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text({ optional: true }),
    filePath: column.text(),
    fileType: column.text(),
    sharedUrl: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
  },
});

const Tag = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
  },
});

const MemeTag = defineTable({
  columns: {
    memeId: column.text({ references: () => Meme.columns.id }),
    tagId: column.text({ references: () => Tag.columns.id }),
  },
});

export default defineDb({
  tables: { Meme, Tag, MemeTag },
});
