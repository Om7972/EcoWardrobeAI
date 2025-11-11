import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Bell, 
  Lock, 
  Leaf,
  Shirt,
  Settings,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    phone: "",
    location: ""
  });

  const [preferences, setPreferences] = useState({
    topSize: "",
    bottomSize: "",
    shoeSize: "",
    preferredMaterials: [] as string[],
    avoidMaterials: [] as string[],
    favoriteColors: [] as string[],
    stylePreferences: [] as string[],
    sustainabilityGoals: [] as string[]
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    outfitSuggestions: true,
    communityUpdates: true,
    sustainabilityTips: true,
    marketplaceAlerts: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        location: user.location || ""
      });
      setAvatarPreview(user.avatar || "");
      
      if (user.preferences) {
        setPreferences(user.preferences);
      }
      if (user.notifications) {
        setNotifications(user.notifications);
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setProfileData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/api/protected/profile", {
        ...profileData,
        preferences,
        notifications
      });
      
      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const materialOptions = [
    "Organic Cotton", "Recycled Polyester", "Hemp", "Linen", 
    "Tencel", "Bamboo", "Wool", "Silk", "Recycled Cotton"
  ];

  const styleOptions = [
    "Minimalist", "Casual", "Formal", "Streetwear", 
    "Vintage", "Bohemian", "Athletic", "Classic"
  ];

  const sustainabilityGoals = [
    "Reduce new purchases", "Buy only secondhand", "Support ethical brands",
    "Minimize waste", "Extend garment life", "Choose natural fibers"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-foreground/70">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Shirt className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 5MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clothing Sizes</CardTitle>
                    <CardDescription>Help us provide better recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Top Size</Label>
                      <Select value={preferences.topSize} onValueChange={(value) => setPreferences(prev => ({ ...prev, topSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Bottom Size</Label>
                      <Select value={preferences.bottomSize} onValueChange={(value) => setPreferences(prev => ({ ...prev, bottomSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["26", "28", "30", "32", "34", "36", "38", "40"].map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shoe Size</Label>
                      <Input
                        value={preferences.shoeSize}
                        onChange={(e) => setPreferences(prev => ({ ...prev, shoeSize: e.target.value }))}
                        placeholder="US 9"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Leaf className="inline w-5 h-5 mr-2 text-primary" />
                      Sustainability Preferences
                    </CardTitle>
                    <CardDescription>Choose your eco-friendly priorities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Materials</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {materialOptions.map(material => (
                          <label key={material} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.preferredMaterials.includes(material)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPreferences(prev => ({
                                    ...prev,
                                    preferredMaterials: [...prev.preferredMaterials, material]
                                  }));
                                } else {
                                  setPreferences(prev => ({
                                    ...prev,
                                    preferredMaterials: prev.preferredMaterials.filter(m => m !== material)
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{material}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Style Preferences</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {styleOptions.map(style => (
                          <label key={style} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.stylePreferences.includes(style)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPreferences(prev => ({
                                    ...prev,
                                    stylePreferences: [...prev.stylePreferences, style]
                                  }));
                                } else {
                                  setPreferences(prev => ({
                                    ...prev,
                                    stylePreferences: prev.stylePreferences.filter(s => s !== style)
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{style}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Sustainability Goals</Label>
                      <div className="space-y-2">
                        {sustainabilityGoals.map(goal => (
                          <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.sustainabilityGoals.includes(goal)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPreferences(prev => ({
                                    ...prev,
                                    sustainabilityGoals: [...prev.sustainabilityGoals, goal]
                                  }));
                                } else {
                                  setPreferences(prev => ({
                                    ...prev,
                                    sustainabilityGoals: prev.sustainabilityGoals.filter(g => g !== goal)
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{goal}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Outfit Suggestions</h4>
                      <p className="text-sm text-muted-foreground">Daily AI-powered outfit recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.outfitSuggestions}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, outfitSuggestions: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Community Updates</h4>
                      <p className="text-sm text-muted-foreground">New posts and events from your circles</p>
                    </div>
                    <Switch
                      checked={notifications.communityUpdates}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, communityUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sustainability Tips</h4>
                      <p className="text-sm text-muted-foreground">Weekly eco-friendly fashion advice</p>
                    </div>
                    <Switch
                      checked={notifications.sustainabilityTips}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sustainabilityTips: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketplace Alerts</h4>
                      <p className="text-sm text-muted-foreground">New items matching your preferences</p>
                    </div>
                    <Switch
                      checked={notifications.marketplaceAlerts}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketplaceAlerts: checked }))}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
