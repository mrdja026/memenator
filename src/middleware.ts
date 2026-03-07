import { defineMiddleware } from 'astro:middleware';
import { ensureBucket } from './lib/minio';

let initialized = false;

export const onRequest = defineMiddleware(async (context, next) => {
  if (!initialized) {
    try {
      await ensureBucket();
      console.log('MinIO storage initialized');
      initialized = true;
    } catch (error) {
      console.error('MinIO initialization failed:', error);
    }
  }
  return next();
});
