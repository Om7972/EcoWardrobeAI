import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Leaf, 
  Shirt, 
  Settings, 
  MapPin, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Star,
  Wrench,
  Scissors,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface CareInstruction {
  _id: string;
  clothingItemId: string;
  fabricType: string;
  washingInstructions: string;
  dryingInstructions: string;
  ironingInstructions: string;
  specialCareNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface RepairLog {
  _id: string;
  userId: string;
  clothingItemId: string;
  repairType: "repair" | "alteration" | "upcycling";
  description: string;
  date: string;
  cost: number;
  serviceProvider?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceProvider {
  _id: string;
  name: string;
  type: "tailor" | "cobbler" | "cleaner" | "other";
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating: number;
  reviews: number;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CareRepairHub() {
  const { user } = useAuth();
  const { id: clothingItemId } = useParams<{ id?: string }>();
  
  const [activeTab, setActiveTab] = useState<"care" | "repair" | "services">("care");
  const [careInstructions, setCareInstructions] = useState<CareInstruction | null>(null);
  const [repairLogs, setRepairLogs] = useState<RepairLog[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [careForm, setCareForm] = useState({
    fabricType: "",
    washingInstructions: "",
    dryingInstructions: "",
    ironingInstructions: "",
    specialCareNotes: ""
  });
  
  const [repairForm, setRepairForm] = useState({
    clothingItemId: clothingItemId || "",
    repairType: "repair" as "repair" | "alteration" | "upcycling",
    description: "",
    date: new Date().toISOString().split("T")[0],
    cost: 0,
    serviceProvider: "",
    notes: ""
  });
  
  const [serviceFilter, setServiceFilter] = useState({
    type: "",
    search: ""
  });
  
  const [isCareDialogOpen, setIsCareDialogOpen] = useState(false);
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false);

  useEffect(() => {
    if (clothingItemId) {
      fetchCareInstructions();
      fetchRepairHistory();
    }
    fetchServiceProviders();
  }, [clothingItemId]);

  const fetchCareInstructions = async () => {
    if (!clothingItemId) return;
    
    try {
      const response = await fetch(`/api/care/instructions/${clothingItemId}`);
      if (!response.ok) throw new Error("Failed to fetch care instructions");
      
      const data = await response.json();
      setCareInstructions(data.data);
      
      // Populate form with existing data
      if (data.data) {
        setCareForm({
          fabricType: data.data.fabricType,
          washingInstructions: data.data.washingInstructions,
          dryingInstructions: data.data.dryingInstructions,
          ironingInstructions: data.data.ironingInstructions,
          specialCareNotes: data.data.specialCareNotes
        });
      }
    } catch (error) {
      console.error("Error fetching care instructions:", error);
      toast.error("Failed to load care instructions");
    }
  };

  const fetchRepairHistory = async () => {
    if (!clothingItemId || !user?.userId) return;
    
    try {
      const response = await fetch(`/api/care/repair-history/${user.userId}/${clothingItemId}`);
      if (!response.ok) throw new Error("Failed to fetch repair history");
      
      const data = await response.json();
      setRepairLogs(data.data);
    } catch (error) {
      console.error("Error fetching repair history:", error);
      toast.error("Failed to load repair history");
    }
  };

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (serviceFilter.type) queryParams.append("type", serviceFilter.type);
      if (serviceFilter.search) queryParams.append("search", serviceFilter.search);
      
      const response = await fetch(`/api/care/all-services?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch service providers");
      
      const data = await response.json();
      setServiceProviders(data.data);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      toast.error("Failed to load service providers");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareInstructions = async () => {
    if (!clothingItemId) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/care/instructions/${clothingItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(careForm)
      });
      
      if (!response.ok) throw new Error("Failed to save care instructions");
      
      const data = await response.json();
      setCareInstructions(data.data);
      setIsCareDialogOpen(false);
      toast.success("Care instructions saved successfully!");
    } catch (error) {
      console.error("Error saving care instructions:", error);
      toast.error("Failed to save care instructions");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRepairLog = async () => {
    if (!user?.userId) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/care/repair-log/${user.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repairForm)
      });
      
      if (!response.ok) throw new Error("Failed to add repair log");
      
      const data = await response.json();
      setRepairLogs([data.data, ...repairLogs]);
      setIsRepairDialogOpen(false);
      setRepairForm({
        clothingItemId: clothingItemId || "",
        repairType: "repair",
        description: "",
        date: new Date().toISOString().split("T")[0],
        cost: 0,
        serviceProvider: "",
        notes: ""
      });
      toast.success("Repair log added successfully!");
    } catch (error) {
      console.error("Error adding repair log:", error);
      toast.error("Failed to add repair log");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRepairLog = async (logId: string) => {
    try {
      const response = await fetch(`/api/care/repair-log/${logId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete repair log");
      
      setRepairLogs(repairLogs.filter(log => log._id !== logId));
      toast.success("Repair log deleted successfully!");
    } catch (error) {
      console.error("Error deleting repair log:", error);
      toast.error("Failed to delete repair log");
    }
  };

  const filteredServiceProviders = serviceProviders.filter(provider => {
    const matchesType = !serviceFilter.type || provider.type === serviceFilter.type;
    const matchesSearch = !serviceFilter.search || 
      provider.name.toLowerCase().includes(serviceFilter.search.toLowerCase()) ||
      provider.address.toLowerCase().includes(serviceFilter.search.toLowerCase()) ||
      provider.specialties.some(spec => spec.toLowerCase().includes(serviceFilter.search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Wrench className="w-8 h-8 text-primary" />
              Care & Repair Hub
            </h1>
            <p className="text-foreground/70 mt-2">
              Extend the life of your clothing with proper care and repair
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "care" ? "default" : "outline"} 
              onClick={() => setActiveTab("care")}
              className="transition-all duration-300"
            >
              <Shirt className="w-4 h-4 mr-2" />
              Care Instructions
            </Button>
            <Button 
              variant={activeTab === "repair" ? "default" : "outline"} 
              onClick={() => setActiveTab("repair")}
              className="transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Repair Log
            </Button>
            <Button 
              variant={activeTab === "services" ? "default" : "outline"} 
              onClick={() => setActiveTab("services")}
              className="transition-all duration-300"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Local Services
            </Button>
          </div>
        </div>

        {/* Care Instructions Tab */}
        {activeTab === "care" && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Smart Care Labels
                  </span>
                  <Dialog open={isCareDialogOpen} onOpenChange={setIsCareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setIsCareDialogOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        {careInstructions ? "Edit" : "Add"} Instructions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {careInstructions ? "Edit" : "Add"} Care Instructions
                        </DialogTitle>
                        <DialogDescription>
                          Provide detailed care instructions for this garment to help extend its life
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fabricType" className="text-right">
                            Fabric Type
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="fabricType"
                              value={careForm.fabricType}
                              onChange={(e) => setCareForm({...careForm, fabricType: e.target.value})}
                              placeholder="e.g., Cotton, Polyester, Silk"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="washing" className="text-right pt-2">
                            Washing
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="washing"
                              value={careForm.washingInstructions}
                              onChange={(e) => setCareForm({...careForm, washingInstructions: e.target.value})}
                              placeholder="Washing instructions..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="drying" className="text-right pt-2">
                            Drying
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="drying"
                              value={careForm.dryingInstructions}
                              onChange={(e) => setCareForm({...careForm, dryingInstructions: e.target.value})}
                              placeholder="Drying instructions..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="ironing" className="text-right pt-2">
                            Ironing
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="ironing"
                              value={careForm.ironingInstructions}
                              onChange={(e) => setCareForm({...careForm, ironingInstructions: e.target.value})}
                              placeholder="Ironing instructions..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="specialNotes" className="text-right pt-2">
                            Special Notes
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="specialNotes"
                              value={careForm.specialCareNotes}
                              onChange={(e) => setCareForm({...careForm, specialCareNotes: e.target.value})}
                              placeholder="Any special care notes..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCareDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveCareInstructions} disabled={saving}>
                          {saving ? "Saving..." : "Save Instructions"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Digital, searchable care instructions for each item
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {careInstructions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Fabric Type</h3>
                      <p className="text-foreground/80 bg-muted p-3 rounded-lg">
                        {careInstructions.fabricType}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Washing Instructions</h3>
                      <p className="text-foreground/80 bg-muted p-3 rounded-lg">
                        {careInstructions.washingInstructions}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Drying Instructions</h3>
                      <p className="text-foreground/80 bg-muted p-3 rounded-lg">
                        {careInstructions.dryingInstructions}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Ironing Instructions</h3>
                      <p className="text-foreground/80 bg-muted p-3 rounded-lg">
                        {careInstructions.ironingInstructions}
                      </p>
                    </div>
                    
                    {careInstructions.specialCareNotes && (
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-foreground mb-2">Special Care Notes</h3>
                        <p className="text-foreground/80 bg-muted p-3 rounded-lg">
                          {careInstructions.specialCareNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shirt className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Care Instructions</h3>
                    <p className="text-foreground/70 mb-4">
                      Add care instructions for this garment to help extend its life
                    </p>
                    <Button onClick={() => setIsCareDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Instructions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Repair Log Tab */}
        {activeTab === "repair" && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Repair & Alteration Log
                  </span>
                  <Dialog open={isRepairDialogOpen} onOpenChange={setIsRepairDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setIsRepairDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Repair Log Entry</DialogTitle>
                        <DialogDescription>
                          Track when an item was repaired, tailored, or upcycled
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="repairType" className="text-right">
                            Type
                          </Label>
                          <div className="col-span-3">
                            <Select 
                              value={repairForm.repairType} 
                              onValueChange={(value) => setRepairForm({...repairForm, repairType: value as any})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select repair type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="repair">Repair</SelectItem>
                                <SelectItem value="alteration">Alteration</SelectItem>
                                <SelectItem value="upcycling">Upcycling</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="description"
                              value={repairForm.description}
                              onChange={(e) => setRepairForm({...repairForm, description: e.target.value})}
                              placeholder="What was done?"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="date"
                              type="date"
                              value={repairForm.date}
                              onChange={(e) => setRepairForm({...repairForm, date: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cost" className="text-right">
                            Cost ($)
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="cost"
                              type="number"
                              value={repairForm.cost}
                              onChange={(e) => setRepairForm({...repairForm, cost: parseFloat(e.target.value) || 0})}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="serviceProvider" className="text-right">
                            Service Provider
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="serviceProvider"
                              value={repairForm.serviceProvider}
                              onChange={(e) => setRepairForm({...repairForm, serviceProvider: e.target.value})}
                              placeholder="Name of tailor, cobbler, etc."
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="notes" className="text-right pt-2">
                            Notes
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="notes"
                              value={repairForm.notes}
                              onChange={(e) => setRepairForm({...repairForm, notes: e.target.value})}
                              placeholder="Additional notes..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRepairDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddRepairLog} disabled={saving}>
                          {saving ? "Adding..." : "Add Entry"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Track when an item was repaired, tailored, or upcycled
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {repairLogs.length > 0 ? (
                  <div className="space-y-4">
                    {repairLogs.map((log) => (
                      <div key={log._id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="capitalize">
                                {log.repairType}
                              </Badge>
                              <span className="text-sm text-foreground/70">
                                {new Date(log.date).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-medium text-foreground">{log.description}</h3>
                            {log.serviceProvider && (
                              <p className="text-sm text-foreground/70 mt-1">
                                Service Provider: {log.serviceProvider}
                              </p>
                            )}
                            {log.cost > 0 && (
                              <p className="text-sm text-foreground/70 mt-1">
                                Cost: ${log.cost.toFixed(2)}
                              </p>
                            )}
                            {log.notes && (
                              <p className="text-sm text-foreground/70 mt-2">
                                {log.notes}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteRepairLog(log._id)}
                            className="text-foreground/50 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Repair History</h3>
                    <p className="text-foreground/70 mb-4">
                      Track repairs, alterations, and upcycling to extend your garment's life
                    </p>
                    <Button onClick={() => setIsRepairDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Local Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Local Tailor & Cobbler Finder
                </CardTitle>
                <CardDescription>
                  Find local services that help maintain your clothing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
                    <Input
                      id="search-services"
                      placeholder="Search by name, service, or location..."
                      className="pl-10"
                      value={serviceFilter.search}
                      onChange={(e) => setServiceFilter({...serviceFilter, search: e.target.value})}
                      aria-label="Search service providers"
                    />
                  </div>
                  
                  <div className="w-full sm:w-48">
                    <Select 
                      value={serviceFilter.type} 
                      onValueChange={(value) => setServiceFilter({...serviceFilter, type: value})}
                    >
                      <SelectTrigger>
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="tailor">Tailors</SelectItem>
                        <SelectItem value="cobbler">Cobblers</SelectItem>
                        <SelectItem value="cleaner">Cleaners</SelectItem>
                        <SelectItem value="other">Other Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={fetchServiceProviders} variant="outline">
                    Search
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredServiceProviders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServiceProviders.map((provider) => (
                      <Card key={provider._id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{provider.name}</span>
                            <Badge variant="secondary" className="capitalize">
                              {provider.type}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.address}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{provider.rating.toFixed(1)}</span>
                                <span className="text-foreground/50">({provider.reviews} reviews)</span>
                              </div>
                            </div>
                            
                            {provider.phone && (
                              <div className="text-sm">
                                <span className="font-medium">Phone:</span> {provider.phone}
                              </div>
                            )}
                            
                            {provider.website && (
                              <div className="text-sm">
                                <span className="font-medium">Website:</span>{" "}
                                <a 
                                  href={provider.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {provider.website}
                                </a>
                              </div>
                            )}
                            
                            {provider.specialties.length > 0 && (
                              <div>
                                <span className="font-medium text-sm">Specialties:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {provider.specialties.map((spec, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Service Providers Found</h3>
                    <p className="text-foreground/70">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}