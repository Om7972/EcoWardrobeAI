interface CareLabel {
  id: string;
  garmentName: string;
  fabricType: string;
  washingInstructions: string[];
  dryingInstructions: string[];
  ironingInstructions: string[];
  specialInstructions: string[];
  temperature: string;
  symbol: string;
}

interface RepairLog {
  id: string;
  garmentName: string;
  repairType: "alteration" | "repair" | "upcycle";
  description: string;
  cost: number;
  date: string;
  tailor?: string;
  beforeImage?: string;
  afterImage?: string;
  notes: string;
}

interface LocalService {
  id: string;
  name: string;
  type: "tailor" | "cobbler" | "cleaner" | "leather-repair";
  rating: number;
  reviews: number;
  distance: number;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
}

const careLabels: Record<string, CareLabel> = {
  cotton: {
    id: "cotton-label",
    garmentName: "Cotton",
    fabricType: "100% Cotton",
    washingInstructions: [
      "Machine wash in warm water",
      "Use mild detergent",
      "Wash with similar colors",
      "Do not use bleach",
      "Gentle cycle recommended",
    ],
    dryingInstructions: [
      "Lay flat or hang dry",
      "Avoid direct sunlight",
      "Can be tumble dried on low",
      "Remove promptly to prevent wrinkles",
    ],
    ironingInstructions: [
      "Iron on high heat if needed",
      "Use steam for best results",
      "Iron while damp for easier pressing",
    ],
    specialInstructions: [
      "Wash before first wear",
      "Turn inside out to preserve color",
      "Cold water for dark colors",
    ],
    temperature: "30-60°C",
    symbol: "🧵",
  },
  linen: {
    id: "linen-label",
    garmentName: "Linen",
    fabricType: "100% Linen",
    washingInstructions: [
      "Hand wash or gentle machine wash",
      "Use cool to lukewarm water",
      "Use mild detergent",
      "Do not wring, gently squeeze",
    ],
    dryingInstructions: [
      "Hang dry immediately",
      "Avoid wringing",
      "Air dry away from direct heat",
      "Line dry is ideal",
    ],
    ironingInstructions: [
      "Iron while damp",
      "Use high heat",
      "Use steam for best results",
    ],
    specialInstructions: [
      "Linen becomes softer with each wash",
      "Natural wrinkles are normal",
      "Store in a cool, dry place",
    ],
    temperature: "20-40°C",
    symbol: "👕",
  },
  silk: {
    id: "silk-label",
    garmentName: "Silk",
    fabricType: "100% Silk",
    washingInstructions: [
      "Hand wash only",
      "Use cool water",
      "Use pH-neutral detergent or silk wash",
      "Gently agitate, do not rub",
      "Rinse with cool water until clear",
    ],
    dryingInstructions: [
      "Gently squeeze out excess water",
      "Roll in a towel to absorb moisture",
      "Hang dry or lay flat",
      "Keep away from direct heat and sunlight",
    ],
    ironingInstructions: [
      "Iron on low heat or use silk setting",
      "Iron on wrong side when damp",
      "Use a pressing cloth",
    ],
    specialInstructions: [
      "Avoid friction and snagging",
      "Do not bleach",
      "Dry cleaning recommended for delicate items",
    ],
    temperature: "20°C",
    symbol: "✨",
  },
  wool: {
    id: "wool-label",
    garmentName: "Wool",
    fabricType: "100% Wool",
    washingInstructions: [
      "Hand wash only",
      "Use cool water",
      "Use wool-specific detergent",
      "Gently squeeze, do not rub",
      "Avoid agitation",
    ],
    dryingInstructions: [
      "Gently squeeze out water",
      "Lay flat to dry",
      "Never hang wet wool",
      "Keep away from direct heat",
    ],
    ironingInstructions: [
      "Use warm iron with steam",
      "Use a pressing cloth",
      "Iron from wrong side",
    ],
    specialInstructions: [
      "Prevents pilling if cared properly",
      "Store with mothballs or cedar",
      "Avoid friction with rough surfaces",
    ],
    temperature: "20-30°C",
    symbol: "🧶",
  },
  polyester: {
    id: "polyester-label",
    garmentName: "Polyester",
    fabricType: "100% Polyester",
    washingInstructions: [
      "Machine wash in warm water",
      "Use regular detergent",
      "Can wash with other colors",
      "Normal wash cycle is fine",
    ],
    dryingInstructions: [
      "Tumble dry on low to medium heat",
      "Remove promptly to prevent wrinkles",
      "Can also air dry",
    ],
    ironingInstructions: [
      "Iron on low to medium heat",
      "Can melt at high temperatures",
      "Use low steam setting",
    ],
    specialInstructions: [
      "Dries quickly",
      "Wrinkle resistant",
      "May retain odors - air out regularly",
    ],
    temperature: "30-40°C",
    symbol: "🏭",
  },
};

