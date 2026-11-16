import React, { useState } from 'react';
import { Landmark } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackTitle || 'Malaysian heritage landmark'}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0D3447] via-[#134B66] to-[#1E293B] text-[#FFF4E3] p-4 text-center ${className}`}
      >
        <Landmark className="w-8 h-8 text-[#F5B942] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium leading-snug max-w-[180px]">
          {fallbackTitle || alt || 'Heritage Preview'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
