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
  ChevronUp
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
    image: "/placeholder-tshirt.jpg",
    ecoBadges: ["Organic", "Fair Trade", "Carbon Neutral"],
    rating: 4.8,
    reviews: 124,
    inStock: true
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
    image: "/placeholder-toothbrush.jpg",
    ecoBadges: ["Biodegradable", "Plastic Free", "Vegan"],
    rating: 4.6,
    reviews: 89,
    inStock: true
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
    image: "/placeholder-bottle.jpg",
    ecoBadges: ["Reusable", "BPA Free", "Durable"],
    rating: 4.9,
    reviews: 210,
    inStock: true
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
    image: "/placeholder-charger.jpg",
    ecoBadges: ["Renewable Energy", "Portable", "Durable"],
    rating: 4.7,
    reviews: 156,
    inStock: false
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
    image: "/placeholder-case.jpg",
    ecoBadges: ["Compostable", "Biodegradable", "Plant-based"],
    rating: 4.5,
    reviews: 92,
    inStock: true
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
    image: "/placeholder-wraps.jpg",
    ecoBadges: ["Reusable", "Plastic Free", "Natural"],
    rating: 4.4,
    reviews: 78,
    inStock: true
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
  { id: "transport", name: "Transport", icon: Car }
];

export default function EcoMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [impactScore, setImpactScore] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  // Filter products based on search, category, price, and impact score
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesImpact = product.impactScore >= impactScore;
    return matchesSearch && matchesCategory && matchesPrice && matchesImpact;
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
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              Eco Marketplace
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
            <div className="w-full lg:w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label htmlFor="marketplace-search" className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="marketplace-search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categories</label>
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
                    <label htmlFor="price-range" className="text-sm font-medium">Price Range</label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-foreground/70">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        id="price-range"
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                        aria-label="Maximum price filter"
                      />
                    </div>
                  </div>

                  {/* Impact Score */}
                  <div className="space-y-2">
                    <label htmlFor="impact-score" className="text-sm font-medium">
                      Minimum Impact Score: {impactScore}%
                    </label>
                    <div className="space-y-2">
                      <input
                        id="impact-score"
                        type="range"
                        min="0"
                        max="100"
                        value={impactScore}
                        onChange={(e) => setImpactScore(parseInt(e.target.value))}
                        className="w-full"
                        aria-label="Minimum impact score filter"
                      />
                      <div className="flex justify-between text-xs text-foreground/70">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
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

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-foreground/70">
                  Showing {sortedProducts.length} of {mockProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        {sortBy === "featured" && "Featured"}
                        {sortBy === "price-low" && "Price: Low to High"}
                        {sortBy === "price-high" && "Price: High to Low"}
                        {sortBy === "rating" && "Highest Rated"}
                        {sortBy === "impact" && "Highest Impact"}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setSortBy("featured")}>
                        Featured
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSortBy("price-low")}>
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSortBy("price-high")}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSortBy("rating")}>
                        Highest Rated
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSortBy("impact")}>
                        Highest Impact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  }}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
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
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              {product.impactScore}% impact score
                            </span>
                          </div>
                          {!product.inStock && (
                            <Badge variant="outline">Out of Stock</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {product.ecoBadges.map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 mr-2 ${
                              wishlist.includes(product.id) 
                                ? "fill-primary text-primary" 
                                : ""
                            }`} 
                          />
                          Wishlist
                        </Button>
                        <Button 
                          className="flex-1"
                          disabled={!product.inStock}
                          onClick={() => addToCart(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}