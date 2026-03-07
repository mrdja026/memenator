import {
  uploadFile as minioUpload,
  deleteFile as minioDelete,
  getPresignedUrl as minioGetPresignedUrl,
} from './minio';

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
};

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function generateUniqueFilename(extension: string): string {
  const id = crypto.randomUUID();
  return `${id}.${extension}`;
}

export function getFileExtension(mimeType: string): string | null {
  return ALLOWED_TYPES[mimeType] ?? null;
}

export function isAllowedType(mimeType: string): boolean {
  return mimeType in ALLOWED_TYPES;
}

export function isAllowedSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function getFileType(mimeType: string): 'image' | 'video' {
  return mimeType.startsWith('video/') ? 'video' : 'image';
}

export async function saveUploadedFile(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  await minioUpload(filename, buffer, mimeType);
  return filename;
}

export async function deleteUploadedFile(fileKey: string): Promise<void> {
  await minioDelete(fileKey);
}

export async function getFileUrl(fileKey: string): Promise<string> {
  return minioGetPresignedUrl(fileKey);
}

export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}
