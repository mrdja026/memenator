import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';

const execPromise = promisify(exec);

export interface ConversionOptions {
  width?: number;    // Default: 480
  fps?: number;      // Default: 15
  colors?: number;   // Default: 256
  maxSize?: number;  // Default: 5MB (not enforced, just target)
}

/**
 * Converts a video buffer to GIF using ffmpeg
 * 
 * Uses optimized settings for web sharing:
 * - 480p width (maintains aspect ratio)
 * - 15 fps for smooth playback
 * - 256 color palette for good quality
 * - Targets ~5MB file size
 * 
 * @param inputBuffer - Video file buffer (MP4, etc.)
 * @param options - Conversion options
 * @returns GIF buffer
 */
export async function convertVideoToGif(
  inputBuffer: Buffer,
  options: ConversionOptions = {}
): Promise<Buffer> {
  const {
    width = 480,
    fps = 15,
    colors = 256,
  } = options;

  // Generate unique temp file names
  const tempDir = tmpdir();
  const inputPath = join(tempDir, `${randomUUID()}.mp4`);
  const outputPath = join(tempDir, `${randomUUID()}.gif`);
  const palettePath = join(tempDir, `${randomUUID()}.png`);

  try {
    // Write input buffer to temp file
    await writeFile(inputPath, inputBuffer);

    // Step 1: Generate optimized color palette
    const paletteCommand = `ffmpeg -i "${inputPath}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos,palettegen=max_colors=${colors}" -y "${palettePath}"`;
    
    await execPromise(paletteCommand);

    // Step 2: Convert video to GIF using the palette
    const gifCommand = `ffmpeg -i "${inputPath}" -i "${palettePath}" -filter_complex "fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse" -loop 0 -y "${outputPath}"`;
    
    await execPromise(gifCommand);

    // Read the generated GIF
    const { readFile } = await import('fs/promises');
    const gifBuffer = await readFile(outputPath);

    return gifBuffer;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`ffmpeg conversion failed: ${errorMessage}`);
  } finally {
    // Clean up temp files
    try {
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
      await unlink(palettePath).catch(() => {});
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Converts an image buffer to an animated GIF format
 * 
 * GIPHY's Upload API requires animated content - single-frame GIFs are rejected
 * with a 400 error. This function creates a 2-frame animated GIF by concatenating
 * the image twice, satisfying GIPHY's requirements while keeping the image essentially static.
 * 
 * @param inputBuffer - Image file buffer (PNG, JPG, etc.)
 * @returns Animated GIF buffer
 */
export async function convertImageToGif(inputBuffer: Buffer): Promise<Buffer> {
  const tempDir = tmpdir();
  const id = randomUUID();
  const inputPath = join(tempDir, `${id}.png`);
  const palettePath = join(tempDir, `${id}_palette.png`);
  const outputPath = join(tempDir, `${id}.gif`);

  try {
    // Write input buffer to temp file
    await writeFile(inputPath, inputBuffer);

    // Step 1: Generate color palette from the image
    const paletteCmd = `ffmpeg -i "${inputPath}" -vf "palettegen=max_colors=256" -y "${palettePath}"`;
    await execPromise(paletteCmd, { timeout: 30000 });

    // Step 2: Create a 2-frame GIF using the palette
    // Use -framerate 0.5 (2 seconds per frame) and duplicate input twice via concat
    // This creates a minimal "animation" that GIPHY will accept
    const gifCmd = `ffmpeg -framerate 0.5 -i "${inputPath}" -i "${inputPath}" -i "${palettePath}" -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v];[v][2:v]paletteuse" -loop 0 -y "${outputPath}"`;
    await execPromise(gifCmd, { timeout: 30000 });

    // Read the generated GIF
    const { readFile } = await import('fs/promises');
    const gifBuffer = await readFile(outputPath);

    return gifBuffer;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Image to GIF conversion failed: ${errorMessage}`);
  } finally {
    // Clean up temp files
    await unlink(inputPath).catch(() => {});
    await unlink(palettePath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Checks if ffmpeg is available in the system
 * 
 * @returns true if ffmpeg is installed and accessible
 */
export async function checkFfmpegAvailable(): Promise<boolean> {
  try {
    await execPromise('ffmpeg -version');
    return true;
  } catch {
    return false;
  }
}
