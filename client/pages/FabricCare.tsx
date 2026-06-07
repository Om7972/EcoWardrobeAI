import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Droplets, 
  Sun, 
  Wind, 
  Thermometer, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Bell,
  RotateCcw,
  Shirt,
  Zap,
  Leaf,
  Award,
  X,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

interface FabricType {
  id: string;
  name: string;
  icon: string;
  careInstructions: string[];
  dryingMethod: string;
  ironingTemp: string;
  washTemp: string;
  detergentType: string;
  specialNotes: string[];
}

interface CareReminder {
  id: string;
  fabricId: string;
  fabricName: string;
  task: string;
  dueDate: Date;
  completed: boolean;
  frequency: "daily" | "weekly" | "monthly" | "as needed";
}

const fabricTypes: FabricType[] = [
  {
    id: "1",
    name: "Organic Cotton",
    icon: "🌿",
    careInstructions: [
      "Machine wash cold (30°C)",
      "Use gentle cycle",
      "Use mild, eco-friendly detergent",
      "Tumble dry low or air dry"
    ],
    dryingMethod: "Low heat or air dry",
    ironingTemp: "Medium heat",
    washTemp: "Cold (30°C)",
    detergentType: "Mild, eco-friendly",
    specialNotes: [
      "Avoid bleach",
      "Turn inside out before washing",
      "Remove promptly after wash to prevent wrinkles"
    ]
  },
  {
    id: "2",
    name: "Bamboo Fiber",
    icon: "🎍",
    careInstructions: [
      "Machine wash cold (30°C)",
      "Use gentle cycle",
      "Use mild detergent",
      "Hang to dry or low heat"
    ],
    dryingMethod: "Air dry or low heat",
    ironingTemp: "Low to medium heat",
    washTemp: "Cold (30°C)",
    detergentType: "Mild, biodegradable",
    specialNotes: [
      "Do not wring out",
      "Avoid fabric softeners",
      "Store in cool, dry place"
    ]
  },
  {
    id: "3",
    name: "Hemp",
    icon: "🌱",
    careInstructions: [
      "Machine wash cold (30°C)",
      "Use gentle cycle",
      "Use mild detergent",
      "Tumble dry low or air dry"
    ],
    dryingMethod: "Low heat or air dry",
    ironingTemp: "Medium heat",
    washTemp: "Cold (30°C)",
    detergentType: "Mild, eco-friendly",
    specialNotes: [
      "May shrink slightly on first wash",
      "Iron while slightly damp for best results",
      "Becomes softer with each wash"
    ]
  },
  {
    id: "4",
    name: "Recycled Polyester",
    icon: "♻️",
    careInstructions: [
      "Machine wash warm (40°C)",
      "Use regular cycle",
      "Use standard detergent",
      "Tumble dry medium heat"
    ],
    dryingMethod: "Medium heat",
    ironingTemp: "Low heat",
    washTemp: "Warm (40°C)",
    detergentType: "Standard eco-friendly",
    specialNotes: [
      "Avoid high heat to prevent melting",
      "Do not dry clean",
      "Remove lint regularly"
    ]
  },
  {
    id: "5",
    name: "Linen",
    icon: "🧵",
    careInstructions: [
      "Machine wash cold (30°C) or hand wash",
      "Use gentle cycle",
      "Use mild detergent",
      "Hang to dry"
    ],
    dryingMethod: "Air dry",
    ironingTemp: "High heat (while damp)",
    washTemp: "Cold (30°C)",
    detergentType: "Mild, eco-friendly",
    specialNotes: [
      "Iron while slightly damp for smooth finish",
      "Do not wring out",
      "Expect natural wrinkling (part of linen's charm)"
    ]
  }
];

const initialReminders: CareReminder[] = [
  {
    id: "101",
    fabricId: "1",
    fabricName: "Organic Cotton T-Shirt",
    task: "Wash inside out with cold water",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    completed: false,
    frequency: "weekly"
  },
  {
    id: "102",
    fabricId: "3",
    fabricName: "Hemp Jeans",
    task: "Air dry to maintain shape",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    completed: false,
    frequency: "weekly"
  },
  {
    id: "103",
    fabricId: "5",
    fabricName: "Linen Shirt",
    task: "Iron while slightly damp",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    completed: false,
    frequency: "as needed"
  }
];

