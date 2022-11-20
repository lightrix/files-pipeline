import type { AvifOptions, GifOptions, HeifOptions, JpegOptions, PngOptions, TiffOptions, WebpOptions } from "sharp";
export default interface IMG {
    [key: string]: AvifOptions | GifOptions | HeifOptions | JpegOptions | PngOptions | TiffOptions | WebpOptions | boolean;
    avif?: AvifOptions | boolean;
    gif?: GifOptions | boolean;
    heif?: HeifOptions | boolean;
    jpeg?: JpegOptions | boolean;
    png?: PngOptions | boolean;
    tiff?: TiffOptions | boolean;
    webp?: WebpOptions | boolean;
}