const mockLocalServices: LocalService[] = [
  {
    id: "tailor-1",
    name: "Master Tailoring",
    type: "tailor",
    rating: 4.8,
    reviews: 156,
    distance: 0.5,
    address: "123 Fashion St, Downtown",
    phone: "+1 (555) 123-4567",
    hours: "9 AM - 6 PM, Closed Sundays",
    specialties: ["Alterations", "Custom tailoring", "Hemming"],
  },
  {
    id: "cobbler-1",
    name: "Premium Shoe Repair",
    type: "cobbler",
    rating: 4.9,
    reviews: 203,
    distance: 0.8,
    address: "456 Shoe Lane, Downtown",
    phone: "+1 (555) 234-5678",
    hours: "10 AM - 7 PM, Closed Mondays",
    specialties: ["Sole replacement", "Heel repair", "Leather restoration"],
  },
  {
    id: "leather-1",
    name: "Artisan Leather Care",
    type: "leather-repair",
    rating: 4.7,
    reviews: 89,
    distance: 1.2,
    address: "789 Leather Ave, Midtown",
    phone: "+1 (555) 345-6789",
    hours: "11 AM - 5 PM, Weekdays only",
    specialties: ["Leather conditioning", "Tear repair", "Color restoration"],
  },
  {
    id: "cleaner-1",
    name: "Eco-Friendly Dry Cleaning",
    type: "cleaner",
    rating: 4.6,
    reviews: 142,
    distance: 0.3,
    address: "101 Clean St, Your Neighborhood",
    phone: "+1 (555) 456-7890",
    hours: "8 AM - 8 PM, Open Daily",
    specialties: ["Eco-friendly cleaning", "Delicate garments", "Stain removal"],
  },
];

export function getCareLabel(fabricType: string): CareLabel {
  const key = fabricType.toLowerCase().split(" ")[0];
  return careLabels[key] || careLabels.cotton;
}

export function generateRepairLog(
  garmentId: string,
  garmentName: string
): RepairLog[] {
  const repairTypes: RepairLog[] = [
    {
      id: `repair-${Date.now()}-1`,
      garmentName,
      repairType: "repair",
      description: "Replaced zipper",
      cost: 25,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      tailor: "Master Tailoring",
      notes: "Zipper was broken at top stopper. Successfully replaced with matching metal zipper.",
    },
    {
      id: `repair-${Date.now()}-2`,
      garmentName,
      repairType: "alteration",
      description: "Hemmed pants",
      cost: 15,
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      tailor: "Master Tailoring",
      notes: "Shortened by 2 inches. Single stitching for clean finish.",
    },
    {
      id: `repair-${Date.now()}-3`,
      garmentName,
      repairType: "upcycle",
      description: "Added patch pockets",
      cost: 35,
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      tailor: "Master Tailoring",
      notes: "Custom pocket design added to vintage jacket. Enhanced functionality and style.",
    },
  ];
  return repairTypes;
}

export function getLocalServices(type?: "tailor" | "cobbler" | "cleaner" | "leather-repair"): LocalService[] {
  if (!type) return mockLocalServices;
  return mockLocalServices.filter((service) => service.type === type);
}

export function searchNearbyServices(
  serviceType: string,
  maxDistance: number = 5
): LocalService[] {
  return mockLocalServices
    .filter(
      (service) =>
        service.type === serviceType && service.distance <= maxDistance
    )
    .sort((a, b) => a.distance - b.distance);
}