export default function FabricCare() {
  const { user } = useAuth();
  const [selectedFabric, setSelectedFabric] = useState<FabricType | null>(null);
  const [reminders, setReminders] = useState<CareReminder[]>(initialReminders);
  const [showReminderDetail, setShowReminderDetail] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<CareReminder | null>(null);
  const [showCareTips, setShowCareTips] = useState(true);

  const toggleReminderCompletion = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed } 
          : reminder
      )
    );
  };

  const getFabricById = (id: string) => {
    return fabricTypes.find(fabric => fabric.id === id) || null;
  };

  const getUpcomingReminders = () => {
    return reminders
      .filter(reminder => !reminder.completed)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 3);
  };

  const getCompletedReminders = () => {
    return reminders.filter(reminder => reminder.completed);
  };

  const getSustainabilityImpact = () => {
    const completed = getCompletedReminders().length;
    const total = reminders.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-4">
          <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Droplets className="w-8 h-8 text-primary" />
              Smart Fabric Care
            </h1>
            <p className="text-foreground/70 mt-2">
              Eco-friendly care instructions for your sustainable wardrobe
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sustainability Impact */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Your Care Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className="text-sm font-bold text-green-600">{getSustainabilityImpact()}%</span>
                </div>
                <Progress value={getSustainabilityImpact()} className="mb-4" />
                <p className="text-sm text-foreground/70">
                  {getCompletedReminders().length} of {reminders.length} care tasks completed this week
                </p>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                    <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-foreground/70">Water Saved</p>
                    <p className="font-bold">120L</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg text-center">
                    <Zap className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-foreground/70">Energy Saved</p>
                    <p className="font-bold">8.5kWh</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                    <Award className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs text-foreground/70">Items Extended</p>
                    <p className="font-bold">7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Reminders */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Care Reminders
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                </CardTitle>
                <CardDescription>
                  Upcoming care tasks for your sustainable garments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getUpcomingReminders().length > 0 ? (
                  <div className="space-y-3">
                    {getUpcomingReminders().map((reminder) => {
                      const fabric = getFabricById(reminder.fabricId);
                      const daysUntil = Math.ceil(
                        (reminder.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <div 
                          key={reminder.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            setSelectedReminder(reminder);
                            setShowReminderDetail(true);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {fabric?.icon || "👕"}
                            </div>
                            <div>
                              <h4 className="font-medium">{reminder.task}</h4>
                              <p className="text-sm text-foreground/70">
                                {reminder.fabricName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={daysUntil <= 1 ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {daysUntil <= 0 ? "Due today" : `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReminderCompletion(reminder.id);
                              }}
                            >
                              {reminder.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
                    <p className="text-foreground/70">
                      No upcoming care reminders. Great job maintaining your wardrobe!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Fabric Care Guide */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-primary" />
                  Fabric Care Guide
                </CardTitle>
                <CardDescription>
                  Expert care instructions for sustainable fabrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fabricTypes.map((fabric) => (
                    <Card 
                      key={fabric.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedFabric(fabric)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{fabric.icon}</span>
                          <div>
                            <h4 className="font-medium">{fabric.name}</h4>
                            <p className="text-sm text-foreground/70">
                              {fabric.careInstructions.length} care tips
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Care Tips */}
            {showCareTips && (
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Eco Care Tips
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowCareTips(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      Cold Water Wash
                    </h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      Saves 90% of the energy used in washing and prevents shrinkage
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Wind className="w-4 h-4 text-green-500" />
                      Air Dry
                    </h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      Extends garment life by 2-3 years and saves energy
                    </p>
                  </div>
                  
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      Natural Stain Removal
                    </h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      Use lemon juice or baking soda instead of harsh chemicals
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Quick Actions */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shirt className="w-4 h-4 mr-2" />
                  Add New Garment
                </Button>
              </CardContent>
            </Card>
            
            {/* Seasonal Care */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-primary" />
                  Seasonal Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <h4 className="font-medium text-sm">Summer Care</h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      Use breathable storage for off-season items
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <h4 className="font-medium text-sm">Winter Preparation</h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      Deep clean winter coats before storage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Fabric Detail Modal */}
      <Dialog open={!!selectedFabric} onOpenChange={() => setSelectedFabric(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFabric && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedFabric.icon}</span>
                  {selectedFabric.name} Care Guide
                </DialogTitle>
                <DialogDescription>
                  Expert care instructions to extend the life of your {selectedFabric.name} garments
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      Washing
                    </h4>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Temperature:</span> {selectedFabric.washTemp}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Detergent:</span> {selectedFabric.detergentType}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-500/10 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      Drying
                    </h4>
                    <p className="text-sm mt-2">{selectedFabric.dryingMethod}</p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-green-500" />
                      Ironing
                    </h4>
                    <p className="text-sm mt-2">{selectedFabric.ironingTemp}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-500" />
                      Special Notes
                    </h4>
                    <ul className="text-sm mt-2 space-y-1">
                      {selectedFabric.specialNotes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Step-by-Step Care Instructions</h4>
                  <ol className="space-y-3">
                    {selectedFabric.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mt-0.5">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                  <Button variant="outline">
                    Save Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reminder Detail Modal */}
      <Dialog open={showReminderDetail} onOpenChange={setShowReminderDetail}>
        <DialogContent className="max-w-md">
          {selectedReminder && (
            <>
              <DialogHeader>
                <DialogTitle>Care Reminder</DialogTitle>
                <DialogDescription>
                  Details for your fabric care task
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <span className="text-2xl">
                    {getFabricById(selectedReminder.fabricId)?.icon || "👕"}
                  </span>
                  <div>
                    <h4 className="font-medium">{selectedReminder.task}</h4>
                    <p className="text-sm text-foreground/70">
                      {selectedReminder.fabricName}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs text-foreground/70">Due Date</p>
                    <p className="font-medium">
                      {selectedReminder.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs text-foreground/70">Frequency</p>
                    <p className="font-medium capitalize">
                      {selectedReminder.frequency}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-blue-500" />
                    Care Instructions
                  </h4>
                  <p className="text-sm text-foreground/70 mt-1">
                    {getFabricById(selectedReminder.fabricId)?.careInstructions[0] || 
                     "Follow standard care instructions for this fabric type"}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant={selectedReminder.completed ? "outline" : "default"}
                    onClick={() => toggleReminderCompletion(selectedReminder.id)}
                  >
                    {selectedReminder.completed ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Mark Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Remind Me
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}