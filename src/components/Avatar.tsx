import React, { useState } from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, fallbackText = '?', size = 'md' }) => {
  const [hasImageError, setHasImageError] = useState(false);

  const getInitial = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  const getFallbackContent = () => {
    if (fallbackText && fallbackText.length > 1) {
      return getInitial(fallbackText);
    }
    return '👤';
  };

  return (
    <div className={`avatar avatar--${size}`}>
      {src && !hasImageError ? (
        <img 
          src={src} 
          alt="Avatar" 
          className="avatar__image"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span className="avatar__fallback">
          {getFallbackContent()}
        </span>
      )}
    </div>
  );
};

export default Avatar;
