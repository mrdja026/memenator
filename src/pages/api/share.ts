import type { APIRoute } from 'astro';
import { getMemeWithTags, getMemeSharedUrl, updateMemeSharedUrl } from '../../lib/db';
import { getFileBuffer } from '../../lib/minio';
import { getMimeType } from '../../lib/files';
import { uploadToImgBB, isImageHostConfigured } from '../../lib/imgbb';

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
  };

  if (!isImageHostConfigured()) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Image hosting is not configured. Please set IMGBB_API_KEY in your environment.',
      }),
      { status: 500, headers: corsHeaders }
    );
  }

  let body: { memeId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON body' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { memeId } = body;

  if (!memeId || typeof memeId !== 'string') {
    return new Response(
      JSON.stringify({ success: false, error: 'memeId is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const meme = await getMemeWithTags(memeId);
  if (!meme) {
    return new Response(
      JSON.stringify({ success: false, error: 'Meme not found' }),
      { status: 404, headers: corsHeaders }
    );
  }

  const existingUrl = await getMemeSharedUrl(memeId);
  if (existingUrl) {
    return new Response(
      JSON.stringify({ success: true, link: existingUrl, cached: true }),
      { status: 200, headers: corsHeaders }
    );
  }

  const fileBuffer = await getFileBuffer(meme.filePath);
  if (!fileBuffer) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch meme file' }),
      { status: 500, headers: corsHeaders }
    );
  }

  const mimeType = getMimeType(meme.filePath);
  const result = await uploadToImgBB(fileBuffer, mimeType);

  if (!result.success) {
    return new Response(
      JSON.stringify({ success: false, error: result.error }),
      { status: 500, headers: corsHeaders }
    );
  }

  await updateMemeSharedUrl(memeId, result.link);

  return new Response(
    JSON.stringify({ success: true, link: result.link, cached: false }),
    { status: 200, headers: corsHeaders }
  );
};
