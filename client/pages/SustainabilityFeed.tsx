import { useState } from "react";
import { 
  Newspaper, 
  TrendingUp, 
  Leaf, 
  Heart, 
  Share2, 
  Bookmark,
  Filter,
  Search,
  Clock,
  User,
  Tag,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  readTime: number; // minutes
  tags: string[];
  category: string;
  image: string;
  likes: number;
  bookmarks: number;
  isBookmarked: boolean;
  isLiked: boolean;
}

const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "The Rise of Regenerative Fashion: Beyond Sustainability",
    summary: "How the fashion industry is moving towards regenerative practices that restore ecosystems",
    content: "Regenerative fashion goes beyond traditional sustainability by focusing on practices that actively restore and revitalize the environment...",
    author: "Eco Fashion Journal",
    publishDate: new Date(2024, 10, 15),
    readTime: 8,
    tags: ["regenerative", "innovation", "future"],
    category: "Trends",
    image: "/placeholder-news1.jpg",
    likes: 124,
    bookmarks: 42,
    isBookmarked: false,
    isLiked: false
  },
  {
    id: "2",
    title: "Circular Fashion Economy: Closing the Loop",
    summary: "How brands are implementing circular models to eliminate waste in fashion",
    content: "The circular fashion economy represents a fundamental shift from the traditional linear model of take-make-dispose...",
    author: "Sustainable Style Magazine",
    publishDate: new Date(2024, 10, 12),
    readTime: 6,
    tags: ["circular", "waste", "business"],
    category: "Business",
    image: "/placeholder-news2.jpg",
    likes: 89,
    bookmarks: 31,
    isBookmarked: true,
    isLiked: true
  },
  {
    id: "3",
    title: "Biofabrication: The Future of Sustainable Materials",
    summary: "Lab-grown materials are revolutionizing sustainable fashion production",
    content: "Biofabrication uses living organisms to create materials, offering a sustainable alternative to traditional textiles...",
    author: "Tech in Fashion",
    publishDate: new Date(2024, 10, 10),
    readTime: 10,
    tags: ["biofabrication", "materials", "technology"],
    category: "Technology",
    image: "/placeholder-news3.jpg",
    likes: 156,
    bookmarks: 67,
    isBookmarked: false,
    isLiked: false
  },
  {
    id: "4",
    title: "Slow Fashion Movement Gains Momentum Worldwide",
    summary: "Consumers are embracing quality over quantity in their fashion choices",
    content: "The slow fashion movement emphasizes mindful consumption, quality craftsmanship, and ethical production practices...",
    author: "Conscious Consumer",
    publishDate: new Date(2024, 10, 8),
    readTime: 5,
    tags: ["slow fashion", "mindful", "consumer"],
    category: "Lifestyle",
    image: "/placeholder-news4.jpg",
    likes: 203,
    bookmarks: 89,
    isBookmarked: false,
    isLiked: true
  },
  {
    id: "5",
    title: "Carbon Neutral Fashion Brands Leading the Way",
    summary: "How companies are achieving carbon neutrality through innovative practices",
    content: "Leading fashion brands are implementing comprehensive strategies to achieve carbon neutrality...",
    author: "Green Business Review",
    publishDate: new Date(2024, 10, 5),
    readTime: 7,
    tags: ["carbon neutral", "brands", "innovation"],
    category: "Business",
    image: "/placeholder-news5.jpg",
    likes: 98,
    bookmarks: 34,
    isBookmarked: false,
    isLiked: false
  },
  {
    id: "6",
    title: "Waterless Dyeing Technologies Transform Industry",
    summary: "New dyeing methods are reducing water consumption in textile production",
    content: "Traditional textile dyeing is one of the most water-intensive processes in fashion production...",
    author: "Clean Tech Fashion",
    publishDate: new Date(2024, 10, 3),
    readTime: 9,
    tags: ["water", "dyeing", "technology"],
    category: "Technology",
    image: "/placeholder-news6.jpg",
    likes: 142,
    bookmarks: 56,
    isBookmarked: true,
    isLiked: false
  }
];

const categories = [
  { id: "all", name: "All Categories", icon: Newspaper },
  { id: "trends", name: "Trends", icon: TrendingUp },
  { id: "technology", name: "Technology", icon: Zap },
  { id: "business", name: "Business", icon: Award },
  { id: "lifestyle", name: "Lifestyle", icon: Leaf }
];

