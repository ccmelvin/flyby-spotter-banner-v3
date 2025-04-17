// Define the size type without 'original' since it doesn't have a fixed size
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large';

// Define the logo interface separately to include 'original'
export interface AirlineLogo {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

// Size configurations in pixels
export const IMAGE_SIZES = {
  thumbnail: 50,
  small: 100,
  medium: 200,
  large: 400
} as const;

// If you need the type from the IMAGE_SIZES constant
export type ImageSizeMap = typeof IMAGE_SIZES;
