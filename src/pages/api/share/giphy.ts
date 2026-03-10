import type { APIRoute } from 'astro';
import { getMemeWithTags, getMemeGiphyUrl, updateMemeGiphyUrl } from '../../../lib/db';
import { getFileBuffer } from '../../../lib/minio';
import { getMimeType, getFileType } from '../../../lib/files';
import { uploadToGiphy, isGiphyConfigured } from '../../../lib/giphy';
import { convertVideoToGif, convertImageToGif, checkFfmpegAvailable } from '../../../lib/ffmpeg';

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
  };

  if (!isGiphyConfigured()) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Giphy is not configured. Please set GIPHY_API_KEY in your environment.',
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

  // Check for cached Giphy URL
  const existingUrl = await getMemeGiphyUrl(memeId);
  if (existingUrl) {
    // Format response with tags
    const tagString = meme.tags.length > 0 
      ? ' ' + meme.tags.map(t => `#${t.name}`).join(' ')
      : '';
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: existingUrl,
        copyText: `${existingUrl}${tagString}`,
        cached: true 
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Fetch file from MinIO
  const fileBuffer = await getFileBuffer(meme.filePath);
  if (!fileBuffer) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch meme file' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const mimeType = getMimeType(meme.filePath);
    const fileType = getFileType(mimeType);
    
    let uploadBuffer: Buffer;
    
    // Giphy only accepts animated GIFs and videos
    // Static images (PNG, JPG) and videos need to be converted to GIF
    if (mimeType === 'image/gif') {
      // Already a GIF, upload as-is
      uploadBuffer = fileBuffer;
    } else {
      // Need ffmpeg for conversion
      const ffmpegAvailable = await checkFfmpegAvailable();
      if (!ffmpegAvailable) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'ffmpeg is not installed. Cannot convert media to GIF.' 
          }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      if (fileType === 'video') {
        // Convert video to GIF
        uploadBuffer = await convertVideoToGif(fileBuffer);
      } else {
        // Convert static image (PNG, JPG) to GIF
        uploadBuffer = await convertImageToGif(fileBuffer);
      }
    }

    // Upload to Giphy with tags
    const tags = meme.tags.map(t => t.name);
    const result = await uploadToGiphy(uploadBuffer, 'image/gif', tags);

    // Cache the Giphy URL
    await updateMemeGiphyUrl(memeId, result.url);

    // Format response with tags
    const tagString = tags.length > 0 
      ? ' ' + tags.map(t => `#${t}`).join(' ')
      : '';

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: result.url,
        copyText: `${result.url}${tagString}`,
        cached: false 
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to share to Giphy: ${errorMessage}` 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
