import type { APIRoute } from 'astro';
import { getMemeWithTags, updateMemeTags } from '@/lib/db';

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Meme ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if meme exists
    const existingMeme = await getMemeWithTags(id);
    if (!existingMeme) {
      return new Response(
        JSON.stringify({ success: false, error: 'Meme not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let body: { tags?: string[] };
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate tags field
    if (!body.tags || !Array.isArray(body.tags)) {
      return new Response(
        JSON.stringify({ success: false, error: 'tags field is required and must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate all tags are strings
    if (!body.tags.every(t => typeof t === 'string')) {
      return new Response(
        JSON.stringify({ success: false, error: 'All tags must be strings' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update tags
    const updatedMeme = await updateMemeTags(id, body.tags);

    return new Response(
      JSON.stringify({ success: true, meme: updatedMeme }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update tags error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update tags' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
