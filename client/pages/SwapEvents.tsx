import { useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Share2, 
  Filter,
  Search,
  Plus,
  Clock,
  Star,
  CheckCircle,
  X,
  Globe,
  Home,
  Shirt,
  Recycle
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";

interface SwapEvent {
  id: string;
  title: string;
  description: string;
  type: "swap" | "donation";
  date: Date;
  location: string;
  coordinates: { lat: number; lng: number };
  organizer: string;
  participants: number;
  capacity: number;
  tags: string[];
  rsvpStatus: "going" | "interested" | "not-going" | null;
}

const mockEvents: SwapEvent[] = [
  {
    id: "1",
    title: "Summer Wardrobe Swap",
    description: "Swap your gently used summer clothes for something new-to-you!",
    type: "swap",
    date: new Date(2024, 10, 15, 14, 0),
    location: "Central Park Community Center",
    coordinates: { lat: 40.7812, lng: -73.9665 },
    organizer: "EcoFashion Circle",
    participants: 24,
    capacity: 30,
    tags: ["summer", "casual", "community"],
    rsvpStatus: "going"
  },
  {
    id: "2",
    title: "Winter Coat Donation Drive",
    description: "Donate your gently used winter coats to those in need",
    type: "donation",
    date: new Date(2024, 10, 22, 10, 0),
    location: "Downtown Shelter",
    coordinates: { lat: 40.7580, lng: -73.9855 },
    organizer: "Helping Hands",
    participants: 18,
    capacity: 50,
    tags: ["winter", "coats", "charity"],
    rsvpStatus: "interested"
  },
  {
    id: "3",
    title: "Kids Clothing Swap",
    description: "Outgrow your kids' clothes? Swap them for the next size up!",
    type: "swap",
    date: new Date(2024, 11, 5, 11, 0),
    location: "Riverside Community Hall",
    coordinates: { lat: 40.7987, lng: -73.9598 },
    organizer: "Parent Eco Circle",
    participants: 15,
    capacity: 25,
    tags: ["kids", "family", "growing"],
    rsvpStatus: null
  },
  {
    id: "4",
    title: "Formal Wear Exchange",
    description: "Swap formal wear for weddings, galas, and special events",
    type: "swap",
    date: new Date(2024, 11, 12, 18, 0),
    location: "Art Gallery Downtown",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    organizer: "Sustainable Socialites",
    participants: 12,
    capacity: 20,
    tags: ["formal", "events", "luxury"],
    rsvpStatus: null
  },
  {
    id: "5",
    title: "Accessories & Bags Swap",
    description: "Trade handbags, scarves, jewelry, and other accessories",
    type: "swap",
    date: new Date(2024, 11, 19, 15, 0),
    location: "Library Community Room",
    coordinates: { lat: 40.7282, lng: -73.9942 },
    organizer: "Accessory Enthusiasts",
    participants: 8,
    capacity: 15,
    tags: ["accessories", "bags", "jewelry"],
    rsvpStatus: null
  }
];

const eventTypes = [
  { id: "all", name: "All Events", icon: Globe },
  { id: "swap", name: "Clothing Swaps", icon: Recycle },
  { id: "donation", name: "Donation Drives", icon: Heart }
];

export default function SwapEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SwapEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<SwapEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "swap" as "swap" | "donation",
    date: "",
    time: "",
    location: "",
    capacity: 20,
    tags: [] as string[]
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || event.type === selectedType;
    
    const matchesDate = !selectedDate || 
                        event.date.toDateString() === new Date(selectedDate).toDateString();
    
    const matchesRsvp = rsvpFilter === "all" || 
                        (rsvpFilter === "rsvp" && event.rsvpStatus !== null) ||
                        (rsvpFilter === "going" && event.rsvpStatus === "going");
    
    return matchesSearch && matchesType && matchesDate && matchesRsvp;
  });

  const handleRSVP = (eventId: string, status: "going" | "interested" | "not-going") => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, rsvpStatus: status } 
          : event
      )
    );
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      alert("Please fill in all required fields");
      return;
    }

    const eventDate = new Date(`${newEvent.date}T${newEvent.time}`);
    
    const event: SwapEvent = {
      id: (events.length + 1).toString(),
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      date: eventDate,
      location: newEvent.location,
      coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates
      organizer: user?.name || "You",
      participants: 1,
      capacity: newEvent.capacity,
      tags: newEvent.tags,
      rsvpStatus: "going"
    };

    setEvents([event, ...events]);
    setShowCreateEvent(false);
    setNewEvent({
      title: "",
      description: "",
      type: "swap",
      date: "",
      time: "",
      location: "",
      capacity: 20,
      tags: []
    });
  };

  const getUpcomingEvents = () => {
    return [...events]
      .filter(event => event.date > new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              Swap & Donation Events
            </h1>
            <p className="text-foreground/70 mt-2">
              Find and join sustainable fashion events in your community
            </p>
          </div>
          
          <Button onClick={() => setShowCreateEvent(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <Select value={rsvpFilter} onValueChange={setRsvpFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="RSVP status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="rsvp">My RSVPs</SelectItem>
                      <SelectItem value="going">Going</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full md:w-auto"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="border-border/50 shadow-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetail(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`w-3 rounded-full ${
                          event.type === "swap" ? "bg-green-500" : "bg-blue-500"
                        }`}></div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <Badge 
                              variant={event.type === "swap" ? "default" : "secondary"}
                            >
                              {event.type === "swap" ? "Swap" : "Donation"}
                            </Badge>
                          </div>
                          
                          <p className="text-foreground/70 text-sm mt-1">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {event.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">
                              {event.participants}/{event.capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span className="text-sm">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {event.rsvpStatus === "going" && (
                            <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Going
                            </Badge>
                          )}
                          {event.rsvpStatus === "interested" && (
                            <Badge variant="outline">
                              Interested
                            </Badge>
                          )}
                          
                          {!event.rsvpStatus && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRSVP(event.id, "going");
                              }}
                            >
                              RSVP
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
                    <p className="text-foreground/70 mb-4">
                      Try adjusting your filters or create a new event
                    </p>
                    <Button onClick={() => setShowCreateEvent(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>
                  Events happening soon in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getUpcomingEvents().map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetail(true);
                    }}
                  >
                    <div className={`w-2 rounded-full mt-2 ${
                      event.type === "swap" ? "bg-green-500" : "bg-blue-500"
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-foreground/70 mt-1">
                        {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Map Preview */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Event Map
                </CardTitle>
                <CardDescription>
                  Locations of upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-foreground/70">
                      Interactive map showing event locations
                    </p>
                    <Button size="sm" className="mt-2">
                      View Full Map
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Clothing Swap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Donation Drive</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Event Tips */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Event Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">What to Bring</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Clean, gently used items in good condition
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">RSVP Early</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Many events have limited capacity
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Bring Bags</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                  Take home your new treasures
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Event Detail Modal */}
      <Dialog open={showEventDetail} onOpenChange={setShowEventDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedEvent.title}</span>
                  <Badge 
                    variant={selectedEvent.type === "swap" ? "default" : "secondary"}
                  >
                    {selectedEvent.type === "swap" ? "Swap" : "Donation"}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedEvent.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Date & Time
                    </h4>
                    <p className="mt-2">
                      {selectedEvent.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-foreground/70">
                      {selectedEvent.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h4>
                    <p className="mt-2">{selectedEvent.location}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Get Directions
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Participants
                    </h4>
                    <p className="mt-2">
                      {selectedEvent.participants} of {selectedEvent.capacity} spots filled
                    </p>
                    <Progress 
                      value={(selectedEvent.participants / selectedEvent.capacity) * 100} 
                      className="mt-2" 
                    />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Rating
                    </h4>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < 5
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-foreground/20"
                          }`}
                        />
                      ))}
                      <span className="ml-2">4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Organizer</h4>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="bg-muted aspect-square w-12 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-foreground/30" />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedEvent.organizer}</h4>
                      <p className="text-sm text-foreground/70">Event Organizer</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className={selectedEvent.rsvpStatus === "going" ? "bg-green-500 hover:bg-green-600" : ""}
                    onClick={() => handleRSVP(selectedEvent.id, "going")}
                  >
                    {selectedEvent.rsvpStatus === "going" ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Going
                      </>
                    ) : (
                      "RSVP as Going"
                    )}
                  </Button>
                  <Button 
                    variant={selectedEvent.rsvpStatus === "interested" ? "default" : "outline"}
                    onClick={() => handleRSVP(selectedEvent.id, "interested")}
                  >
                    {selectedEvent.rsvpStatus === "interested" ? "Interested" : "Interested"}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Event Modal */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Organize a clothing swap or donation drive in your community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g., Summer Wardrobe Swap"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Event Type *</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value) => setNewEvent({...newEvent, type: value as "swap" | "donation"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="swap">
                      <div className="flex items-center gap-2">
                        <Recycle className="w-4 h-4" />
                        Clothing Swap
                      </div>
                    </SelectItem>
                    <SelectItem value="donation">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Donation Drive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Describe your event..."
                className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="e.g., Community Center, 123 Main St"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value) || 20})}
                  min="1"
                />
              </div>
              
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["summer", "winter", "kids", "formal", "casual", "accessories"].map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => {
                        if (!newEvent.tags.includes(tag)) {
                          setNewEvent({...newEvent, tags: [...newEvent.tags, tag]});
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newEvent.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="cursor-pointer"
                      onClick={() => {
                        setNewEvent({...newEvent, tags: newEvent.tags.filter(t => t !== tag)});
                      }}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple Progress component since it's not in the imports
function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary rounded-full" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}