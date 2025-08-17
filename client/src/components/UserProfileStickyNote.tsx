import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, User, MapPin, Briefcase, Heart } from "lucide-react";
import { UserProfile } from "@shared/schema";

interface UserProfileStickyNoteProps {
  userProfile: UserProfile | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function UserProfileStickyNote({ 
  userProfile, 
  isVisible, 
  onClose 
}: UserProfileStickyNoteProps) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isVisible && userProfile) {
      setIsAnimatingIn(true);
    }
  }, [isVisible, userProfile]);

  if (!isVisible || !userProfile) {
    return null;
  }

  const hasInfo = userProfile.name || userProfile.location || userProfile.job || 
                 (userProfile.hobbies && userProfile.hobbies.length > 0);

  if (!hasInfo) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-in-out transform ${
        isAnimatingIn
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <Card className="w-64 p-4 bg-yellow-50 border-2 border-yellow-200 shadow-lg dark:bg-yellow-900 dark:border-yellow-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-yellow-700 dark:text-yellow-300">
              📝 What I know about you
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-yellow-200 dark:hover:bg-yellow-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          {userProfile.name && (
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3 text-yellow-600" />
              <span className="font-medium text-yellow-800 dark:text-yellow-200">
                {userProfile.name}
              </span>
            </div>
          )}

          {userProfile.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-yellow-600" />
              <span className="text-yellow-700 dark:text-yellow-300">
                {userProfile.location}
              </span>
            </div>
          )}

          {userProfile.job && (
            <div className="flex items-center space-x-2">
              <Briefcase className="h-3 w-3 text-yellow-600" />
              <span className="text-yellow-700 dark:text-yellow-300">
                {userProfile.job}
              </span>
            </div>
          )}

          {userProfile.hobbies && userProfile.hobbies.length > 0 && (
            <div className="flex items-start space-x-2">
              <Heart className="h-3 w-3 text-yellow-600 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {userProfile.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full dark:bg-yellow-800 dark:text-yellow-200"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {userProfile.notes && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
              {userProfile.notes}
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-yellow-200 dark:border-yellow-700">
          <span className="text-xs text-yellow-600 dark:text-yellow-400">
            Updated: {new Date(userProfile.lastUpdated!).toLocaleTimeString()}
          </span>
        </div>
      </Card>
    </div>
  );
}