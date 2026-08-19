/**
 * Image Loader - External image loading system
 *
 * Loads external images (anime characters, photos, etc.) for use as character sprites.
 * Supports PNG, JPG, WebP with transparent backgrounds.
 */

export interface ImageConfig {
  /** Image source path (relative to public/ or absolute URL) */
  src: string;
  /** Display width in pixels */
  width: number;
  /** Display height in pixels */
  height: number;
  /** Number of frames for sprite sheet (horizontal layout) */
  frames?: number;
  /** Frame duration in ms (for animations) */
  frameDuration?: number;
  /** Offset X for positioning */
  offsetX?: number;
  /** Offset Y for positioning */
  offsetY?: number;
  /** Scale factor (1.0 = original size) */
  scale?: number;
}

export interface LoadedImage {
  element: HTMLImageElement;
  config: ImageConfig;
  loaded: boolean;
}

class ImageLoaderClass {
  private cache: Map<string, LoadedImage> = new Map();
  private loading: Map<string, Promise<LoadedImage>> = new Map();

  /**
   * Load an external image
   */
  async load(config: ImageConfig): Promise<LoadedImage> {
    // Check cache first
    const cached = this.cache.get(config.src);
    if (cached && cached.loaded) {
      return cached;
    }

    // Check if already loading
    const loadingPromise = this.loading.get(config.src);
    if (loadingPromise) {
      return loadingPromise;
    }

    // Start loading
    const promise = this.loadImage(config);
    this.loading.set(config.src, promise);

    try {
      const loaded = await promise;
      this.cache.set(config.src, loaded);
      return loaded;
    } finally {
      this.loading.delete(config.src);
    }
  }

  /**
   * Preload multiple images
   */
  async preload(configs: ImageConfig[]): Promise<void> {
    await Promise.all(configs.map(config => this.load(config)));
  }

  /**
   * Get cached image (synchronous)
   */
  get(src: string): LoadedImage | null {
    const cached = this.cache.get(src);
    return cached && cached.loaded ? cached : null;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.loading.clear();
  }

  private loadImage(config: ImageConfig): Promise<LoadedImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const loadedImage: LoadedImage = {
        element: img,
        config,
        loaded: false,
      };

      img.onload = () => {
        loadedImage.loaded = true;
        console.log(`[ImageLoader] Loaded: ${config.src} (${img.width}×${img.height})`);
        resolve(loadedImage);
      };

      img.onerror = (error) => {
        console.error(`[ImageLoader] Failed to load: ${config.src}`, error);
        reject(new Error(`Failed to load image: ${config.src}`));
      };

      // Determine final URL
      let finalUrl: string;
      
      if (config.src.startsWith('http://') || config.src.startsWith('https://')) {
        // Absolute URL (external image)
        img.crossOrigin = 'anonymous'; // Enable CORS
        finalUrl = config.src;
      } else {
        // Relative path - detect base URL from current location
        // GitHub Pages: /lingotype/, Local dev: /
        const pathname = window.location.pathname;
        const base = pathname.startsWith('/lingotype') ? '/lingotype/' : '/';

        // If config.src already starts with base (e.g., '/lingotype/characters/...'),
        // it's already an absolute path from domain root — use as-is
        finalUrl = config.src.startsWith(base) ? config.src : base + config.src;
      }
      
      console.log(`[ImageLoader] Loading: ${config.src} → ${finalUrl}`);
      img.src = finalUrl;
    });
  }
}

// Singleton instance
export const ImageLoader = new ImageLoaderClass();
