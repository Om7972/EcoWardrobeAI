import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  ShoppingCart, 
  Heart, 
  Filter, 
  Search,
  Plus,
  Eye,
  User,
  Tag,
  Shirt,
  RefreshCw,
  Gift,
  Coins,
  MapPin,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface MarketplaceListing {
  _id: string;
  userId: string;
  clothingItemId: string;
  title: string;
  description: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  category: string;
  size: string;
  brand?: string;
  color?: string;
  material?: string;
  images: string[];
  listingType: "sale" | "swap" | "gift";
  status: "active" | "sold" | "swapped" | "gifted" | "inactive";
  ecoScore: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface SwapRequest {
  _id: string;
  fromUserId: string;
  toUserId: string;
  fromListingId: string;
  toListingId?: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}

export default function ThriftSwap() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"browse" | "myListings" | "requests">("browse");
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [listingForm, setListingForm] = useState({
    clothingItemId: "",
    title: "",
    description: "",
    price: 0,
    condition: "good" as "new" | "like-new" | "good" | "fair" | "poor",
    category: "",
    size: "",
    brand: "",
    color: "",
    material: "",
    images: [] as string[],
    listingType: "sale" as "sale" | "swap" | "gift",
    ecoScore: 0
  });
  
  const [filter, setFilter] = useState({
    category: "",
    size: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    listingType: "",
    search: ""
  });
  
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  useEffect(() => {
    fetchListings();
  }, [filter]);

  useEffect(() => {
    if (user?.userId) {
      fetchMyListings();
      fetchSwapRequests();
    }
  }, [user?.userId, activeTab]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filter.category) queryParams.append("category", filter.category);
      if (filter.size) queryParams.append("size", filter.size);
      if (filter.condition) queryParams.append("condition", filter.condition);
      if (filter.minPrice) queryParams.append("minPrice", filter.minPrice);
      if (filter.maxPrice) queryParams.append("maxPrice", filter.maxPrice);
      if (filter.listingType) queryParams.append("listingType", filter.listingType);
      if (filter.search) queryParams.append("search", filter.search);
      
      const response = await fetch(`/api/marketplace/listings?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch listings");
      
      const data = await response.json();
      setListings(data.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`/api/marketplace/user/${user.userId}/listings`);
      if (!response.ok) throw new Error("Failed to fetch your listings");
      
      const data = await response.json();
      setMyListings(data.data);
    } catch (error) {
      console.error("Error fetching your listings:", error);
      toast.error("Failed to load your listings");
    }
  };

  const fetchSwapRequests = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`/api/marketplace/user/${user.userId}/requests`);
      if (!response.ok) throw new Error("Failed to fetch swap requests");
      
      const data = await response.json();
      setSwapRequests(data.data);
    } catch (error) {
      console.error("Error fetching swap requests:", error);
      toast.error("Failed to load swap requests");
    }
  };

  const handleCreateListing = async () => {
    if (!user?.userId) return;
    
    try {
      setSaving(true);
      const response = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...listingForm,
          userId: user.userId
        })
      });
      
      if (!response.ok) throw new Error("Failed to create listing");
      
      const data = await response.json();
      setMyListings([data.data, ...myListings]);
      setIsListingDialogOpen(false);
      setListingForm({
        clothingItemId: "",
        title: "",
        description: "",
        price: 0,
        condition: "good",
        category: "",
        size: "",
        brand: "",
        color: "",
        material: "",
        images: [],
        listingType: "sale",
        ecoScore: 0
      });
      toast.success("Listing created successfully!");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete listing");
      
      setMyListings(myListings.filter(listing => listing._id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const handleLikeListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/like`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to like listing");
      
      // Update the listing in state
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, likes: listing.likes + 1 } 
          : listing
      ));
      
      toast.success("Liked!");
    } catch (error) {
      console.error("Error liking listing:", error);
      toast.error("Failed to like listing");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/marketplace/requests/${requestId}/accept`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to accept request");
      
      fetchSwapRequests();
      toast.success("Request accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/marketplace/requests/${requestId}/reject`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to reject request");
      
      fetchSwapRequests();
      toast.success("Request rejected!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const filteredListings = listings.filter(listing => {
    // Additional client-side filtering if needed
    return true;
  });

  const conditionLabels = {
    "new": "New",
    "like-new": "Like New",
    "good": "Good",
    "fair": "Fair",
    "poor": "Poor"
  };

  const listingTypeLabels = {
    "sale": "For Sale",
    "swap": "For Swap",
    "gift": "For Gift"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Circular Marketplace
            </h1>
            <p className="text-foreground/70 mt-2">
              Buy, sell, swap, and gift pre-loved items within our community
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "browse" ? "default" : "outline"} 
              onClick={() => setActiveTab("browse")}
              className="transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse
            </Button>
            <Button 
              variant={activeTab === "myListings" ? "default" : "outline"} 
              onClick={() => setActiveTab("myListings")}
              className="transition-all duration-300"
            >
              <Tag className="w-4 h-4 mr-2" />
              My Listings
            </Button>
            <Button 
              variant={activeTab === "requests" ? "default" : "outline"} 
              onClick={() => setActiveTab("requests")}
              className="transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Requests
            </Button>
            <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsListingDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Listing</DialogTitle>
                  <DialogDescription>
                    List an item from your virtual closet to the marketplace
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="title"
                        value={listingForm.title}
                        onChange={(e) => setListingForm({...listingForm, title: e.target.value})}
                        placeholder="e.g., Vintage Denim Jacket"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="description"
                        value={listingForm.description}
                        onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                        placeholder="Describe the item, its condition, and why you're listing it..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={listingForm.category} 
                        onValueChange={(value) => setListingForm({...listingForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="bottoms">Bottoms</SelectItem>
                          <SelectItem value="dresses">Dresses</SelectItem>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="size" className="text-right">
                      Size
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="size"
                        value={listingForm.size}
                        onChange={(e) => setListingForm({...listingForm, size: e.target.value})}
                        placeholder="e.g., M, 10, 38"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right">
                      Condition
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={listingForm.condition} 
                        onValueChange={(value) => setListingForm({...listingForm, condition: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="listingType" className="text-right">
                      Listing Type
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={listingForm.listingType} 
                        onValueChange={(value) => setListingForm({...listingForm, listingType: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="swap">For Swap</SelectItem>
                          <SelectItem value="gift">For Gift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {listingForm.listingType === "sale" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price ($)
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="price"
                          type="number"
                          value={listingForm.price}
                          onChange={(e) => setListingForm({...listingForm, price: parseFloat(e.target.value) || 0})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brand" className="text-right">
                      Brand
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="brand"
                        value={listingForm.brand}
                        onChange={(e) => setListingForm({...listingForm, brand: e.target.value})}
                        placeholder="e.g., Levi's, Zara"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">
                      Color
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="color"
                        value={listingForm.color}
                        onChange={(e) => setListingForm({...listingForm, color: e.target.value})}
                        placeholder="e.g., Blue, Black"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="material" className="text-right">
                      Material
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="material"
                        value={listingForm.material}
                        onChange={(e) => setListingForm({...listingForm, material: e.target.value})}
                        placeholder="e.g., Cotton, Polyester"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsListingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateListing} disabled={saving}>
                    {saving ? "Creating..." : "Create Listing"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Filter Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
                    <Input
                      id="search-listings"
                      placeholder="Search listings..."
                      className="pl-10"
                      value={filter.search}
                      onChange={(e) => setFilter({...filter, search: e.target.value})}
                      aria-label="Search listings"
                    />
                  </div>
                  
                  <Select 
                    value={filter.category} 
                    onValueChange={(value) => setFilter({...filter, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="tops">Tops</SelectItem>
                      <SelectItem value="bottoms">Bottoms</SelectItem>
                      <SelectItem value="dresses">Dresses</SelectItem>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filter.listingType} 
                    onValueChange={(value) => setFilter({...filter, listingType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Listing Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="swap">For Swap</SelectItem>
                      <SelectItem value="gift">For Gift</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Input
                      id="min-price"
                      type="number"
                      placeholder="Min Price"
                      value={filter.minPrice}
                      onChange={(e) => setFilter({...filter, minPrice: e.target.value})}
                      aria-label="Minimum price filter"
                    />
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="Max Price"
                      value={filter.maxPrice}
                      onChange={(e) => setFilter({...filter, maxPrice: e.target.value})}
                      aria-label="Maximum price filter"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Listings */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing._id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{listing.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <User className="w-4 h-4" />
                            <span>User ID: {listing.userId.substring(0, 8)}...</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {listingTypeLabels[listing.listingType]}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/70">Condition</span>
                          <span className="text-sm font-medium">{conditionLabels[listing.condition]}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/70">Size</span>
                          <span className="text-sm font-medium">{listing.size}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/70">Category</span>
                          <span className="text-sm font-medium capitalize">{listing.category}</span>
                        </div>
                        
                        {listing.price > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Price</span>
                            <span className="text-sm font-medium">${listing.price.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {listing.ecoScore > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Eco Score</span>
                            <div className="flex items-center gap-1">
                              <Leaf className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">{listing.ecoScore}/100</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-foreground/70 mt-3 line-clamp-2">
                        {listing.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLikeListing(listing._id)}
                          className="flex items-center gap-1 text-foreground/50 hover:text-destructive transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{listing.likes}</span>
                        </button>
                        <div className="flex items-center gap-1 text-foreground/50">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{listing.views}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Listings Found</h3>
                <p className="text-foreground/70 mb-4">
                  Try adjusting your filters or be the first to create a listing
                </p>
                <Button onClick={() => setIsListingDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </div>
            )}
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === "myListings" && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  My Listings
                </CardTitle>
                <CardDescription>
                  Manage your marketplace listings
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {myListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((listing) => (
                      <Card key={listing._id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{listing.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="capitalize">
                                  {listing.status}
                                </Badge>
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                              {listingTypeLabels[listing.listingType]}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-foreground/70">Condition</span>
                              <span className="text-sm font-medium">{conditionLabels[listing.condition]}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-foreground/70">Size</span>
                              <span className="text-sm font-medium">{listing.size}</span>
                            </div>
                            
                            {listing.price > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-foreground/70">Price</span>
                                <span className="text-sm font-medium">${listing.price.toFixed(2)}</span>
                              </div>
                            )}
                            
                            {listing.ecoScore > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/70">Eco Score</span>
                                <div className="flex items-center gap-1">
                                  <Leaf className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium">{listing.ecoScore}/100</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-foreground/70 mt-3 line-clamp-2">
                            {listing.description}
                          </p>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-foreground/50">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{listing.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-foreground/50">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">{listing.views}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteListing(listing._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tag className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Listings Yet</h3>
                    <p className="text-foreground/70 mb-4">
                      Create your first listing to start participating in the circular marketplace
                    </p>
                    <Button onClick={() => setIsListingDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Swap Requests
                </CardTitle>
                <CardDescription>
                  Manage requests for your items and items you're interested in
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {swapRequests.length > 0 ? (
                  <div className="space-y-4">
                    {swapRequests.map((request) => (
                      <div key={request._id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="capitalize">
                                {request.status}
                              </Badge>
                              <span className="text-sm text-foreground/70">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground/80">
                              {request.message}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleAcceptRequest(request._id)}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleRejectRequest(request._id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === "accepted" && (
                              <Button size="sm" variant="outline">
                                Mark as Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <RefreshCw className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Swap Requests</h3>
                    <p className="text-foreground/70">
                      When someone requests to swap with you, you'll see it here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}