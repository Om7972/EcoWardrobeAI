import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Shirt,
  Droplet,
  Thermometer,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  Star,
  MessageCircle,
  Wrench,
  Leaf,
  Home,
} from "lucide-react";
import { toast } from "sonner";

interface CareLabel {
  garmentName: string;
  fabricType: string;
  washingInstructions: string[];
  dryingInstructions: string[];
  ironingInstructions: string[];
  specialInstructions: string[];
  temperature: string;
  symbol: string;
}

interface LocalService {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  distance: number;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
}

export default function CareRepairHub() {
  const [selectedFabric, setSelectedFabric] = useState("cotton");
  const [careLabel, setCareLabel] = useState<CareLabel | null>(null);
  const [services, setServices] = useState<LocalService[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState<string>("tailor");

  const fabrics = [
    { id: "cotton", label: "Cotton", emoji: "🧵" },
    { id: "linen", label: "Linen", emoji: "👕" },
    { id: "silk", label: "Silk", emoji: "✨" },
    { id: "wool", label: "Wool", emoji: "🧶" },
    { id: "polyester", label: "Polyester", emoji: "🏭" },
  ];

  const serviceTypes = [
    { id: "tailor", label: "Tailors", emoji: "✂️" },
    { id: "cobbler", label: "Cobblers", emoji: "👞" },
    { id: "cleaner", label: "Dry Cleaners", emoji: "🧼" },
    { id: "leather-repair", label: "Leather Repair", emoji: "🎒" },
  ];

  useEffect(() => {
    fetchCareLabel();
  }, [selectedFabric]);

  useEffect(() => {
    fetchNearbyServices();
  }, [serviceType]);

  const fetchCareLabel = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/care/instructions?fabricType=${selectedFabric}`,
      );
      if (!res.ok) throw new Error("Failed to fetch care instructions");
      const data = await res.json();
      setCareLabel(data.data);
    } catch (error) {
      console.error("Error fetching care label:", error);
      toast.error("Failed to load care instructions");
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyServices = async () => {
    try {
      const res = await fetch(
        `/api/care/nearby-services?serviceType=${serviceType}`,
      );
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 to-background border-b border-border/40 py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Care & Repair Hub
              </h1>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Extend the life of your clothing with smart care instructions,
              repair tracking, and local tailor services
            </p>
          </div>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {/* Smart Care Labels */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🏷️ Smart Care Labels
              </h2>
              <p className="text-foreground/70">
                Digital care instructions for your fabrics
              </p>
            </div>

            {/* Fabric Selection */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {fabrics.map((fabric) => (
                <button
                  key={fabric.id}
                  onClick={() => setSelectedFabric(fabric.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedFabric === fabric.id
                      ? "border-primary bg-primary/10"
                      : "border-border/30 bg-muted/20 hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{fabric.emoji}</div>
                  <div className="font-semibold text-sm text-foreground">
                    {fabric.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Care Label Details */}
            {careLabel && !loading && (
              <div className="card-base p-8 space-y-8 animate-slide-up">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Washing */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Droplet className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-foreground">
                        Washing
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {careLabel.washingInstructions.map((instruction, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-blue-50/50 border border-blue-200/30 rounded-lg flex gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            {idx + 1}
                          </div>
                          <p className="text-foreground/80 text-sm">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-amber-50/50 border border-amber-200/30 rounded-lg flex gap-2 items-start">
                      <Thermometer className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          Temperature
                        </p>
                        <p className="text-sm text-amber-800">
                          {careLabel.temperature}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Drying & Ironing */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Shirt className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-foreground">
                          Drying
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {careLabel.dryingInstructions.map(
                          (instruction, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-green-50/50 border border-green-200/30 rounded-lg flex gap-3"
                            >
                              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-foreground/80 text-sm">
                                {instruction}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-foreground">
                          Special Care
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {careLabel.specialInstructions.map(
                          (instruction, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-orange-50/50 border border-orange-200/30 rounded-lg text-sm text-foreground/80 flex gap-2"
                            >
                              <span className="text-orange-600 font-bold">
                                •
                              </span>
                              {instruction}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Local Services */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🗺️ Find Local Services
              </h2>
              <p className="text-foreground/70">
                Connect with trusted tailors, cobblers, and repair specialists
              </p>
            </div>

            {/* Service Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setServiceType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    serviceType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border/30 bg-muted/20 hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{type.emoji}</div>
                  <div className="font-semibold text-sm text-foreground">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Services List */}
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="card-base p-6 space-y-4 hover:shadow-lg transition-all animate-slide-up"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(service.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-border/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-foreground/70">
                          {service.rating} ({service.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {service.distance}km
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-5 h-5 text-foreground/50 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">{service.address}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-5 h-5 text-foreground/50 flex-shrink-0" />
                      <a
                        href={`tel:${service.phone}`}
                        className="text-primary hover:text-primary/80 font-semibold"
                      >
                        {service.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Clock className="w-5 h-5 text-foreground/50 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">{service.hours}</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {service.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`tel:${service.phone}`}
                      className="py-2 bg-primary text-primary-foreground rounded-lg text-center font-semibold hover:bg-primary/90 transition-all text-sm"
                    >
                      Call
                    </a>
                    <button className="py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all text-sm">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Repair Tips */}
          <section className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-2xl border border-primary/20 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                💭 Repair Tips
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Prevent Pilling",
                  tip: "Turn garments inside out before washing to reduce friction and pilling.",
                },
                {
                  title: "Handle Zippers",
                  tip: "Keep zippers closed during washing. If stuck, use graphite pencil lubricant.",
                },
                {
                  title: "Fabric Care",
                  tip: "Always check care labels first. Different fabrics require different treatments.",
                },
                {
                  title: "Stain Removal",
                  tip: "Treat stains immediately with cold water. Hot water can set them permanently.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-card border border-border/50 rounded-lg space-y-2 hover:border-primary/30 transition-all"
                >
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-foreground/70">{item.tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
