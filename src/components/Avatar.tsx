import React from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, fallbackText = '?', size = 'md' }) => {
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
      {src ? (
        <img 
          src={src} 
          alt="Avatar" 
          className="avatar__image"
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="avatar__fallback">${getFallbackContent()}</span>`;
            }
          }}
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
