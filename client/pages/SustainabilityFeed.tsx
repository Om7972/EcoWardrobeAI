import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
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
  Globe,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  readTime: number;
  tags: string[];
  category: string;
  likes: number;
  bookmarks: number;
  isBookmarked: boolean;
  isLiked: boolean;
}

export default function SustainabilityFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: "1",
      title: "The Rise of Regenerative Fashion: Beyond Sustainability",
      summary: "How the fashion industry is moving towards regenerative practices that restore ecosystems and create positive environmental impact.",
      author: "Eco Fashion Journal",
      publishDate: "Nov 15, 2024",
      readTime: 8,
      tags: ["regenerative", "innovation", "future"],
      category: "Trends",
      likes: 124,
      bookmarks: 42,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "2",
      title: "Circular Fashion Economy: Closing the Loop",
      summary: "How brands are implementing circular models to eliminate waste in fashion and create sustainable business practices.",
      author: "Sustainable Style Magazine",
      publishDate: "Nov 12, 2024",
      readTime: 6,
      tags: ["circular", "waste-reduction", "business"],
      category: "Business",
      likes: 98,
      bookmarks: 35,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "3",
      title: "Textile Recycling Breakthrough: New Technology Transforms Old Clothes",
      summary: "Scientists develop revolutionary method to recycle mixed-fiber textiles into high-quality new fabrics.",
      author: "Tech & Sustainability Today",
      publishDate: "Nov 10, 2024",
      readTime: 5,
      tags: ["technology", "recycling", "innovation"],
      category: "Technology",
      likes: 156,
      bookmarks: 67,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "4",
      title: "Fashion Transparency Index 2024: Who's Leading the Change?",
      summary: "Annual report reveals which brands are most transparent about their supply chains and sustainability practices.",
      author: "Fashion Revolution",
      publishDate: "Nov 8, 2024",
      readTime: 10,
      tags: ["transparency", "brands", "report"],
      category: "Reports",
      likes: 203,
      bookmarks: 89,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "5",
      title: "The True Cost of Fast Fashion: Environmental Impact Report",
      summary: "New study quantifies the environmental toll of fast fashion and offers solutions for consumers and brands.",
      author: "Environmental Research Institute",
      publishDate: "Nov 5, 2024",
      readTime: 12,
      tags: ["fast-fashion", "environment", "research"],
      category: "Research",
      likes: 287,
      bookmarks: 134,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "6",
      title: "Sustainable Fabrics Guide: What to Look For When Shopping",
      summary: "A comprehensive guide to eco-friendly fabrics and materials that reduce environmental impact.",
      author: "Green Living Magazine",
      publishDate: "Nov 3, 2024",
      readTime: 7,
      tags: ["fabrics", "guide", "shopping"],
      category: "Guides",
      likes: 176,
      bookmarks: 98,
      isBookmarked: false,
      isLiked: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const categories = ["All", "Trends", "Business", "Technology", "Reports", "Research", "Guides"];

  useEffect(() => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, articles]);

  const handleLike = (articleId: string) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const newIsLiked = !article.isLiked;
        toast.success(newIsLiked ? "Article liked!" : "Like removed");
        return {
          ...article,
          isLiked: newIsLiked,
          likes: newIsLiked ? article.likes + 1 : article.likes - 1
        };
      }
      return article;
    }));
  };

  const handleBookmark = (articleId: string) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const newIsBookmarked = !article.isBookmarked;
        toast.success(newIsBookmarked ? "Article bookmarked!" : "Bookmark removed");
        return {
          ...article,
          isBookmarked: newIsBookmarked,
          bookmarks: newIsBookmarked ? article.bookmarks + 1 : article.bookmarks - 1
        };
      }
      return article;
    }));
  };

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).then(() => {
        toast.success("Article shared successfully!");
      }).catch(() => {
        copyToClipboard(article);
      });
    } else {
      copyToClipboard(article);
    }
  };

  const copyToClipboard = (article: NewsArticle) => {
    const text = `${article.title}\n${article.summary}\n${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 pt-6 -mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Newspaper className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Sustainability News</h1>
                <p className="text-foreground/70 mt-1">Stay updated with the latest in sustainable fashion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, tags, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime} min</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Author and Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.publishDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(article.id)}
                          className={article.isLiked ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${article.isLiked ? "fill-current" : ""}`} />
                          {article.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(article.id)}
                          className={article.isBookmarked ? "text-primary" : ""}
                        >
                          <Bookmark className={`h-4 w-4 mr-1 ${article.isBookmarked ? "fill-current" : ""}`} />
                          {article.bookmarks}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(article)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Read More Button */}
                    <Button className="w-full" variant="outline">
                      Read Full Article
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
