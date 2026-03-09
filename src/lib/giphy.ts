/**
 * Giphy Upload API Integration
 * 
 * Handles uploading files to Giphy's upload endpoint.
 * Supports GIF, MP4, MOV, and WEBM files.
 * Requires GIPHY_API_KEY environment variable.
 * 
 * API Endpoint: upload.giphy.com/v1/gifs
 * Documentation: https://developers.giphy.com/docs/api/endpoint/#upload
 */

export interface GiphyUploadResponse {
  data: {
    id: string;
  } | null;
  meta: {
    status: number;
    msg: string;
    response_id?: string;
  };
}

export interface GiphyUploadResult {
  url: string;
  id: string;
}

/**
 * Uploads a file to Giphy using child process curl for reliability
 * 
 * @param fileBuffer - File buffer (GIF, MP4, MOV, or WEBM)
 * @param mimeType - MIME type of the file
 * @param tags - Array of tags to apply to the upload
 * @param apiKey - Giphy API key (defaults to GIPHY_API_KEY env var)
 * @returns Giphy URL and ID
 */
export async function uploadToGiphy(
  fileBuffer: Buffer,
  mimeType: string,
  tags: string[] = [],
  apiKey?: string
): Promise<GiphyUploadResult> {
  const key = apiKey || import.meta.env.GIPHY_API_KEY;
  
  if (!key) {
    throw new Error('GIPHY_API_KEY not configured');
  }

  console.log(`[Giphy] Uploading file: size=${fileBuffer.length} bytes, mimeType=${mimeType}`);

  try {
    // Write buffer to temp file and use curl for reliable multipart upload
    const { writeFile, unlink } = await import('fs/promises');
    const { execSync } = await import('child_process');
    const { tmpdir } = await import('os');
    const { join } = await import('path');
    const { randomUUID } = await import('crypto');
    
    const tempPath = join(tmpdir(), `${randomUUID()}.gif`);
    
    try {
      // Write file to temp location
      await writeFile(tempPath, fileBuffer);
      
      // Build curl command
      const tagParam = tags.length > 0 ? `-F "tags=${tags.join(',')}"` : '';
      const curlCmd = `curl -s -X POST "https://upload.giphy.com/v1/gifs" -F "api_key=${key}" -F "file=@${tempPath}" ${tagParam}`;
      
      console.log(`[Giphy] Executing curl upload...`);
      
      // Execute curl
      const result = execSync(curlCmd, { 
        encoding: 'utf-8',
        timeout: 60000,
      });
      
      console.log(`[Giphy] Response: ${result}`);
      
      const data: GiphyUploadResponse = JSON.parse(result);
      
      if (data.meta.status !== 200) {
        throw new Error(`Giphy upload failed: ${data.meta.msg}`);
      }

      if (!data.data?.id) {
        throw new Error('Giphy response missing GIF ID');
      }

      const giphyId = data.data.id;
      const giphyUrl = `https://giphy.com/gifs/${giphyId}`;

      console.log(`[Giphy] Upload successful: ${giphyUrl}`);

      return {
        url: giphyUrl,
        id: giphyId,
      };
    } finally {
      // Clean up temp file
      await unlink(tempPath).catch(() => {});
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[Giphy] Upload error: ${error.message}`);
      throw new Error(`Failed to upload to Giphy: ${error.message}`);
    }
    throw new Error('Failed to upload to Giphy: Unknown error');
  }
}

/**
 * Checks if GIPHY_API_KEY is configured
 * 
 * @returns true if API key is available
 */
export function isGiphyConfigured(): boolean {
  return !!import.meta.env.GIPHY_API_KEY;
}
