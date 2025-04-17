import Image from 'next/image';
import { ImageSize } from '@/types/images';
import { AIRLINE_LOGOS, AirlineCode } from '@/constants/airlines';
import { getSizeInPixels, getImagePath } from '@/lib/images';

interface LogoProps {
  airline: AirlineCode;
  size: ImageSize | 'original';
  className?: string;
  priority?: boolean;
}

export const AirlineLogo: React.FC<LogoProps> = ({ 
  airline, 
  size = 'medium',
  className,
  priority = false
}) => {
  const src = size === 'original' 
    ? AIRLINE_LOGOS[airline]
    : getImagePath(airline, size);

  const dimensions = size === 'original' 
    ? undefined 
    : getSizeInPixels(size);

  return (
    <Image
      src={src}
      alt={`${airline} logo`}
      width={dimensions}
      height={dimensions}
      className={className}
      priority={priority}
      quality={75} // Adjust quality as needed (default is 75)
      // Only use blur placeholder if you have a small base64 version of the image
      // placeholder="blur"
      // blurDataURL="data:image/..."
    />
  );
};
