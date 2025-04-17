import { ImageSize, IMAGE_SIZES } from '@/types/images';

export const getSizeInPixels = (size: ImageSize): number => {
  return IMAGE_SIZES[size];
};

export const getImagePath = (airline: string, size: ImageSize): string => {
  return `/images/airlines/${airline.toLowerCase()}-${IMAGE_SIZES[size]}x${IMAGE_SIZES[size]}.svg`;
};

// If you need to handle original size separately
export const getOriginalImagePath = (airline: string): string => {
  return `/images/airlines/${airline.toLowerCase()}.svg`;
};
