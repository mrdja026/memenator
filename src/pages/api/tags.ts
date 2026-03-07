import type { APIRoute } from 'astro';
import { getAllTags } from '@/lib/db';

export const GET: APIRoute = async () => {
  try {
    const tags = await getAllTags();
    return new Response(
      JSON.stringify({ tags }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching tags:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tags' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
