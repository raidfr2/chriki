import { useEffect } from 'react';
import { useAuth } from './use-auth';

export const useAccentColor = () => {
  const { profile } = useAuth();

  useEffect(() => {
    const applyAccentColor = (color: string) => {
      const accentColors = {
        blue: '#3b82f6',
        green: '#10b981',
        purple: '#8b5cf6',
        red: '#ef4444'
      };
      
      const selectedColor = accentColors[color as keyof typeof accentColors] || accentColors.blue;
      document.documentElement.style.setProperty('--accent-color', selectedColor);
    };

    // Apply accent color when profile changes
    if (profile?.preferences?.accentColor) {
      applyAccentColor(profile.preferences.accentColor);
    } else {
      // Default to blue
      applyAccentColor('blue');
    }
  }, [profile?.preferences?.accentColor]);
};
