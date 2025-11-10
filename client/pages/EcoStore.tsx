import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Leaf, 
  Heart, 
  ShoppingCart, 
  Filter,
  Search,
  Star,
  Package,
  Shirt,
  Home,
  Utensils,
  Zap,
  Car,
  Droplets,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  X,
  Check,
  Recycle,
  Award,
  Globe,
  MapPin,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Share2,
  Bell,
  Gift,
  Truck,
  Shield
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for eco-friendly products
const mockProducts = [
  {
    id: 1,
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton, fair trade certified",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "Clothing",
    impactScore: 95,
    carbonOffset: 2.5,
    image: "/placeholder-tshirt.jpg",
    ecoBadges: ["Organic", "Fair Trade", "Carbon Neutral"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ["biodegradable", "local", "fair-trade"],
    sustainabilityDetails: {
      waterSaved: "200L",
      co2Reduced: "2.5kg",
      materials: "100% Organic Cotton",
      certifications: ["GOTS", "Fair Trade"]
    }
  },
  {
    id: 2,
    name: "Bamboo Toothbrush Set",
    description: "Biodegradable bamboo with charcoal bristles",
    price: 12.99,
    originalPrice: 15.99,
    discount: 19,
    category: "Personal Care",
    impactScore: 92,
    carbonOffset: 0.8,
    image: "/placeholder-toothbrush.jpg",
    ecoBadges: ["Biodegradable", "Plastic Free", "Vegan"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["biodegradable", "recycled", "local"],
    sustainabilityDetails: {
      waterSaved: "50L",
      co2Reduced: "0.8kg",
      materials: "Bamboo, Charcoal",
      certifications: ["Plastic Free", "Vegan"]
    }
  },
  {
    id: 3,
    name: "Reusable Water Bottle",
    description: "Stainless steel, keeps drinks cold for 24 hours",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    category: "Home",
    impactScore: 88,
    carbonOffset: 1.2,
    image: "/placeholder-bottle.jpg",
    ecoBadges: ["Reusable", "BPA Free", "Durable"],
    rating: 4.9,
    reviews: 210,
    inStock: true,
    tags: ["recycled", "local", "durable"],
    sustainabilityDetails: {
      waterSaved: "150L/year",
      co2Reduced: "1.2kg",
      materials: "Stainless Steel",
      certifications: ["BPA Free", "Durable"]
    }
  },
  {
    id: 4,
    name: "Solar Charger",
    description: "Portable solar panel for charging devices",
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    category: "Electronics",
    impactScore: 90,
    carbonOffset: 5.0,
    image: "/placeholder-charger.jpg",
    ecoBadges: ["Renewable Energy", "Portable", "Durable"],
    rating: 4.7,
    reviews: 156,
    inStock: false,
    tags: ["renewable", "local", "durable"],
    sustainabilityDetails: {
      waterSaved: "0L",
      co2Reduced: "5.0kg",
      materials: "Silicon, Plastic",
      certifications: ["Renewable Energy", "CE Certified"]
    }
  },
  {
    id: 5,
    name: "Compostable Phone Case",
    description: "Made from plant-based materials",
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    category: "Electronics",
    impactScore: 85,
    carbonOffset: 1.8,
    image: "/placeholder-case.jpg",
    ecoBadges: ["Compostable", "Biodegradable", "Plant-based"],
    rating: 4.5,
    reviews: 92,
    inStock: true,
    tags: ["biodegradable", "recycled", "plant-based"],
    sustainabilityDetails: {
      waterSaved: "30L",
      co2Reduced: "1.8kg",
      materials: "Plant-based PLA",
      certifications: ["Compostable", "Biodegradable"]
    }
  },
  {
    id: 6,
    name: "Beeswax Food Wraps",
    description: "Reusable alternative to plastic wrap",
    price: 16.99,
    originalPrice: 21.99,
    discount: 23,
    category: "Home",
    impactScore: 87,
    carbonOffset: 0.5,
    image: "/placeholder-wraps.jpg",
    ecoBadges: ["Reusable", "Plastic Free", "Natural"],
    rating: 4.4,
    reviews: 78,
    inStock: true,
    tags: ["biodegradable", "local", "natural"],
    sustainabilityDetails: {
      waterSaved: "100L/year",
      co2Reduced: "0.5kg",
      materials: "Cotton, Beeswax, Jojoba Oil",
      certifications: ["Plastic Free", "Natural"]
    }
  },
  {
    id: 7,
    name: "Recycled Backpack",
    description: "Made from 100% recycled plastic bottles",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    category: "Accessories",
    impactScore: 93,
    carbonOffset: 3.2,
    image: "/placeholder-backpack.jpg",
    ecoBadges: ["Recycled", "Durable", "Water Resistant"],
    rating: 4.8,
    reviews: 142,
    inStock: true,
    tags: ["recycled", "durable", "local"],
    sustainabilityDetails: {
      waterSaved: "300L",
      co2Reduced: "3.2kg",
      materials: "Recycled PET, Water-resistant coating",
      certifications: ["Recycled", "Durable"]
    }
  },
  {
    id: 8,
    name: "Bamboo Cutlery Set",
    description: "Travel-friendly reusable cutlery made from sustainable bamboo",
    price: 14.99,
    originalPrice: 19.99,
    discount: 25,
    category: "Kitchen",
    impactScore: 89,
    carbonOffset: 0.7,
    image: "/placeholder-cutlery.jpg",
    ecoBadges: ["Biodegradable", "Travel", "Eco-Friendly"],
    rating: 4.6,
    reviews: 95,
    inStock: true,
    tags: ["biodegradable", "travel", "local"],
    sustainabilityDetails: {
      waterSaved: "75L",
      co2Reduced: "0.7kg",
      materials: "Bamboo",
      certifications: ["Biodegradable", "Travel"]
    }
  }
];

// Mock categories
const categories = [
  { id: "all", name: "All Categories", icon: Package },
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "home", name: "Home", icon: Home },
  { id: "personal-care", name: "Personal Care", icon: Droplets },
  { id: "electronics", name: "Electronics", icon: Zap },
  { id: "kitchen", name: "Kitchen", icon: Utensils },
  { id: "accessories", name: "Accessories", icon: Package },
  { id: "transport", name: "Transport", icon: Car }
];

// Mock eco bundles
const ecoBundles = [
  {
    id: 1,
    name: "Zero Waste Starter Kit",
    description: "Everything you need to start your zero waste journey",
    products: [2, 3, 6],
    originalPrice: 59.97,
    bundlePrice: 44.97,
    discount: 25,
    impactScore: 94,
    carbonOffset: 3.0
  },
  {
    id: 2,
    name: "Eco Kitchen Essentials",
    description: "Sustainable alternatives for your kitchen",
    products: [6, 8],
    originalPrice: 36.98,
    bundlePrice: 27.98,
    discount: 24,
    impactScore: 91,
    carbonOffset: 1.2
  }
];

// Mock data for impact metrics
const impactData = [
  { name: 'Carbon', value: 45, color: '#10B981' },
  { name: 'Water', value: 30, color: '#3B82F6' },
  { name: 'Waste', value: 25, color: '#F59E0B' }
];

// Mock sustainability tips
const sustainabilityTips = [
  {
    id: 1,
    title: "Extend Product Lifespan",
    description: "Proper care can extend the life of your products by up to 3x",
    icon: "♻️"
  },
  {
    id: 2,
    title: "Recycle Packaging",
    description: "All our packaging is 100% recyclable. Check local guidelines",
    icon: "📦"
  },
  {
    id: 3,
    title: "Carbon Offset Program",
    description: "Every purchase automatically offsets carbon emissions",
    icon: "🌍"
  }
];

export default function EcoStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [impactScore, setImpactScore] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [compareProducts, setCompareProducts] = useState<number[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [donateToGreenCauses, setDonateToGreenCauses] = useState(true);
  const [donationAmount, setDonationAmount] = useState(5);
  const [showSustainabilityDetails, setShowSustainabilityDetails] = useState(false);

  // Filter products based on search, category, price, impact score, and tags
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesImpact = product.impactScore >= impactScore;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesPrice && matchesImpact && matchesTags;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "impact") return b.impactScore - a.impactScore;
    return a.id - b.id; // Default sort by ID
  });

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const addToCart = (productId: number) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { id: productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    ));
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleProductComparison = (productId: number) => {
    if (compareProducts.includes(productId)) {
      setCompareProducts(compareProducts.filter(id => id !== productId));
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, productId]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getSelectedProductsForComparison = () => {
    return mockProducts.filter(product => compareProducts.includes(product.id));
  };

  const getCartCarbonFootprint = () => {
    return cart.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.id);
      return total + (product ? product.carbonOffset * item.quantity : 0);
    }, 0);
  };

  // Get unique tags from all products
  const allTags = Array.from(new Set(mockProducts.flatMap(product => product.tags)));

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              Eco Store
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Discover sustainable products that align with your values. Every purchase makes a positive impact.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Filters</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Categories</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => {
                          const IconComponent = category.icon;
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {category.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-foreground/70">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Impact Score */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Minimum Impact Score: {impactScore}%
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={100}
                        value={[impactScore]}
                        onValueChange={(value) => setImpactScore(value[0])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-foreground/70">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sustainability Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="impact">Highest Impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products and Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Sustainability Tips Banner */}
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Leaf className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sustainability Tips</p>
                        <p className="text-sm text-foreground/70">
                          Make your purchases even more impactful
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {sustainabilityTips.map(tip => (
                        <div key={tip.id} className="flex items-center gap-1 text-sm bg-background/50 px-2 py-1 rounded">
                          <span>{tip.icon}</span>
                          <span>{tip.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <Card className="mb-6 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="font-medium">{getCartItemsCount()} items in cart</p>
                        <p className="text-sm text-foreground/70">
                          Carbon footprint: {getCartCarbonFootprint().toFixed(1)}kg saved
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                        <Button size="sm" onClick={() => setShowCheckout(true)}>
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Eco Bundles */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  Eco Bundles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ecoBundles.map(bundle => (
                    <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{bundle.name}</span>
                          <Badge variant="secondary">{bundle.discount}% OFF</Badge>
                        </CardTitle>
                        <CardDescription>{bundle.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{bundle.impactScore}/100 impact score</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="text-sm">{bundle.carbonOffset}kg saved</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-lg">${bundle.bundlePrice.toFixed(2)}</span>
                            <span className="text-sm text-foreground/50 line-through ml-2">
                              ${bundle.originalPrice.toFixed(2)}
                            </span>
                          </div>
                          <Button size="sm" onClick={() => {
                            bundle.products.forEach(productId => addToCart(productId));
                          }}>
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-foreground/70">
                  Showing {sortedProducts.length} of {mockProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Compare:</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={compareProducts.length < 2}
                    onClick={() => setShowComparison(true)}
                  >
                    {compareProducts.length} Selected
                  </Button>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                  <p className="text-foreground/70 mb-4">Try adjusting your filters</p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, 100]);
                    setImpactScore(0);
                    setSelectedTags([]);
                  }}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow group">
                      <div className="relative">
                        <div className="bg-muted aspect-square rounded-t-lg flex items-center justify-center">
                          <span className="text-4xl">🛍️</span>
                        </div>
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-destructive">
                            {product.discount}% OFF
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 left-2"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              wishlist.includes(product.id) 
                                ? "fill-primary text-primary" 
                                : "text-foreground"
                            }`} 
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <div className="text-right">
                            <p className="font-bold text-lg">${product.price}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-sm text-foreground/50 line-through">
                                ${product.originalPrice}
                              </p>
                            )}
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-2 flex-1">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-foreground/20"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-foreground/70 ml-1">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              {product.impactScore}% impact score
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="text-sm">
                              {product.carbonOffset}kg saved
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.ecoBadges.slice(0, 3).map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {product.ecoBadges.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.ecoBadges.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => toggleProductComparison(product.id)}
                          >
                            {compareProducts.includes(product.id) ? (
                              <>
                                <Check className="w-4 h-4 mr-1" /> Selected
                              </>
                            ) : (
                              "Compare"
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            disabled={!product.inStock}
                            onClick={() => addToCart(product.id)}
                          >
                            {!product.inStock ? "Out of Stock" : "Add to Cart"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.description}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-6xl">🛍️</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-2xl font-bold">${selectedProduct.price}</p>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <p className="text-sm text-foreground/50 line-through">
                          ${selectedProduct.originalPrice}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">{selectedProduct.discount}% OFF</Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedProduct.rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-foreground/20"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-foreground/70 ml-1">
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Leaf className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Impact Score</p>
                        <p className="font-bold">{selectedProduct.impactScore}/100</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Carbon Saved</p>
                        <p className="font-bold">{selectedProduct.carbonOffset}kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Eco Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.ecoBadges.map((badge: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sustainability Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      disabled={!selectedProduct.inStock}
                      onClick={() => {
                        addToCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                    >
                      {!selectedProduct.inStock ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          wishlist.includes(selectedProduct.id) 
                            ? "fill-primary text-primary" 
                            : ""
                        }`} 
                      />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowSustainabilityDetails(true)}
                    >
                      <Leaf className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Sustainability Details Modal */}
              <Dialog open={showSustainabilityDetails} onOpenChange={setShowSustainabilityDetails}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sustainability Details</DialogTitle>
                    <DialogDescription>
                      Learn more about the environmental impact of this product
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <Droplets className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Water Saved</p>
                        <p className="text-foreground/70">{selectedProduct.sustainabilityDetails?.waterSaved}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Globe className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">CO2 Reduced</p>
                        <p className="text-foreground/70">{selectedProduct.sustainabilityDetails?.co2Reduced}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Package className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Materials</p>
                        <p className="text-foreground/70">{selectedProduct.sustainabilityDetails?.materials}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sustainabilityDetails?.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Comparison Modal */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Comparison</DialogTitle>
            <DialogDescription>
              Compare the environmental impact and features of selected products
            </DialogDescription>
          </DialogHeader>
          
          {compareProducts.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSelectedProductsForComparison().map(product => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="truncate">{product.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleProductComparison(product.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted rounded aspect-square mb-4 flex items-center justify-center">
                        <span className="text-4xl">🛍️</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Price</span>
                          <span className="font-medium">${product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Impact Score</span>
                          <span className="font-medium">{product.impactScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Carbon Saved</span>
                          <span className="font-medium">{product.carbonOffset}kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Impact Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Environmental Impact Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getSelectedProductsForComparison().map(product => ({
                          name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
                          impact: product.impactScore,
                          carbon: product.carbonOffset,
                          price: product.price
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="impact" fill="#10B981" name="Impact Score" />
                        <Bar dataKey="carbon" fill="#3B82F6" name="Carbon Saved (kg)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowComparison(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Review your cart and complete your purchase
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              <h3 className="font-medium">Items in your cart</h3>
              {cart.map(item => {
                const product = mockProducts.find(p => p.id === item.id);
                if (!product) return null;
                
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-muted rounded w-16 h-16 flex items-center justify-center">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-foreground/70">${product.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="font-medium">${(product.price * item.quantity).toFixed(2)}</div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {/* Carbon Footprint Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    <Globe className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-foreground/70">Carbon Saved</p>
                      <p className="font-bold">{getCartCarbonFootprint().toFixed(1)}kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-foreground/70">Water Saved</p>
                      <p className="font-bold">{(getCartCarbonFootprint() * 15).toFixed(0)}L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg">
                    <Recycle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-foreground/70">Waste Prevented</p>
                      <p className="font-bold">{(getCartCarbonFootprint() * 0.8).toFixed(1)}kg</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Standard Delivery</p>
                        <p className="text-sm text-foreground/70">3-5 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Express Delivery</p>
                        <p className="text-sm text-foreground/70">1-2 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">$4.99</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Donation Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Support Green Causes
                  </span>
                  <Switch 
                    checked={donateToGreenCauses} 
                    onCheckedChange={setDonateToGreenCauses} 
                  />
                </CardTitle>
                <CardDescription>
                  Add a donation to support environmental initiatives
                </CardDescription>
              </CardHeader>
              {donateToGreenCauses && (
                <CardContent>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Donation amount:</span>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20].map(amount => (
                        <Button
                          key={amount}
                          variant={donationAmount === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDonationAmount(amount)}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(Number(e.target.value))}
                      className="w-20"
                      min="1"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                {donateToGreenCauses && (
                  <div className="flex justify-between">
                    <span>Donation</span>
                    <span>${donationAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${(getCartTotal() + (donateToGreenCauses ? donationAmount : 0)).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Checkout Button */}
            <div className="flex justify-end">
              <Button 
                className="w-full"
                onClick={() => {
                  setShowCheckout(false);
                  setCart([]);
                  setWishlist([]);
                  // In a real app, this would process the payment
                  alert("Order placed successfully! Thank you for supporting sustainable commerce.");
                }}
              >
                Complete Purchase
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}