const popularTags = [
  "sustainable", "eco-friendly", "innovation", "circular", 
  "regenerative", "technology", "brands", "consumer"
];

export default function SustainabilityFeed() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory;
    
    const matchesTag = !selectedTag || article.tags.includes(selectedTag);
    
    const matchesBookmark = !bookmarkedOnly || article.isBookmarked;
    
    return matchesSearch && matchesCategory && matchesTag && matchesBookmark;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "newest") {
      return b.publishDate.getTime() - a.publishDate.getTime();
    } else if (sortBy === "popular") {
      return b.likes - a.likes;
    } else if (sortBy === "bookmarks") {
      return b.bookmarks - a.bookmarks;
    }
    return 0;
  });

  const toggleLike = (articleId: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              likes: article.isLiked ? article.likes - 1 : article.likes + 1,
              isLiked: !article.isLiked
            } 
          : article
      )
    );
  };

  const toggleBookmark = (articleId: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              bookmarks: article.isBookmarked ? article.bookmarks - 1 : article.bookmarks + 1,
              isBookmarked: !article.isBookmarked
            } 
          : article
      )
    );
  };

  const toggleExpand = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  const getTrendingArticles = () => {
    return [...articles]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-primary" />
              Sustainability Feed
            </h1>
            <p className="text-foreground/70 mt-2">
              Curated news and trends in sustainable fashion
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
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
                  
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tags</SelectItem>
                      {popularTags.map(tag => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="bookmarks">Most Bookmarked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/70">
                      {sortedArticles.length} articles found
                    </span>
                  </div>
                  
                  <Button 
                    variant={bookmarkedOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${bookmarkedOnly ? "fill-current" : ""}`} />
                    Bookmarks Only
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Articles List */}
            <div className="space-y-6">
              {sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="border-border/50 shadow-lg hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div className="bg-muted aspect-video md:aspect-square rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex items-center justify-center">
                            <span className="text-4xl">📰</span>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant="secondary" className="mb-2">
                                {article.category}
                              </Badge>
                              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                              <p className="text-foreground/70 mb-4">
                                {expandedArticle === article.id ? article.content : article.summary}
                              </p>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleBookmark(article.id)}
                            >
                              <Bookmark 
                                className={`w-5 h-5 ${article.isBookmarked ? "fill-primary text-primary" : ""}`} 
                              />
                            </Button>
                          </div>
                          
                          {expandedArticle === article.id && (
                            <div className="mt-4 prose max-w-none">
                              <p>{article.content}</p>
                              <p>Additional detailed content about sustainable fashion practices...</p>
                              <p>Industry insights and future predictions...</p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-foreground/70">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime} min read</span>
                              </div>
                              <span>
                                {article.publishDate.toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleLike(article.id)}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${article.isLiked ? "fill-red-500 text-red-500" : ""}`} 
                                />
                                <span className="ml-1">{article.likes}</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleExpand(article.id)}
                              >
                                {expandedArticle === article.id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Newspaper className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Articles Found</h3>
                    <p className="text-foreground/70 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedTag("");
                      setBookmarkedOnly(false);
                    }}>
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Articles */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Now
                </CardTitle>
                <CardDescription>
                  Most popular articles this week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getTrendingArticles().map((article) => (
                  <div 
                    key={article.id} 
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      // In a real app, this would navigate to the article
                    }}
                  >
                    <div className="bg-muted aspect-square w-16 rounded flex items-center justify-center">
                      <span className="text-xl">📰</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-foreground/70">
                        <Heart className="w-3 h-3" />
                        <span>{article.likes}</span>
                        <Bookmark className="w-3 h-3" />
                        <span>{article.bookmarks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Popular Tags */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Newsletter Signup */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Stay Informed
                </CardTitle>
                <CardDescription>
                  Get weekly sustainability updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    Subscribe to our newsletter for the latest in sustainable fashion
                  </p>
                  <Input placeholder="Your email address" />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Reading Stats */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Reading Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Articles Read</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Time Saved</span>
                    <span className="font-medium">2h 18m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Bookmarks</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-foreground/70 mt-1">
                      65% of monthly reading goal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}