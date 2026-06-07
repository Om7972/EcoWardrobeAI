import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Leaf, 
  Heart, 
  Filter,
  Search,
  Star,
  Package,
  Shirt,
  ArrowLeft,
  Plus,
  RefreshCw,
  User,
  Tag,
  DollarSign,
  Info,
  Scale
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for peer-to-peer circular fashion listings
const initialListings = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    description: "Classic oversize denim jacket with custom hand-embroidered floral patterns on the back. Made from 100% recycled cotton.",
    price: 45.00,
    type: "Swap or Sell",
    condition: "Upcycled",
    category: "Outerwear",
    owner: "Sarah J.",
    avatar: "SJ",
    ecoBadges: ["Circular", "Handmade", "Water Saved: 2,500L"],
    rating: 4.9,
    size: "M",
    inStock: true
  },
  {
    id: 2,
    name: "Recycled Polyester Fleece",
    description: "Ultra-warm winter pullover. Minor pilling at elbows but fleece is extremely plush and clean.",
    price: 35.00,
    type: "Sell Only",
    condition: "Good",
    category: "Outerwear",
    owner: "David K.",
    avatar: "DK",
    ecoBadges: ["Recycled", "Durable", "CO2 Prevented: 8kg"],
    rating: 4.6,
    size: "L",
    inStock: true
  },
  {
    id: 3,
    name: "Zero-Waste Linen Sundress",
    description: "Beautiful loose-fitting sundress made using a zero-waste pattern with premium organic flax linen.",
    price: 60.00,
    type: "Swap Only",
    condition: "Excellent",
    category: "Dresses",
    owner: "Elena R.",
    avatar: "ER",
    ecoBadges: ["Zero Waste", "Biodegradable", "Organic"],
    rating: 5.0,
    size: "S",
    inStock: true
  },
  {
    id: 4,
    name: "Vegan Leather Chelsea Boots",
    description: "Water-resistant vegan boots. Only worn twice, tiny scratch on left heel otherwise pristine condition.",
    price: 85.00,
    type: "Swap or Sell",
    condition: "Excellent",
    category: "Shoes",
    owner: "Alex M.",
    avatar: "AM",
    ecoBadges: ["Vegan", "Circular", "PETA Approved"],
    rating: 4.8,
    size: "US 9",
    inStock: true
  },
  {
    id: 5,
    name: "Upcycled Patchwork Tote Bag",
    description: "Sturdy daily tote crafted from denim scraps and vintage cotton lining. Fully reversible.",
    price: 20.00,
    type: "Swap Only",
    condition: "Upcycled",
    category: "Accessories",
    owner: "Lila P.",
    avatar: "LP",
    ecoBadges: ["100% Upcycled", "Zero Waste", "Handmade"],
    rating: 4.7,
    size: "One Size",
    inStock: true
  }
];

const categories = [
  { id: "all", name: "All Categories", icon: Package },
  { id: "outerwear", name: "Outerwear", icon: Shirt },
  { id: "dresses", name: "Dresses", icon: Shirt },
  { id: "shoes", name: "Shoes", icon: Shirt },
  { id: "accessories", name: "Accessories", icon: Shirt },
  { id: "tops", name: "Tops", icon: Shirt },
  { id: "bottoms", name: "Bottoms", icon: Shirt }
];

