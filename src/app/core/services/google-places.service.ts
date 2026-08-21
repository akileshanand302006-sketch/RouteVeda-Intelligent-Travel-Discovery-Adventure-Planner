import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay } from 'rxjs';
import { Destination, PlaceImage, AuthorAttribution } from '../../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private readonly http = inject(HttpClient);
  
  // Google Places API (New) Configuration
  private apiKey: string = ''; // In client mode, will use pre-resolved mappings or user configured API key
  private readonly baseUrl = 'https://places.googleapis.com/v1';

  // In-memory cache for Place Details & Photo URLs
  private readonly placeDetailsCache = new Map<string, any>();
  private readonly photoUrlCache = new Map<string, string>();
  private mappingsCache$: Observable<Record<string, any>> | null = null;

  constructor() {
    // Attempt to load API key from environment or local storage if provided
    try {
      if (typeof window !== 'undefined') {
        const storedKey = localStorage.getItem('tf_google_places_api_key');
        if (storedKey) {
          this.apiKey = storedKey;
        }
      }
    } catch {}
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tf_google_places_api_key', key);
      }
    } catch {}
  }

  getApiKey(): string {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 5;
  }

  /**
   * Load Google Place mappings dataset containing Place IDs & metadata for all 247 destinations
   */
  getPlaceMappings(): Observable<Record<string, any>> {
    if (!this.mappingsCache$) {
      this.mappingsCache$ = this.http.get<Record<string, any>>('/data/google-place-mappings.json').pipe(
        catchError(err => {
          console.warn('⚠️ Could not load remote google-place-mappings.json:', err);
          return of({});
        }),
        shareReplay(1)
      );
    }
    return this.mappingsCache$;
  }

  /**
   * Google Places API (New) — Text Search (New)
   * POST https://places.googleapis.com/v1/places:searchText
   */
  searchPlace(textQuery: string): Observable<any[]> {
    if (!this.hasApiKey()) {
      return of([]);
    }

    const url = `${this.baseUrl}/places:searchText`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.rating,places.userRatingCount,places.googleMapsUri,places.types'
    });

    const body = {
      textQuery: textQuery,
      languageCode: 'en'
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      map(res => res.places || []),
      catchError(err => {
        console.error('Google Places Text Search error:', err);
        return of([]);
      })
    );
  }

  /**
   * Google Places API (New) — Place Details (New)
   * GET https://places.googleapis.com/v1/places/{PLACE_ID}
   */
  getPlaceDetails(placeId: string): Observable<any | null> {
    if (this.placeDetailsCache.has(placeId)) {
      return of(this.placeDetailsCache.get(placeId));
    }

    if (!this.hasApiKey()) {
      return of(null);
    }

    const url = `${this.baseUrl}/places/${encodeURIComponent(placeId)}`;
    const headers = new HttpHeaders({
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,photos,rating,userRatingCount,googleMapsUri,types'
    });

    return this.http.get<any>(url, { headers }).pipe(
      map(res => {
        if (res) {
          this.placeDetailsCache.set(placeId, res);
        }
        return res;
      }),
      catchError(err => {
        console.error(`Google Place Details error for ${placeId}:`, err);
        return of(null);
      })
    );
  }

  /**
   * Google Places API (New) — Place Photos (New)
   * Constructs valid photo URL with width/height constraint
   */
  getPhotoMediaUrl(photoName: string, maxWidthPx: number = 1200, maxHeightPx?: number): string {
    if (!photoName) return '';

    // If photoName is already a direct full URL (e.g. from CDN/mirror)
    if (photoName.startsWith('http')) {
      return photoName;
    }

    const cacheKey = `${photoName}_${maxWidthPx}_${maxHeightPx || 0}`;
    if (this.photoUrlCache.has(cacheKey)) {
      return this.photoUrlCache.get(cacheKey)!;
    }

    if (this.hasApiKey()) {
      let url = `${this.baseUrl}/${photoName}/media?key=${this.apiKey}&maxWidthPx=${maxWidthPx}`;
      if (maxHeightPx) {
        url += `&maxHeightPx=${maxHeightPx}`;
      }
      this.photoUrlCache.set(cacheKey, url);
      return url;
    }

    return '';
  }

  /**
   * Extract authoritative Google Maps navigation URL for a destination
   */
  getGoogleMapsUri(destination?: Destination | null): string {
    if (!destination) return '';
    if (destination.googleMapsUri) {
      return destination.googleMapsUri;
    }
    if (destination.googlePlaceId) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ', ' + destination.state)}&query_place_id=${destination.googlePlaceId}`;
    }
    if (destination.coordinates) {
      return `https://www.google.com/maps/search/?api=1&query=${destination.coordinates.lat},${destination.coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ', ' + destination.state + ', India')}`;
  }
}
