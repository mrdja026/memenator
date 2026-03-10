import type { APIRoute } from 'astro';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'memenator-media';

const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const GET: APIRoute = async ({ params, request }) => {
  const key = params.key;
  
  if (!key) {
    return new Response('Not found', { status: 404, headers: corsHeaders });
  }

  try {
    const rangeHeader = request.headers.get('Range');
    
    const command = new GetObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
      Range: rangeHeader || undefined,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    const headers: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': response.ContentType || 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000',
    };

    if (response.ContentLength !== undefined) {
      headers['Content-Length'] = String(response.ContentLength);
    }
    
    if (response.ContentRange) {
      headers['Content-Range'] = response.ContentRange;
    }

    const status = rangeHeader && response.ContentRange ? 206 : 200;
    const bodyStream = response.Body.transformToWebStream();

    return new Response(bodyStream, { status, headers });
  } catch (error) {
    console.error('Media fetch error:', error);
    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