export default function EcoMarketplace() {
  const { toast } = useToast();
  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Form states for new listing
  const [newListingName, setNewListingName] = useState("");
  const [newListingDesc, setNewListingDesc] = useState("");
  const [newListingPrice, setNewListingPrice] = useState("");
  const [newListingSize, setNewListingSize] = useState("");
  const [newListingCategory, setNewListingCategory] = useState("Tops");
  const [newListingCondition, setNewListingCondition] = useState("Excellent");
  const [newListingType, setNewListingType] = useState("Swap or Sell");

  // Form states for swap proposal
  const [swapItemTitle, setSwapItemTitle] = useState("");
  const [swapItemDesc, setSwapItemDesc] = useState("");

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingName || !newListingDesc || !newListingSize || !newListingPrice) {
      toast({
        title: "Missing Fields",
        description: "Please complete all fields to submit your listing.",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseFloat(newListingPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    const newListing = {
      id: listings.length + 1,
      name: newListingName,
      description: newListingDesc,
      price: priceNum,
      type: newListingType,
      condition: newListingCondition,
      category: newListingCategory,
      owner: "You (John Doe)",
      avatar: "JD",
      ecoBadges: ["Circular", "P2P Listed", "Zero Waste Choice"],
      rating: 5.0,
      size: newListingSize,
      inStock: true
    };

    setListings([newListing, ...listings]);
    setShowCreateListing(false);

    // Reset Form
    setNewListingName("");
    setNewListingDesc("");
    setNewListingPrice("");
    setNewListingSize("");

    toast({
      title: "Listing Published!",
      description: "Your P2P clothing item is now visible in the marketplace.",
    });
  };

  const handleSwapProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapItemTitle.trim()) {
      toast({
        title: "Describe your swap item",
        description: "Please enter a title/description of what you're offering.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Swap Request Sent!",
      description: `Your offer to swap "${swapItemTitle}" for "${selectedListing?.name}" has been sent to ${selectedListing?.owner}.`,
    });

    setShowSwapModal(false);
    setSwapItemTitle("");
    setSwapItemDesc("");
  };

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed."
      });
    } else {
      setWishlist([...wishlist, id]);
      toast({
        title: "Added to Wishlist",
        description: "Item added to your saves."
      });
    }
  };

  const handleBuyNow = (listing: any) => {
    toast({
      title: "Purchase Successful!",
      description: `You purchased "${listing.name}" from ${listing.owner} for $${listing.price.toFixed(2)}. Details sent to email.`,
    });
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesCondition = selectedCondition === "all" || item.condition.toLowerCase() === selectedCondition.toLowerCase();
    const matchesType = selectedType === "all" || 
      (selectedType === "swap" && item.type.toLowerCase().includes("swap")) ||
      (selectedType === "sell" && item.type.toLowerCase().includes("sell"));

    return matchesSearch && matchesCategory && matchesCondition && matchesType;
  });

  return (
    <Layout>
      {/* Back to Dashboard bar */}
      <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Scale className="w-3.5 h-3.5" />
                P2P Circular Wardrobe Swap
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Leaf className="w-8 h-8 text-primary" />
                Eco P2P Marketplace
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Swap, buy, or gift pre-loved fashion directly within the community. Extend the lifecycle of clothes and eliminate waste!
              </p>
            </div>
            <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  List a Clothing Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>List Pre-loved Clothing</DialogTitle>
                  <DialogDescription>
                    Fill in details about the garment you wish to swap or sell to others.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateListing} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="item-name">Garment Name</Label>
                    <Input 
                      id="item-name" 
                      placeholder="e.g. Linen Blouse, Denim Shorts"
                      value={newListingName}
                      onChange={e => setNewListingName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-desc">Description & Condition Details</Label>
                    <Textarea 
                      id="item-desc" 
                      placeholder="Mention fabric, brand, fit, and any minor wear..."
                      value={newListingDesc}
                      onChange={e => setNewListingDesc(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="item-size">Size</Label>
                      <Input 
                        id="item-size" 
                        placeholder="e.g. M, 32, S"
                        value={newListingSize}
                        onChange={e => setNewListingSize(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="item-price">Value / Price ($)</Label>
                      <Input 
                        id="item-price" 
                        type="number"
                        placeholder="40"
                        value={newListingPrice}
                        onChange={e => setNewListingPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="item-category">Category</Label>
                      <Select value={newListingCategory} onValueChange={setNewListingCategory}>
                        <SelectTrigger id="item-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tops">Tops</SelectItem>
                          <SelectItem value="Bottoms">Bottoms</SelectItem>
                          <SelectItem value="Outerwear">Outerwear</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Shoes">Shoes</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="item-condition">Condition</Label>
                      <Select value={newListingCondition} onValueChange={setNewListingCondition}>
                        <SelectTrigger id="item-condition">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Upcycled">Upcycled / Modified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-type">Available For</Label>
                    <Select value={newListingType} onValueChange={setNewListingType}>
                      <SelectTrigger id="item-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Swap or Sell">Swap or Sell</SelectItem>
                        <SelectItem value="Swap Only">Swap Only</SelectItem>
                        <SelectItem value="Sell Only">Sell Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateListing(false)}>Cancel</Button>
                    <Button type="submit">Publish Listing</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filters */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
              <Card className="border border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5 text-primary" />
                    Refine Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search-input">Search Wardrobes</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-input"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 text-sm"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condition Filter */}
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="upcycled">Upcycled / Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swap/Sell Filter */}
                  <div className="space-y-2">
                    <Label>Swap/Sell Mode</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Offer Type</SelectItem>
                        <SelectItem value="swap">Swaps Welcomed</SelectItem>
                        <SelectItem value="sell">Direct Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* List of items */}
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Pre-loved Wardrobes ({filteredListings.length})
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>P2P Trading Hub</span>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Package className="w-12 h-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold">No pre-loved items match</h3>
                    <p className="text-sm text-muted-foreground">Try loosening your search filters.</p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedCondition("all");
                      setSelectedType("all");
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    <Card key={listing.id} className="hover:shadow-md transition-all flex flex-col justify-between border border-border/40">
                      <div>
                        {/* Upper image mock */}
                        <div className="bg-primary/5 h-48 rounded-t-lg flex items-center justify-center relative">
                          <Shirt className="w-16 h-16 text-primary/30" />
                          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground hover:bg-secondary">
                            Condition: {listing.condition}
                          </Badge>
                          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                            {listing.size}
                          </Badge>
                        </div>
                        
                        <CardHeader className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {listing.owner}
                            </span>
                            <span className="text-lg font-bold text-foreground">
                              ${listing.price.toFixed(2)}
                            </span>
                          </div>
                          <CardTitle className="text-lg font-semibold">{listing.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{listing.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 pb-4">
                          <div className="flex flex-wrap gap-1.5">
                            {listing.ecoBadges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="text-[10px] py-0 border-primary/20 text-primary">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Tag className="w-3.5 h-3.5 text-primary" />
                            <span>Listed for: <strong className="text-foreground">{listing.type}</strong></span>
                          </div>
                        </CardContent>
                      </div>

                      <CardFooter className="pt-2 border-t border-border/20 flex gap-2">
                        {listing.type !== "Sell Only" && (
                          <Button 
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center justify-center gap-1.5"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowSwapModal(true);
                            }}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Swap Item
                          </Button>
                        )}
                        {listing.type !== "Swap Only" && (
                          <Button 
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleBuyNow(listing)}
                          >
                            Buy Pre-loved
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Swap Modal */}
      <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Propose Wardrobe Swap
            </DialogTitle>
            <DialogDescription>
              Propose a clothing swap with <strong>{selectedListing?.owner}</strong> for their <strong>{selectedListing?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSwapProposal} className="space-y-4 pt-2">
            <div className="p-3 bg-primary/5 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-primary">Target Garment Specs:</p>
              <p>Condition: {selectedListing?.condition} | Size: {selectedListing?.size} | Estimated Value: ${selectedListing?.price.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="swap-title">What item from your wardrobe are you offering?</Label>
              <Input 
                id="swap-title" 
                placeholder="e.g. Cotton Corduroy Shirt (excellent condition)"
                value={swapItemTitle}
                onChange={e => setSwapItemTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="swap-desc">Offer details / message (optional)</Label>
              <Textarea 
                id="swap-desc" 
                placeholder="e.g. Size M, light green. Worn once, matches your jeans perfectly!"
                value={swapItemDesc}
                onChange={e => setSwapItemDesc(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowSwapModal(false)}>Cancel</Button>
              <Button type="submit">Send Swap Proposal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}