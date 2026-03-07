import type { APIRoute } from 'astro';
import { createMeme } from '@/lib/db';
import {
  generateUniqueFilename,
  getFileExtension,
  getFileType,
  isAllowedType,
  isAllowedSize,
  saveUploadedFile,
  getFileUrl,
} from '@/lib/files';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const tagsJson = formData.get('tags') as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!title?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAllowedType(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, MP4' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAllowedSize(file.size)) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size: 50MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const extension = getFileExtension(file.type)!;
    const filename = generateUniqueFilename(extension);
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = await saveUploadedFile(buffer, filename, file.type);

    const tags: string[] = tagsJson ? JSON.parse(tagsJson) : [];

    const meme = await createMeme({
      title: title.trim(),
      description: description?.trim() || undefined,
      filePath: fileKey,
      fileType: getFileType(file.type),
      tags,
    });

    const fileUrl = await getFileUrl(fileKey);

    return new Response(
      JSON.stringify({ success: true, meme: { ...meme, fileUrl } }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Upload failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
