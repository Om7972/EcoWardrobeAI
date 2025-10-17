import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Shuffle,
  Plus,
  Star,
  Heart,
  MessageSquare,
  Filter,
  Search,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useGetAllListings,
  useGetUserListings,
  useCreateSwapRequest,
  useGetUserSwapRequests,
  useAcceptSwapRequest,
  useRejectSwapRequest,
} from "@/hooks/useApi";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

const conditions = ["like-new", "excellent", "good", "fair"];
const categories = ["tops", "bottoms", "dresses", "shoes", "accessories"];

export default function ThriftSwap() {
  const [activeTab, setActiveTab] = useState<"browse" | "myListings" | "requests">("browse");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allListings } = useGetAllListings();
  const { data: myListings } = useGetUserListings(DEMO_USER_ID);
  const { data: swapRequests, refetch: refetchRequests } = useGetUserSwapRequests(DEMO_USER_ID);
  const createRequestMutation = useCreateSwapRequest();
  const acceptRequestMutation = useAcceptSwapRequest();
  const rejectRequestMutation = useRejectSwapRequest();

  const filteredListings = allListings?.data?.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = !selectedCondition || item.condition === selectedCondition;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCondition && matchesCategory;
  }) || [];

  const handleCreateSwapRequest = (listingId: string) => {
    createRequestMutation.mutate(
      {
        listingId,
        fromUserId: DEMO_USER_ID,
        offeredItemId: "sample-item-1",
        desiredItemId: listingId,
      },
      {
        onSuccess: () => {
          toast.success("Swap request sent!");
          refetchRequests();
        },
        onError: () => {
          toast.error("Failed to send request");
        },
      }
    );
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptRequestMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Request accepted!");
        refetchRequests();
      },
    });
  };

  const handleRejectRequest = (requestId: string) => {
    rejectRequestMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Request rejected");
        refetchRequests();
      },
    });
  };

  const incomingRequests = swapRequests?.data?.filter(
    (req: any) => req.toUserId === DEMO_USER_ID
  ) || [];
  const outgoingRequests = swapRequests?.data?.filter(
    (req: any) => req.fromUserId === DEMO_USER_ID
  ) || [];

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            <Shuffle className="w-8 h-8 text-primary" />
            Thrift Swap Marketplace
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            Swap clothing with the community and reduce fashion waste
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border/40">
            {[
              { id: "browse", label: "Browse Listings" },
              { id: "myListings", label: "My Listings" },
              { id: "requests", label: "Swap Requests" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Browse Listings Tab */}
          {activeTab === "browse" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="card-base p-6 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter & Search
                </h3>

                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Condition
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCondition(null)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedCondition === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        All
                      </button>
                      {conditions.map((cond) => (
                        <button
                          key={cond}
                          onClick={() => setSelectedCondition(cond)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                            selectedCondition === cond
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                            selectedCategory === cat
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              {filteredListings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing: any) => (
                    <div key={listing._id} className="card-base overflow-hidden group hover:border-primary/30">
                      {/* Image */}
                      <div className="relative h-48 bg-muted/50 overflow-hidden">
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute top-2 right-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold capitalize">
                          {listing.condition}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-foreground/60">
                            {listing.brand || "Unknown brand"}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(listing.rating)
                                  ? "fill-accent text-accent"
                                  : "text-foreground/20"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-foreground/60 ml-2">
                            ({listing.reviews?.length || 0})
                          </span>
                        </div>

                        {/* Details */}
                        <div className="text-xs text-foreground/70 space-y-1">
                          <p>Size: {listing.size || "Unknown"}</p>
                          <p className="capitalize">Category: {listing.category}</p>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-border/40 flex gap-2">
                          <button
                            onClick={() => handleCreateSwapRequest(listing._id)}
                            className="flex-1 py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                          >
                            <Shuffle className="w-4 h-4" />
                            Swap
                          </button>
                          <button className="flex-1 py-2 border border-border bg-background rounded font-medium text-sm hover:bg-muted/50 transition-colors flex items-center justify-center gap-1">
                            <Heart className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-base p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                  <p className="text-foreground/70">No listings found</p>
                </div>
              )}
            </div>
          )}

          {/* My Listings Tab */}
          {activeTab === "myListings" && (
            <div className="space-y-6">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Listing
              </button>

              {myListings?.count > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.data.map((listing: any) => (
                    <div key={listing._id} className="card-base p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">
                          {listing.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          listing.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60">
                        {listing.swapRequests?.length || 0} swap requests
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-border rounded font-medium text-sm hover:bg-muted/50">
                          Edit
                        </button>
                        <button className="flex-1 py-2 border border-destructive text-destructive rounded font-medium text-sm hover:bg-destructive/10">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-base p-12 text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto" />
                  <p className="text-foreground/70">You haven't created any listings yet</p>
                </div>
              )}
            </div>
          )}

          {/* Swap Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-8">
              {/* Incoming Requests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Incoming Requests ({incomingRequests.length})
                </h3>

                {incomingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {incomingRequests.map((request: any) => (
                      <div
                        key={request._id}
                        className="card-base p-6 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              Swap request from {request.fromUserId}
                            </h4>
                            <p className="text-sm text-foreground/60 mt-1">
                              {request.message || "No message provided"}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status}
                          </span>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="flex-1 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="flex-1 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card-base p-8 text-center text-foreground/60">
                    No incoming requests
                  </div>
                )}
              </div>

              {/* Outgoing Requests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Shuffle className="w-6 h-6 text-accent" />
                  Your Requests ({outgoingRequests.length})
                </h3>

                {outgoingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {outgoingRequests.map((request: any) => (
                      <div key={request._id} className="card-base p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              Requested from {request.toUserId}
                            </h4>
                            <p className="text-sm text-foreground/60 mt-1">
                              Status: <span className="font-medium">{request.status}</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card-base p-8 text-center text-foreground/60">
                    You haven't sent any swap requests yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Why Swap Clothes?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl">♻️</div>
                <h3 className="font-semibold text-foreground">Reduce Waste</h3>
                <p className="text-foreground/70 text-sm">
                  Give your unused clothes a second life instead of throwing them away.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">💚</div>
                <h3 className="font-semibold text-foreground">Save Money</h3>
                <p className="text-foreground/70 text-sm">
                  Get new clothes without spending money or contributing to fast fashion.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">🌍</div>
                <h3 className="font-semibold text-foreground">Save the Planet</h3>
                <p className="text-foreground/70 text-sm">
                  Each swap reduces carbon emissions and water usage from manufacturing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
