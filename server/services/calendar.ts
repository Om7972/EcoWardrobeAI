import axios from "axios";

// Ensure dotenv is loaded
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
const GOOGLE_CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  eventType: 'work' | 'social' | 'formal' | 'casual' | 'exercise' | 'other';
}

export interface OutfitSuggestion {
  event: CalendarEvent;
  suggestion: string;
  keyPieces: string[];
  styleNotes: string[];
  sustainabilityTip: string;
}

class CalendarService {
  private isConfigured(): boolean {
    return Boolean(GOOGLE_CALENDAR_API_KEY);
  }

  private buildMockEvents(): CalendarEvent[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    return [
      {
        id: 'mock-1',
        title: 'Team Meeting',
        description: 'Weekly team sync',
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        end: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
        location: 'Office Conference Room',
        eventType: 'work'
      },
      {
        id: 'mock-2',
        title: 'Coffee with Sarah',
        description: 'Catch up over coffee',
        start: tomorrow,
        end: new Date(tomorrow.getTime() + 90 * 60 * 1000), // 1.5 hours
        location: 'Local Café',
        eventType: 'social'
      },
      {
        id: 'mock-3',
        title: 'Yoga Class',
        description: 'Evening yoga session',
        start: new Date(dayAfter.getTime() + 18 * 60 * 60 * 1000), // 6 PM day after
        end: new Date(dayAfter.getTime() + 19.5 * 60 * 60 * 1000), // 7:30 PM
        location: 'Wellness Studio',
        eventType: 'exercise'
      }
    ];
  }

  private categorizeEvent(event: any): 'work' | 'social' | 'formal' | 'casual' | 'exercise' | 'other' {
    const title = event.summary?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const location = event.location?.toLowerCase() || '';

    const text = `${title} ${description} ${location}`;

    if (text.includes('meeting') || text.includes('work') || text.includes('office') || 
        text.includes('conference') || text.includes('presentation')) {
      return 'work';
    }
    
    if (text.includes('dinner') || text.includes('gala') || text.includes('wedding') || 
        text.includes('formal') || text.includes('ceremony')) {
      return 'formal';
    }
    
    if (text.includes('gym') || text.includes('yoga') || text.includes('workout') || 
        text.includes('exercise') || text.includes('fitness') || text.includes('run')) {
      return 'exercise';
    }
    
    if (text.includes('coffee') || text.includes('lunch') || text.includes('friends') || 
        text.includes('social') || text.includes('party')) {
      return 'social';
    }

    return 'casual';
  }

