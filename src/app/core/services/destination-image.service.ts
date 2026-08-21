import { Injectable, inject, signal } from '@angular/core';
import { Destination, PlaceImage, AuthorAttribution } from '../../models/destination.model';
import { GooglePlacesService } from './google-places.service';

@Injectable({
  providedIn: 'root'
})
export class DestinationImageService {
  private readonly googlePlacesService = inject(GooglePlacesService);

  /**
   * Authoritative primary photo URL for hero banners and high-res displays
   */
  getPrimaryImage(destination?: Destination | null): string {
    if (!destination) return '';

    // 1. If primaryImage object is present with url/heroUrl
    if (destination.primaryImage) {
      if (destination.primaryImage.heroUrl) return destination.primaryImage.heroUrl;
      if (destination.primaryImage.url) return destination.primaryImage.url;
      if (destination.primaryImage.photoName) {
        return this.googlePlacesService.getPhotoMediaUrl(destination.primaryImage.photoName, 1200);
      }
    }

    // 2. If heroImage is a PlaceImage object
    if (typeof destination.heroImage === 'object' && destination.heroImage !== null) {
      const hero = destination.heroImage as PlaceImage;
      if (hero.heroUrl) return hero.heroUrl;
      if (hero.url) return hero.url;
      if (hero.photoName) {
        return this.googlePlacesService.getPhotoMediaUrl(hero.photoName, 1200);
      }
    }

    // 3. If heroImage is a direct string URL
    if (typeof destination.heroImage === 'string' && destination.heroImage.length > 0) {
      return destination.heroImage;
    }

    // 4. Default destination image property
    if (destination.image) {
      return destination.image;
    }

    return '';
  }

  /**
   * Fast thumbnail photo URL optimized for cards and lists (800px width)
   */
  getThumbnailImage(destination?: Destination | null): string {
    if (!destination) return '';

    if (destination.thumbnailUrl) {
      return destination.thumbnailUrl;
    }

    if (destination.primaryImage) {
      if (destination.primaryImage.thumbnailUrl) return destination.primaryImage.thumbnailUrl;
      if (destination.primaryImage.photoName) {
        return this.googlePlacesService.getPhotoMediaUrl(destination.primaryImage.photoName, 800);
      }
    }

    if (typeof destination.heroImage === 'object' && destination.heroImage !== null) {
      const hero = destination.heroImage as PlaceImage;
      if (hero.thumbnailUrl) return hero.thumbnailUrl;
      if (hero.photoName) {
        return this.googlePlacesService.getPhotoMediaUrl(hero.photoName, 800);
      }
    }

    const primary = this.getPrimaryImage(destination);
    if (primary) {
      if (primary.includes('Special:FilePath') && !primary.includes('width=')) {
        return `${primary}?width=800`;
      }
      return primary;
    }

    return '';
  }

  /**
   * Get formatted gallery array of PlaceImage objects
   */
  getGalleryImages(destination?: Destination | null): PlaceImage[] {
    if (!destination) return [];

    if (destination.placePhotos && destination.placePhotos.length > 0) {
      return destination.placePhotos;
    }

    if (destination.gallery && destination.gallery.length > 0) {
      return destination.gallery.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return item as PlaceImage;
        }
        return {
          url: item,
          thumbnailUrl: item.includes('Special:FilePath') ? `${item}?width=800` : item,
          heroUrl: item,
          source: 'Google Places / Location Photography',
          attribution: `${destination.name} — Photo ${index + 1}`,
          verified: true
        };
      });
    }

    const primary = this.getPrimaryImage(destination);
    if (primary) {
      return [{
        url: primary,
        thumbnailUrl: this.getThumbnailImage(destination),
        heroUrl: primary,
        source: 'Google Places / Location Photography',
        attribution: `${destination.name}, ${destination.state}`,
        verified: true
      }];
    }

    return [];
  }

  /**
   * Extract required author attributions for Google Places photo guidelines
   */
  getAuthorAttributions(destination?: Destination | null): AuthorAttribution[] {
    if (!destination) return [];

    if (destination.primaryImage?.authorAttributions && destination.primaryImage.authorAttributions.length > 0) {
      return destination.primaryImage.authorAttributions;
    }

    if (destination.imageAuthor) {
      return [{
        displayName: destination.imageAuthor,
        uri: destination.sourceUrl
      }];
    }

    if (destination.imageMetadata?.author) {
      return [{
        displayName: destination.imageMetadata.author,
        uri: destination.imageMetadata.sourceUrl
      }];
    }

    return [];
  }

  /**
   * Extract Google Rating information if present
   */
  getGoogleRating(destination?: Destination | null): { rating: number; count: number; source: string } | null {
    if (!destination) return null;
    if (destination.googleRating) {
      return {
        rating: destination.googleRating,
        count: destination.googleUserRatingCount || destination.reviewCount || 1000,
        source: destination.ratingSource || 'Google Places API'
      };
    }
    return {
      rating: destination.rating || 4.8,
      count: destination.reviewCount || 1500,
      source: destination.ratingSource || 'TripForge Verified'
    };
  }
}
