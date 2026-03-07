import type { APIRoute } from 'astro';
import { getMemeWithTags, deleteMeme } from '@/lib/db';
import { deleteUploadedFile } from '@/lib/files';

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Meme ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meme = await getMemeWithTags(id);
    if (!meme) {
      return new Response(
        JSON.stringify({ error: 'Meme not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await deleteUploadedFile(meme.filePath);
    await deleteMeme(id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(
      JSON.stringify({ error: 'Delete failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
