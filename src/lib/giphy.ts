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
 * Uploads a file to Giphy using the fetch API with multipart form data
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
    const formData = new FormData();
    formData.append('api_key', key);
    formData.append('file', new Blob([fileBuffer], { type: 'image/gif' }), 'upload.gif');
    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }

    console.log(`[Giphy] Executing fetch upload...`);

    const response = await fetch('https://upload.giphy.com/v1/gifs', {
      method: 'POST',
      body: formData,
    });

    const data: GiphyUploadResponse = await response.json();

    console.log(`[Giphy] Response status: ${data.meta.status}`);

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
