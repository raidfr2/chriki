import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { ProfileUpdateData } from "@shared/schema";
import { X, Settings, Bell, User, MapPin } from "lucide-react";
import { loadNotificationSettings, saveNotificationSettings, requestNotificationPermission, type NotificationSettings } from "@/lib/notifications";
import { useLocation } from "@/lib/location-context";
import { useTutorial } from "@/lib/tutorial-context";
import { chatTutorialSteps } from "@/lib/chat-tutorial-steps";
import LocationTestHelper from "@/components/LocationTestHelper";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'notifications' | 'personalization' | 'location';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { startTutorial } = useTutorial();
  const { 
    location, 
    permission, 
    isLoading: locationLoading, 
    error: locationError, 
    requestLocation, 
    clearLocation,
    hasLocation 
  } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Local state for notifications
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    desktopNotifications: false,
    soundNotifications: false
  });

  // Local state for profile editing
  const [localProfile, setLocalProfile] = useState<{
    full_name: string;
    preferences: {
      preferredLanguage?: string;
      theme?: string;
      accentColor?: string;
      showFollowUpSuggestions?: boolean;
    };
  }>({
    full_name: "",
    preferences: {
      preferredLanguage: "mixed",
      theme: "system",
      accentColor: "blue",
      showFollowUpSuggestions: true
    }
  });

  // Initialize form with existing profile data and notification settings
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        full_name: profile.full_name || "",
        preferences: {
          preferredLanguage: profile.preferences?.preferredLanguage || "mixed",
          theme: profile.preferences?.theme || theme || "system",
          accentColor: profile.preferences?.accentColor || "blue",
          showFollowUpSuggestions: profile.preferences?.showFollowUpSuggestions ?? true
        }
      });
    }
    
    // Load notification settings
    setNotificationSettings(loadNotificationSettings());
    
    // Apply current accent color
    if (profile?.preferences?.accentColor) {
      const accentColors = {
        blue: '#3b82f6',
        green: '#10b981',
        purple: '#8b5cf6',
        red: '#ef4444'
      };
      const color = accentColors[profile.preferences.accentColor as keyof typeof accentColors] || accentColors.blue;
      document.documentElement.style.setProperty('--accent-color', color);
    }
  }, [profile, theme]);

  const handleSave = async () => {
    if (!localProfile.full_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
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
          title: "Save Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Update theme if changed
      if (localProfile.preferences.theme) {
        setTheme(localProfile.preferences.theme as "light" | "dark" | "system");
      }

      // Save notification settings
      saveNotificationSettings(notificationSettings);

      // Apply accent color to CSS custom properties
      const root = document.documentElement;
      const accentColors = {
        blue: '#3b82f6',
        green: '#10b981',
        purple: '#8b5cf6',
        red: '#ef4444'
      };
      const selectedColor = accentColors[localProfile.preferences.accentColor as keyof typeof accentColors] || accentColors.blue;
      root.style.setProperty('--accent-color', selectedColor);

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ tab, icon: Icon, label, isActive, onClick }: {
    tab: SettingsTab;
    icon: React.ComponentType<any>;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive 
          ? 'accent-bg text-white' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className="max-w-3xl max-h-[80vh] p-0 overflow-hidden" hideCloseButton>
         {/* Close Button */}
         <button 
           onClick={onClose}
           className="absolute top-3 right-3 p-2 hover:bg-muted rounded-lg transition-colors z-10"
         >
           <X className="w-4 h-4" />
         </button>
         
         <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/30 p-3">
            <nav className="space-y-1">
              <TabButton
                tab="general"
                icon={Settings}
                label="General"
                isActive={activeTab === 'general'}
                onClick={() => setActiveTab('general')}
              />
              <TabButton
                tab="notifications"
                icon={Bell}
                label="Notifications"
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              />
              <TabButton
                tab="personalization"
                icon={User}
                label="Personalization"
                isActive={activeTab === 'personalization'}
                onClick={() => setActiveTab('personalization')}
              />
              <TabButton
                tab="location"
                icon={MapPin}
                label="Location"
                isActive={activeTab === 'location'}
                onClick={() => setActiveTab('location')}
              />
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General</h3>
                  
                                     {/* Theme Section */}
                   <div className="space-y-3 pb-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label className="text-sm font-medium">Theme</Label>
                       </div>
                                             <Select
                         value={localProfile.preferences.theme}
                         onValueChange={(value) => setLocalProfile(prev => ({ 
                           ...prev, 
                           preferences: { ...prev.preferences, theme: value }
                         }))}
                       >
                         <SelectTrigger className="w-28 border-2 border-border focus:accent-border focus:ring-1 focus:ring-accent-border">
                           <SelectValue />
                         </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                                     {/* Accent Color Section */}
                   <div className="space-y-3 pb-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label className="text-sm font-medium">Accent color</Label>
                       </div>
                                             <Select
                         value={localProfile.preferences.accentColor}
                         onValueChange={(value) => setLocalProfile(prev => ({ 
                           ...prev, 
                           preferences: { ...prev.preferences, accentColor: value }
                         }))}
                       >
                         <SelectTrigger className="w-28 border-2 border-border focus:accent-border focus:ring-1 focus:ring-accent-border">
                           <SelectValue />
                         </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              Blue
                            </div>
                          </SelectItem>
                          <SelectItem value="green">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              Green
                            </div>
                          </SelectItem>
                          <SelectItem value="purple">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              Purple
                            </div>
                          </SelectItem>
                          <SelectItem value="red">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              Red
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                                     {/* Language Section */}
                   <div className="space-y-3 pb-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label className="text-sm font-medium">Language</Label>
                       </div>
                                             <Select
                         value={localProfile.preferences.preferredLanguage}
                         onValueChange={(value) => setLocalProfile(prev => ({ 
                           ...prev, 
                           preferences: { ...prev.preferences, preferredLanguage: value }
                         }))}
                       >
                         <SelectTrigger className="w-40 border-2 border-border focus:accent-border focus:ring-1 focus:ring-accent-border">
                           <SelectValue />
                         </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="darija">دارجة جزائرية (Algerian)</SelectItem>
                          <SelectItem value="french">Français (French)</SelectItem>
                          <SelectItem value="arabic">العربية الفصحى (Arabic)</SelectItem>
                          <SelectItem value="mixed">Mixed / مخلوط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Follow-up Suggestions */}
                  <div className="space-y-3 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Show follow-up suggestions in chats</Label>
                      </div>
                                             <Switch
                         checked={localProfile.preferences.showFollowUpSuggestions}
                         onCheckedChange={(checked) => setLocalProfile(prev => ({ 
                           ...prev, 
                           preferences: { ...prev.preferences, showFollowUpSuggestions: checked }
                         }))}
                         className="data-[state=checked]:accent-bg data-[state=checked]:border-accent-border"
                       />
                    </div>
                  </div>

                  {/* Tutorial Section */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div>
                      <Label className="text-sm font-medium">Tutorial</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Learn how to use Chriki's features with an interactive tour
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        startTutorial(chatTutorialSteps);
                        onClose();
                      }}
                      className="accent-border hover:accent-bg hover:text-white text-sm"
                    >
                      🎓 Start Tutorial
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Desktop notifications</Label>
                        <p className="text-xs text-muted-foreground">Get notified about new messages</p>
                      </div>
                                             <Switch 
                         checked={notificationSettings.desktopNotifications}
                         onCheckedChange={async (checked) => {
                           if (checked) {
                             const hasPermission = await requestNotificationPermission();
                             if (hasPermission) {
                               setNotificationSettings(prev => ({ ...prev, desktopNotifications: checked }));
                             }
                           } else {
                             setNotificationSettings(prev => ({ ...prev, desktopNotifications: checked }));
                           }
                         }}
                         className="data-[state=checked]:accent-bg data-[state=checked]:border-accent-border"
                       />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Sound notifications</Label>
                        <p className="text-xs text-muted-foreground">Play sound for new messages</p>
                      </div>
                                             <Switch 
                         checked={notificationSettings.soundNotifications}
                         onCheckedChange={(checked) => 
                           setNotificationSettings(prev => ({ ...prev, soundNotifications: checked }))
                         }
                         className="data-[state=checked]:accent-bg data-[state=checked]:border-accent-border"
                       />
                    </div>
                    
                                         {/* Test Notification Button */}
                     <div className="pt-3">
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const { showChatNotification } = await import("@/lib/notifications");
                          await showChatNotification("This is a test notification from Chriki!");
                          toast({
                            title: "Test notification sent",
                            description: "Check if you received the notification",
                          });
                        }}
                        className="accent-border hover:accent-bg hover:text-white text-xs"
                      >
                        Test Notification
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

                        {activeTab === 'personalization' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personalization</h3>
                  
                                     {/* Name Section */}
                  <div className="space-y-3 pb-4">
                    <div>
                      <Label htmlFor="full_name" className="text-sm font-medium">
                        Full Name
                      </Label>
                                             <Input
                        id="full_name"
                        value={localProfile.full_name}
                        onChange={(e) => setLocalProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="mt-1 border-2 border-border focus:accent-border focus:ring-1 focus:ring-accent-border"
                        dir="auto"
                      />
                   </div>
                 </div>

                 {/* Account Info */}
                 <div className="space-y-3">
                   <div>
                     <Label className="text-sm font-medium">Email</Label>
                     <div className="mt-1 text-sm text-muted-foreground">{user?.email}</div>
                   </div>
                   <div>
                     <Label className="text-sm font-medium">User ID</Label>
                     <div className="mt-1 text-xs text-muted-foreground font-mono">{user?.id}</div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'location' && (
             <div className="space-y-4">
               <div>
                 <h3 className="text-lg font-semibold mb-4">Location Services</h3>
                 
                 {/* Current Status */}
                 <div className="space-y-3 pb-4">
                   <div className="p-3 bg-muted/30 rounded-lg border border-border">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label className="text-sm font-medium">Current Status</Label>
                         <div className="text-xs text-muted-foreground mt-1">
                           {hasLocation ? 'Location available' : permission.denied ? 'Location denied' : 'No location set'}
                         </div>
                       </div>
                       <div className={`px-2 py-1 rounded text-xs font-mono ${
                         hasLocation ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                         permission.denied ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                         'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                       }`}>
                         {hasLocation ? 'ACTIVE' : permission.denied ? 'DENIED' : 'INACTIVE'}
                       </div>
                     </div>
                     
                     {hasLocation && location && (
                       <div className="mt-2 text-xs text-muted-foreground font-mono">
                         {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                       </div>
                     )}
                     
                     {locationError && (
                       <div className="mt-2 text-xs text-red-600">
                         {locationError}
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Location Controls */}
                 <div className="space-y-3 pb-4">
                   <Label className="text-sm font-medium">Location Access</Label>
                   <div className="flex gap-2">
                     {!hasLocation && (
                       <Button
                         size="sm"
                         onClick={requestLocation}
                         disabled={locationLoading}
                         className="accent-bg hover:accent-bg text-white"
                       >
                         {locationLoading ? 'Getting Location...' : 'Enable Location'}
                       </Button>
                     )}
                     
                     {hasLocation && (
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={clearLocation}
                         className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                       >
                         Clear Location
                       </Button>
                     )}
                   </div>
                   <p className="text-xs text-muted-foreground">
                     Enable location to get better recommendations for nearby places like hospitals, restaurants, and services.
                   </p>
                 </div>

                 {/* Test Locations */}
                 <div className="space-y-3">
                   <Label className="text-sm font-medium">Test Locations</Label>
                   <LocationTestHelper />
                   <p className="text-xs text-muted-foreground">
                     Use test locations to try out location features without enabling GPS.
                   </p>
                 </div>
               </div>
             </div>
           )}

            {/* Save Button - Fixed at bottom */}
            <div className="sticky bottom-0 pt-4 mt-4 border-t bg-background">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!localProfile.full_name.trim() || isLoading}
                  className="accent-bg hover:accent-bg text-white hover:text-white"
                >
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
