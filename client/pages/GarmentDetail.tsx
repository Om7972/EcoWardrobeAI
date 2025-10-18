import Layout from "@/components/Layout";
import { MaterialFootprintAnalyzer } from "@/components/MaterialFootprintAnalyzer";
import { Heart, Share2, Edit, Trash2, Tag } from "lucide-react";

export default function GarmentDetail() {
  const garmentId = "sample-garment-1";

  // Mock garment data
  const garment = {
    id: garmentId,
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    category: "Outerwear",
    color: ["Blue"],
    size: "M",
    description:
      "Classic vintage denim jacket in perfect condition. Perfect for any casual outfit.",
    imageUrl: "https://via.placeholder.com/500?text=Denim+Jacket",
    purchaseDate: "2022-06-15",
    material: ["100% Cotton"],
    ecoScore: 75,
    rating: 4.5,
    tags: ["vintage", "durable", "casual-wear"],
  };

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Garment Details
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            View and analyze your clothing item
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {/* Garment Overview */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image */}
            <div className="card-base overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <img
                  src={garment.imageUrl}
                  alt={garment.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Save
                  </button>
                  <button className="flex-1 py-2 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                  <button className="flex-1 py-2 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card-base p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {garment.title}
                  </h2>
                  <p className="text-lg text-foreground/70">{garment.brand}</p>
                </div>

                {/* Key Info Grid */}
                <div className="grid md:grid-cols-2 gap-6 py-6 border-t border-b border-border/40">
                  <div>
                    <p className="text-sm text-foreground/70 mb-2">Category</p>
                    <p className="font-semibold text-foreground">
                      {garment.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-2">Size</p>
                    <p className="font-semibold text-foreground">{garment.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-2">Color</p>
                    <div className="flex gap-2">
                      {garment.color.map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-2">
                      Purchase Date
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(garment.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Eco Score */}
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">Eco Score</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {garment.ecoScore}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground/70 mb-2">
                        This is a sustainable garment choice!
                      </p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: garment.ecoScore + "%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">Description</p>
                  <p className="text-foreground">{garment.description}</p>
                </div>

                {/* Tags */}
                {garment.tags.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground/70 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {garment.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-muted text-foreground rounded-full text-xs font-medium hover:bg-muted/80 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Material Footprint Analyzer */}
          <div className="border-t border-border/40 pt-12">
            <MaterialFootprintAnalyzer />
          </div>

          {/* Care Instructions */}
          <div className="card-base p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Care Instructions
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  ✓ Dos
                </h4>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li>• Wash in cold water to preserve color</li>
                  <li>• Use gentle detergent for delicates</li>
                  <li>• Air dry whenever possible</li>
                  <li>• Store in a cool, dry place</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  ✗ Don'ts
                </h4>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li>• Avoid bleach or harsh chemicals</li>
                  <li>• Don't tumble dry on high heat</li>
                  <li>• Avoid direct sunlight for extended periods</li>
                  <li>• Don't iron on high temperature</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Styling Ideas */}
          <div className="card-base p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Styling Ideas
            </h3>
            <p className="text-foreground/70">
              This versatile denim jacket works great with:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                "White T-shirt + Black Jeans",
                "Floral Dress + White Sneakers",
                "Grey Sweatshirt + Khaki Pants",
              ].map((idea, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-muted/50 text-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  {idea}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
