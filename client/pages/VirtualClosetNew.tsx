import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import {
  Upload,
  Grid3x3,
  Filter,
  Plus,
  ArrowRight,
  Search,
  Trash2,
  Zap,
  Heart,
  Star,
} from "lucide-react";
import { useUploadClothingItem, useGetUserCloset, useDeleteClothingItem, useGetEcoScore } from "@/hooks/useApi";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

export default function VirtualCloset() {
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadClothingItem();
  const deleteM utation = useDeleteClothingItem();
  const { data: closetData, refetch: refetchCloset } = useGetUserCloset(DEMO_USER_ID);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "tops", label: "Tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "dresses", label: "Dresses" },
    { id: "shoes", label: "Shoes" },
    { id: "accessories", label: "Accessories" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create a mock upload with demo data
      const mockItem = {
        userId: DEMO_USER_ID,
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: detectCategory(file.name),
        color: ["Blue"],
        brand: "Sample Brand",
        material: ["Cotton"],
        description: `Uploaded item: ${file.name}`,
        imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(file.name)}`,
      };

      uploadMutation.mutate(mockItem, {
        onSuccess: () => {
          toast.success(`${mockItem.title} added to closet!`);
          refetchCloset();
        },
        onError: () => {
          toast.error("Failed to add item");
        },
      });
    }
  };

  const detectCategory = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes("shirt") || lower.includes("top")) return "tops";
    if (lower.includes("pant") || lower.includes("jean")) return "bottoms";
    if (lower.includes("dress")) return "dresses";
    if (lower.includes("shoe") || lower.includes("boot")) return "shoes";
    return "accessories";
  };

  const handleDeleteItem = (itemId: string) => {
    deleteMutation.mutate(itemId, {
      onSuccess: () => {
        toast.success("Item deleted");
        refetchCloset();
      },
      onError: () => {
        toast.error("Failed to delete item");
      },
    });
  };

  const filteredItems = closetData?.data?.filter((item: any) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Virtual Closet
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            Organize and manage your wardrobe digitally with AI-powered tagging
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-8">
          {/* Upload Section */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-muted/20 hover:border-primary/50"
            } cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Upload Your Clothing Items
                </h3>
                <p className="text-foreground/70 mt-1">
                  Drag and drop images here or click to browse
                </p>
              </div>
              <p className="text-sm text-foreground/50">
                Supported formats: JPG, PNG, WebP, GIF (Max 10MB)
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-base p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Items in Closet</h4>
                <Grid3x3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {closetData?.count || 0}
              </p>
            </div>

            <div className="card-base p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Avg Eco Score</h4>
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent">
                {closetData?.data?.length > 0
                  ? Math.round(
                      closetData.data.reduce((sum: number, item: any) => sum + item.ecoScore, 0) /
                        closetData.data.length
                    )
                  : 0}
              </p>
            </div>

            <div className="card-base p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Categories</h4>
                <Filter className="w-5 h-5 text-nature" />
              </div>
              <p className="text-3xl font-bold text-nature">
                {new Set(closetData?.data?.map((item: any) => item.category)).size || 0}
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search items by name, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: any) => (
                <div key={item._id} className="card-base overflow-hidden group hover:border-primary/30">
                  {/* Image */}
                  <div className="relative h-48 bg-muted/50 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                    {/* Action buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {item.brand || "No brand"}
                      </p>
                    </div>

                    {/* Eco Score Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/70">Eco Score</span>
                        <span className="font-semibold text-primary">
                          {item.ecoScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-nature transition-all"
                          style={{ width: `${item.ecoScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.color?.slice(0, 2).map((c: string) => (
                        <span
                          key={c}
                          className="px-2 py-1 rounded text-xs bg-muted text-foreground/70"
                        >
                          {c}
                        </span>
                      ))}
                      {item.color?.length > 2 && (
                        <span className="px-2 py-1 rounded text-xs bg-muted text-foreground/70">
                          +{item.color.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Sustainability Badge */}
                    <div className="pt-3 border-t border-border/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/60">
                          {item.sustainability?.notes}
                        </span>
                        <Star className="w-4 h-4 fill-accent text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-base p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mx-auto">
                <Plus className="w-10 h-10 text-foreground/40" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Your closet is empty
                </h2>
                <p className="text-foreground/70">
                  Start by uploading photos of your clothing items. Our AI will automatically tag and organize them for you.
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Ready to generate outfits?
              </h2>
              <p className="text-foreground/70 mb-6">
                Once you've catalogued your items, head to the AI Outfit Generator to create personalized outfit suggestions.
              </p>
              <a
                href="/outfit-generator"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group"
              >
                Generate Outfit
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}