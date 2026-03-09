const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImageUploadResult {
  success: true;
  link: string;
  deleteUrl: string;
}

export interface ImageUploadError {
  success: false;
  error: string;
}

export type UploadResult = ImageUploadResult | ImageUploadError;

interface ImgBBApiResponse {
  success: boolean;
  status: number;
  data?: {
    url?: string;
    display_url?: string;
    delete_url?: string;
  };
  error?: {
    message?: string;
    code?: number;
  };
}

function getApiKey(): string | null {
  return import.meta.env.IMGBB_API_KEY || null;
}

export async function uploadToImgBB(
  buffer: Buffer,
  _mimeType: string
): Promise<UploadResult> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'IMGBB_API_KEY is not configured. Please add it to your .env file.',
    };
  }

  try {
    const base64Data = buffer.toString('base64');
    
    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await fetch(`${IMGBB_API_URL}?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result: ImgBBApiResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.error?.message || `ImgBB API error (${response.status})`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const link = result.data?.display_url || result.data?.url;
    if (!link) {
      return {
        success: false,
        error: 'ImgBB returned no link',
      };
    }

    return {
      success: true,
      link,
      deleteUrl: result.data?.delete_url || '',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to upload to ImgBB: ${message}`,
    };
  }
}

export function isImageHostConfigured(): boolean {
  return !!getApiKey();
}
