import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay } from 'rxjs';
import { Destination, DestinationImage } from '../../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class WikimediaImageService {
  private readonly http = inject(HttpClient);
  private readonly wmBase = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
  private readonly wmPage = 'https://commons.wikimedia.org/wiki/File:';
  private readonly apiEndpoint = 'https://commons.wikimedia.org/w/api.php';

  // In-memory cache of resolved image metadata
  private readonly cache = new Map<string, DestinationImage>();
  private manifestCache$: Observable<Record<string, DestinationImage>> | null = null;

  /**
   * Loads pre-resolved canonical image manifest
   */
  getResolvedManifest(): Observable<Record<string, DestinationImage>> {
    if (!this.manifestCache$) {
      this.manifestCache$ = this.http.get<Record<string, DestinationImage>>('/data/destination-images-resolved.json').pipe(
        map(manifest => {
          Object.entries(manifest).forEach(([key, val]) => {
            this.cache.set(key, val);
            if (val.fileName) {
              this.cache.set(val.fileName, val);
            }
          });
          return manifest;
        }),
        catchError(err => {
          console.warn('⚠️ Could not fetch remote destination-images-resolved.json, using local resolution:', err);
          return of({});
        }),
        shareReplay(1)
      );
    }
    return this.manifestCache$;
  }

  private readonly categoryFallbacks: Record<string, string> = {
    'Heritage': 'https://commons.wikimedia.org/wiki/Special:FilePath/Taj_Mahal,_Agra,_India_edit3.jpg',
    'Adventure': 'https://commons.wikimedia.org/wiki/Special:FilePath/Tsomgo_Lake,_Sikkim,_India.jpg',
    'Nature': 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Living_Root_Bridges_Of_Cherrapunji_In_Megahalya,_India.jpg',
    'Spiritual': 'https://commons.wikimedia.org/wiki/Special:FilePath/Worshipper_at_Mahabodhi_Temple_Bodh_Gaya_India.jpg',
    'Beach': 'https://commons.wikimedia.org/wiki/Special:FilePath/Marina_Beach_Chennai_Sunrise.jpg',
    'Wildlife': 'https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Rhinoceros_in_Kaziranga_National_Park.jpg',
    'Hill Station': 'https://commons.wikimedia.org/wiki/Special:FilePath/Way_around_Kodaikanal_Lake.jpg',
    'Cultural': 'https://commons.wikimedia.org/wiki/Special:FilePath/Shore_Temple,_Mamallapuram.jpg',
    'Default': 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg'
  };

  /**
   * Helper to format a clean canonical Wikimedia FilePath URL with proper encoding and width
   */
  formatWmUrl(url: string, width: number = 800): string {
    if (!url) return '';
    if (url.includes('Special:FilePath/')) {
      const parts = url.split('Special:FilePath/');
      const prefix = parts[0] + 'Special:FilePath/';
      const rawAfter = parts[1] || '';
      const [rawFile] = rawAfter.split('?');
      try {
        const decodedFile = decodeURIComponent(rawFile);
        const encodedFile = encodeURIComponent(decodedFile);
        return `${prefix}${encodedFile}?width=${width}`;
      } catch {
        return `${url.split('?')[0]}?width=${width}`;
      }
    }
    return url;
  }

  /**
   * Fallback image for a specific category
   */
  getCategoryFallback(category?: string, width: number = 800): string {
    const raw = (category && this.categoryFallbacks[category]) || this.categoryFallbacks['Default'];
    return this.formatWmUrl(raw, width);
  }

  /**
   * Extracts or constructs a high-performance thumbnail URL (800px)
   */
  getThumbnailUrl(input?: Destination | DestinationImage | string | null, category?: string): string {
    if (!input) return this.getCategoryFallback(category, 800);

    if (typeof input === 'string') {
      return this.formatWmUrl(input, 800);
    }

    if ('thumbnailUrl' in input && input.thumbnailUrl) {
      return this.formatWmUrl(input.thumbnailUrl, 800);
    }

    if ('heroImage' in input) {
      const hero = input.heroImage;
      if (typeof hero === 'object' && hero?.thumbnailUrl) {
        return this.formatWmUrl(hero.thumbnailUrl, 800);
      }
      if (typeof hero === 'string') {
        return this.getThumbnailUrl(hero, input.category);
      }
      if (input.image) {
        return this.getThumbnailUrl(input.image, input.category);
      }
    }

    if ('url' in input && input.url) {
      return this.getThumbnailUrl(input.url);
    }

    return this.getCategoryFallback(category, 800);
  }

  /**
   * Extracts or constructs a high-resolution hero URL (1200px)
   */
  getHeroUrl(input?: Destination | DestinationImage | string | null, category?: string): string {
    if (!input) return this.getCategoryFallback(category, 1200);

    if (typeof input === 'string') {
      return this.formatWmUrl(input, 1200);
    }

    if ('heroUrl' in input && input.heroUrl) {
      return this.formatWmUrl(input.heroUrl, 1200);
    }

    if ('url' in input && input.url) {
      return this.getHeroUrl(input.url);
    }

    if ('heroImage' in input) {
      const hero = input.heroImage;
      if (typeof hero === 'object' && hero?.url) {
        return this.formatWmUrl(hero.url, 1200);
      }
      if (typeof hero === 'string') {
        return this.getHeroUrl(hero, input.category);
      }
      if (input.image) {
        return this.getHeroUrl(input.image, input.category);
      }
    }

    return this.getCategoryFallback(category, 1200);
  }

  /**
   * Query the Wikimedia Commons MediaWiki API with rate-limiting protection & caching
   */
  resolveFromMediaWiki(fileName: string): Observable<DestinationImage | null> {
    const cleanFileName = fileName.startsWith('File:') ? fileName.substring(5) : fileName;
    const cacheKey = `File:${cleanFileName}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    const titleParam = encodeURIComponent(cacheKey);
    const url = `${this.apiEndpoint}?action=query&titles=${titleParam}&prop=imageinfo&iiprop=url|size|mime|sha1|extmetadata&iiurlwidth=800&format=json&origin=*`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const pages = res?.query?.pages || {};
        const page = Object.values(pages)[0] as any;
        if (!page || page.missing !== undefined || !page.imageinfo || page.imageinfo.length === 0) {
          return null;
        }

        const info = page.imageinfo[0];
        const meta = info.extmetadata || {};
        const artist = meta.Artist ? meta.Artist.value.replace(/<[^>]*>/g, '') : 'Wikimedia Contributor';
        const license = meta.LicenseShortName ? meta.LicenseShortName.value : 'CC BY-SA 4.0';
        const attribution = `${cleanFileName.replace(/_/g, ' ')} by ${artist} via Wikimedia Commons`;

        const imageObj: DestinationImage = {
          url: info.url || `${this.wmBase}${encodeURIComponent(cleanFileName)}`,
          thumbnailUrl: info.thumburl || `${this.wmBase}${encodeURIComponent(cleanFileName)}?width=800`,
          heroUrl: `${this.wmBase}${encodeURIComponent(cleanFileName)}?width=1200`,
          source: 'Wikimedia Commons',
          sourceUrl: info.descriptionurl || `${this.wmPage}${encodeURIComponent(cleanFileName)}`,
          fileName: cacheKey,
          author: artist,
          license: license,
          attribution: attribution,
          verified: true,
          imageStatus: 'verified'
        };

        this.cache.set(cacheKey, imageObj);
        return imageObj;
      }),
      catchError(err => {
        console.error(`Failed to resolve Wikimedia image for ${fileName}:`, err);
        return of(null);
      })
    );
  }

  /**
   * Helper to format a clean canonical Wikimedia source URL
   */
  getCommonsFilePageUrl(fileNameOrUrl: string): string {
    if (fileNameOrUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
      return fileNameOrUrl;
    }
    if (fileNameOrUrl.includes('Special:FilePath/')) {
      const match = fileNameOrUrl.match(/Special:FilePath\/([^?]+)/);
      if (match && match[1]) {
        return `${this.wmPage}${match[1]}`;
      }
    }
    const clean = fileNameOrUrl.replace(/^File:/, '');
    return `${this.wmPage}${encodeURIComponent(clean)}`;
  }
}
