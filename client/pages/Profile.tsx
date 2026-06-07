import { useState, useEffect, useRef } from "react";
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
  Upload,
  Check,
  Award
} from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

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

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [apiCallMade, setApiCallMade] = useState(false);

  const didLoadRef = useRef(false);

  useEffect(() => {
    // Ensure we load profile only once per mount/user
    if (user && !didLoadRef.current) {
      didLoadRef.current = true;
      const loadProfile = async () => {
        // Mark as loaded early to avoid re-entrancy on state updates
        setProfileLoaded(true);
        console.log('🔄 Profile.tsx: Loading profile for user:', user.userId);
        
        // Set initial data from user context
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

        // Fetch full profile from backend if token exists
        const token = localStorage.getItem('token');
        if (token) {
          setApiCallMade(true);
          try {
            console.log('🔄 Profile.tsx: Fetching full profile from server with token');
            const response = await apiClient.get('/protected/profile');
            console.log('✅ Profile.tsx: Profile response received:', response.status, response.data.success);
            
            if (response.data.success && response.data.data) {
              const profileDataFromServer = response.data.data;
              console.log('✅ Profile.tsx: Updating profile with server data:', profileDataFromServer.email);
              
              setProfileData({
                name: profileDataFromServer.name || user.name || "",
                email: profileDataFromServer.email || user.email || "",
                bio: profileDataFromServer.profile?.bio || user.bio || "",
                avatar: profileDataFromServer.profile?.avatar || user.avatar || "",
                phone: profileDataFromServer.profile?.phone || user.phone || "",
                location: profileDataFromServer.profile?.location || user.location || ""
              });
              setAvatarPreview(profileDataFromServer.profile?.avatar || user.avatar || "");
              
              if (profileDataFromServer.profile?.preferences) {
                setPreferences(profileDataFromServer.profile.preferences);
              }
              if (profileDataFromServer.preferences) {
                setPreferences(prev => ({ ...prev, ...profileDataFromServer.preferences }));
              }
              if (profileDataFromServer.notifications) {
                setNotifications(profileDataFromServer.notifications);
              }
              
              // Update user in context
              updateUser({
                ...user,
                ...profileDataFromServer,
                bio: profileDataFromServer.profile?.bio || profileDataFromServer.bio,
                avatar: profileDataFromServer.profile?.avatar || profileDataFromServer.avatar,
                phone: profileDataFromServer.profile?.phone || profileDataFromServer.phone,
                location: profileDataFromServer.profile?.location || profileDataFromServer.location,
                preferences: profileDataFromServer.preferences,
                notifications: profileDataFromServer.notifications,
              });
              
              console.log('✅ Profile.tsx: Profile updated successfully');
              toast.success('Profile loaded successfully');
            }
          } catch (error: any) {
            console.error('❌ Profile.tsx: Failed to load profile from server:', error.response?.status, error.message);
            // Continue with local user data if API fails - this is expected in fallback/demo mode
            console.log('⚠️ Profile.tsx: Will use cached profile data from localStorage');
            toast.info("Using fallback profile data - database may be unavailable");
          }
        } else {
          console.log('⚠️ Profile.tsx: No token found, using initial profile data');
          toast.info("Complete your profile below");
        }
        
        console.log('✅ Profile.tsx: Profile loading completed');
      };
      
      loadProfile();
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
      const response = await apiClient.put("/protected/profile", {
        ...profileData,
        preferences,
        notifications
      });
      
      const updated = response.data.user;
      // Update context user
      updateUser(updated);
      // Update local state to match server response
      setProfileData({
        name: updated.name || "",
        email: updated.email || "",
        bio: updated.bio ?? updated.profile?.bio ?? "",
        avatar: updated.avatar ?? updated.profile?.avatar ?? "",
        phone: updated.phone ?? updated.profile?.phone ?? "",
        location: updated.location ?? updated.profile?.location ?? "",
      });
      setAvatarPreview(updated.avatar ?? updated.profile?.avatar ?? "");
      if (updated.preferences) {
        setPreferences(updated.preferences);
      }
      if (updated.notifications) {
        setNotifications(updated.notifications);
      }
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planName: string, amount: number) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sy3EZlSO0Xnxqc",
      amount: amount * 100, // paise
      currency: import.meta.env.VITE_RAZORPAY_CURRENCY || "INR",
      name: "EcoWardrobe AI Membership",
      description: `Upgrade to EcoWardrobe ${planName} Plan`,
      image: "/EcoWardrobe_png.svg",
      handler: function (response: any) {
        toast.success(`Welcome to EcoWardrobe ${planName}! Payment successful. Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: profileData.name || user?.name || "John Doe",
        email: profileData.email || user?.email || "john@gmail.com",
        contact: profileData.phone || "9999999999"
      },
      theme: {
        color: "#10B981"
      }
    };
    
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
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

  // Show loading state with diagnostic info
  if (!profileLoaded) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Profile...</CardTitle>
              <CardDescription>Initializing your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <p>Loading your data...</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>User: {user?.email}</p>
                <p>API Call Made: {apiCallMade ? 'Yes' : 'No'}</p>
                <p>Token Present: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-foreground/70">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="membership">
                <Award className="h-4 w-4 mr-2" />
                Membership
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
                      <label htmlFor="avatar-upload" title="Upload profile picture" className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                        <span className="sr-only">Upload profile picture</span>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          aria-label="Upload profile picture"
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
                      <Label id="topSizeLabel" htmlFor="topSize">Top Size</Label>
                      <Select value={preferences.topSize} onValueChange={(value) => setPreferences(prev => ({ ...prev, topSize: value }))}>
                        <SelectTrigger id="topSize" aria-labelledby="topSizeLabel">
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
                      <Label id="bottomSizeLabel" htmlFor="bottomSize">Bottom Size</Label>
                      <Select value={preferences.bottomSize} onValueChange={(value) => setPreferences(prev => ({ ...prev, bottomSize: value }))}>
                        <SelectTrigger id="bottomSize" aria-labelledby="bottomSizeLabel">
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
                      <Label htmlFor="shoeSize">Shoe Size</Label>
                      <Input
                        id="shoeSize"
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
                      <h4 id="label-emailNotifications" className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      aria-labelledby="label-emailNotifications"
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 id="label-outfitSuggestions" className="font-medium">Outfit Suggestions</h4>
                      <p className="text-sm text-muted-foreground">Daily AI-powered outfit recommendations</p>
                    </div>
                    <Switch
                      id="outfitSuggestions"
                      checked={notifications.outfitSuggestions}
                      aria-labelledby="label-outfitSuggestions"
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, outfitSuggestions: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 id="label-communityUpdates" className="font-medium">Community Updates</h4>
                      <p className="text-sm text-muted-foreground">New posts and events from your circles</p>
                    </div>
                    <Switch
                      id="communityUpdates"
                      checked={notifications.communityUpdates}
                      aria-labelledby="label-communityUpdates"
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, communityUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 id="label-sustainabilityTips" className="font-medium">Sustainability Tips</h4>
                      <p className="text-sm text-muted-foreground">Weekly eco-friendly fashion advice</p>
                    </div>
                    <Switch
                      id="sustainabilityTips"
                      checked={notifications.sustainabilityTips}
                      aria-labelledby="label-sustainabilityTips"
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sustainabilityTips: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 id="label-marketplaceAlerts" className="font-medium">Marketplace Alerts</h4>
                      <p className="text-sm text-muted-foreground">New items matching your preferences</p>
                    </div>
                    <Switch
                      id="marketplaceAlerts"
                      checked={notifications.marketplaceAlerts}
                      aria-labelledby="label-marketplaceAlerts"
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

            {/* Membership Tab */}
            <TabsContent value="membership">
              <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
                <Card className="border border-primary/20 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-semibold">
                    POPULAR
                  </div>
                  <div>
                    <CardHeader>
                      <CardTitle className="text-xl">EcoWardrobe Pro</CardTitle>
                      <CardDescription>Advanced sustainable lifestyle features for individuals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">₹{import.meta.env.VITE_RAZORPAY_AMOUNT_PRO || "1599"}</span>
                        <span className="text-sm text-muted-foreground">/ year</span>
                      </div>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Unlimited AI outfit generations
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Deep fabric scanning & recyclability analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Advanced styling circles & private chat channels
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Climate impact reports & exportable PDF certificates
                        </li>
                      </ul>
                    </CardContent>
                  </div>
                  <CardFooter className="pt-4 border-t border-border/20 p-6">
                    <Button 
                      className="w-full"
                      onClick={() => handleUpgrade("PRO", Number(import.meta.env.VITE_RAZORPAY_AMOUNT_PRO || "1599"))}
                    >
                      Upgrade to Pro
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-border/60 flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle className="text-xl">EcoWardrobe Team & Family</CardTitle>
                      <CardDescription>Collaborative zero-waste matching for up to 5 profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">₹{import.meta.env.VITE_RAZORPAY_AMOUNT_TEAM || "3999"}</span>
                        <span className="text-sm text-muted-foreground">/ year</span>
                      </div>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Everything in Pro for up to 5 family members
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Shared sustainable family feed & closet swaps
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Team challenges & monthly progress goals
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Zero-waste matching & swap priority alerts
                        </li>
                      </ul>
                    </CardContent>
                  </div>
                  <CardFooter className="pt-4 border-t border-border/20 p-6">
                    <Button 
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleUpgrade("TEAM", Number(import.meta.env.VITE_RAZORPAY_AMOUNT_TEAM || "3999"))}
                    >
                      Upgrade to Team & Family
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
