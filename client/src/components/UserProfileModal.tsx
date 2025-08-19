import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ProfileUpdateData } from "@shared/schema";

// Legacy interface for backward compatibility
export interface UserProfile {
  name: string;
  age: string;
  location: string;
  wilaya: string;
  preferredLanguage: string;
  interests: string;
  occupation: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (profile: UserProfile) => void; // Legacy callback for backward compatibility
}

export default function UserProfileModal({ isOpen, onClose, onSave }: UserProfileModalProps) {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Local state for profile editing
  const [localProfile, setLocalProfile] = useState<{
    full_name: string;
    preferences: {
      preferredLanguage?: string;
    };
  }>({
    full_name: "",
    preferences: {
      preferredLanguage: "mixed"
    }
  });

  // Initialize form with existing profile data
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        full_name: profile.full_name || "",
        preferences: {
          preferredLanguage: profile.preferences?.preferredLanguage || "mixed"
        }
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!localProfile.full_name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الاسم الكامل",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData: ProfileUpdateData = {
        full_name: localProfile.full_name,
        preferences: localProfile.preferences
      };

      const { error } = await updateProfile(updateData);
      
      if (error) {
        toast({
          title: "خطأ في الحفظ",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلوماتك الشخصية بنجاح",
      });

      // Legacy callback for backward compatibility
      if (onSave) {
        const legacyProfile: UserProfile = {
          name: localProfile.full_name,
          age: "",
          location: "",
          wilaya: "",
          preferredLanguage: localProfile.preferences.preferredLanguage || "mixed",
          interests: "",
          occupation: ""
        };
        onSave(legacyProfile);
      }

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المعلومات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!profile;

  return (
    <Dialog open={isOpen} onOpenChange={isEditing ? onClose : undefined}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl">
            {isEditing ? "تعديل المعلومات الشخصية" : "أهلاً وسهلاً في Chriki!"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing 
              ? "يمكنك تعديل اسمك و تفضيلات اللغة"
              : "قولنا اسمك و كيفاش تحب نهدر معاك"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-lg flex items-center gap-2">
                👤 Your Name / اسمك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="full_name" className="font-mono text-sm">
                  Full Name / الاسم الكامل *
                </Label>
                <Input
                  id="full_name"
                  value={localProfile.full_name}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="أحمد بن علي، Fatima Benali..."
                  className="text-right h-12 border-2 border-foreground font-mono focus:bg-muted"
                  dir="auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-lg flex items-center gap-2">
                🗣️ Language Preferences / تفضيلات اللغة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="font-mono text-sm">
                  How would you like me to speak? / كيفاش تحب نهدر معاك؟
                </Label>
                <Select
                  value={localProfile.preferences.preferredLanguage}
                  onValueChange={(value) => setLocalProfile(prev => ({ 
                    ...prev, 
                    preferences: { ...prev.preferences, preferredLanguage: value }
                  }))}
                >
                  <SelectTrigger className="h-12 border-2 border-foreground font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="darija">دارجة جزائرية (Algerian Darija)</SelectItem>
                    <SelectItem value="french">Français (French)</SelectItem>
                    <SelectItem value="arabic">العربية الفصحى (Standard Arabic)</SelectItem>
                    <SelectItem value="mixed">Mixed / مخلوط (دارجة + فرنسية)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          {isEditing && (
            <Button variant="outline" onClick={onClose} className="font-mono">
              إلغاء
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button
              onClick={handleSave}
              disabled={!localProfile.full_name.trim() || isLoading}
              className="font-mono bg-foreground text-background hover:bg-foreground/90"
            >
              {isLoading ? "جاري الحفظ..." : (isEditing ? "حفظ التغييرات" : "ابدأ المحادثة")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}