  async getCalendarEvents(
    calendarId: string = 'primary',
    days: number = 7
  ): Promise<CalendarEvent[]> {
    if (!this.isConfigured()) {
      console.warn("Google Calendar API key not configured. Returning mock events.");
      return this.buildMockEvents();
    }

    try {
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      const response = await axios.get(
        `${GOOGLE_CALENDAR_BASE_URL}/calendars/${calendarId}/events`,
        {
          params: {
            key: GOOGLE_CALENDAR_API_KEY,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 50
          }
        }
      );

      return response.data.items.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled Event',
        description: event.description,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        location: event.location,
        attendees: event.attendees?.map((a: any) => a.email) || [],
        eventType: this.categorizeEvent(event)
      }));
    } catch (error: any) {
      console.error("Calendar API Error:", error.message);
      return this.buildMockEvents();
    }
  }

  generateOutfitSuggestionForEvent(event: CalendarEvent): OutfitSuggestion {
    const suggestions: { [key: string]: any } = {
      work: {
        suggestion: "Professional and polished look that commands respect while staying comfortable",
        keyPieces: ["tailored blazer", "crisp button-down shirt", "well-fitted trousers or pencil skirt", "closed-toe shoes"],
        styleNotes: [
          "Stick to neutral colors like navy, black, gray, or white",
          "Ensure clothes are wrinkle-free and well-pressed",
          "Keep accessories minimal and professional",
          "Choose comfortable shoes for long days"
        ],
        sustainabilityTip: "Invest in quality basics that can be mixed and matched for multiple professional looks"
      },
      formal: {
        suggestion: "Elegant and sophisticated attire appropriate for special occasions",
        keyPieces: ["dress or formal suit", "dress shoes", "elegant accessories", "appropriate outerwear"],
        styleNotes: [
          "Consider the dress code and venue",
          "Choose fabrics like silk, wool, or high-quality cotton",
          "Pay attention to fit and tailoring",
          "Coordinate accessories thoughtfully"
        ],
        sustainabilityTip: "Choose timeless pieces that can be worn to multiple formal events, or consider renting for one-time occasions"
      },
      social: {
        suggestion: "Relaxed yet put-together look that's perfect for socializing",
        keyPieces: ["comfortable top", "well-fitted jeans or casual pants", "versatile jacket or cardigan", "comfortable shoes"],
        styleNotes: [
          "Balance comfort with style",
          "Add personality through accessories or colors",
          "Consider the venue and activity",
          "Layer for temperature changes"
        ],
        sustainabilityTip: "Mix high and low pieces, and don't be afraid to repeat favorite outfits with different styling"
      },
      exercise: {
        suggestion: "Functional activewear that supports your workout while looking great",
        keyPieces: ["moisture-wicking top", "supportive sports bra", "comfortable leggings or shorts", "athletic shoes"],
        styleNotes: [
          "Prioritize function over fashion",
          "Choose breathable, stretchy fabrics",
          "Ensure proper fit for movement",
          "Consider the type of exercise"
        ],
        sustainabilityTip: "Invest in quality activewear that will last through many workouts, and choose versatile pieces that work for multiple activities"
      },
      casual: {
        suggestion: "Effortless and comfortable look for everyday activities",
        keyPieces: ["comfortable top", "casual bottoms", "versatile shoes", "light jacket or sweater"],
        styleNotes: [
          "Focus on comfort and ease of movement",
          "Choose pieces that reflect your personal style",
          "Consider the weather and activities planned",
          "Keep it simple but intentional"
        ],
        sustainabilityTip: "Build a capsule wardrobe of versatile casual pieces that can be mixed and matched endlessly"
      }
    };

    const eventSuggestion = suggestions[event.eventType] || suggestions.casual;

    return {
      event,
      suggestion: `For "${event.title}": ${eventSuggestion.suggestion}`,
      keyPieces: eventSuggestion.keyPieces,
      styleNotes: eventSuggestion.styleNotes,
      sustainabilityTip: eventSuggestion.sustainabilityTip
    };
  }

  async getEventBasedOutfitSuggestions(
    calendarId: string = 'primary',
    days: number = 7
  ): Promise<OutfitSuggestion[]> {
    const events = await this.getCalendarEvents(calendarId, days);
    
    return events.map(event => this.generateOutfitSuggestionForEvent(event));
  }

  async getUpcomingEventSuggestion(
    calendarId: string = 'primary'
  ): Promise<OutfitSuggestion | null> {
    const events = await this.getCalendarEvents(calendarId, 1);
    
    if (events.length === 0) {
      return null;
    }

    // Get the next upcoming event
    const nextEvent = events.sort((a, b) => a.start.getTime() - b.start.getTime())[0];
    
    return this.generateOutfitSuggestionForEvent(nextEvent);
  }

  formatOutfitSuggestionText(suggestion: OutfitSuggestion): string {
    const { event, suggestion: suggestionText, keyPieces, styleNotes, sustainabilityTip } = suggestion;
    
    const eventTime = event.start.toLocaleString();
    const location = event.location ? ` at ${event.location}` : '';

    return [
      `📅 Event: ${event.title}`,
      `🕐 Time: ${eventTime}${location}`,
      `👗 Style: ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}`,
      '',
      `💡 Suggestion: ${suggestionText}`,
      '',
      '🎯 Key Pieces:',
      ...keyPieces.map(piece => `• ${piece}`),
      '',
      '✨ Style Notes:',
      ...styleNotes.map(note => `• ${note}`),
      '',
      `🌱 Sustainability Tip: ${sustainabilityTip}`
    ].join('\n');
  }

  async getDailyOutfitPlanning(
    calendarId: string = 'primary',
    targetDate?: Date
  ): Promise<{
    date: string;
    events: CalendarEvent[];
    overallSuggestion: string;
    outfitSuggestions: OutfitSuggestion[];
  }> {
    const date = targetDate || new Date();
    const dateStr = date.toDateString();
    
    // Get events for the specific day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const allEvents = await this.getCalendarEvents(calendarId, 7);
    const dayEvents = allEvents.filter(event => 
      event.start >= startOfDay && event.start <= endOfDay
    );

    const outfitSuggestions = dayEvents.map(event => 
      this.generateOutfitSuggestionForEvent(event)
    );

    // Generate overall suggestion based on all events
    let overallSuggestion = "It looks like a free day! Choose comfortable, versatile pieces that make you feel confident.";
    
    if (dayEvents.length > 0) {
      const eventTypes = [...new Set(dayEvents.map(e => e.eventType))];
      
      if (eventTypes.length === 1) {
        overallSuggestion = `You have ${dayEvents.length} ${eventTypes[0]} event${dayEvents.length > 1 ? 's' : ''} today. Plan an outfit that works well for ${eventTypes[0]} activities.`;
      } else {
        overallSuggestion = `You have a mixed day with ${eventTypes.join(', ')} events. Consider layering pieces that can transition between different dress codes, or plan outfit changes if needed.`;
      }
    }

    return {
      date: dateStr,
      events: dayEvents,
      overallSuggestion,
      outfitSuggestions
    };
  }
}

export const calendarService = new CalendarService();