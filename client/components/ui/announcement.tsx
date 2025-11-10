import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface AnnouncementProps {
  announcements: {
    id: string;
    text: string;
    link?: string;
    linkText?: string;
  }[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

export function Announcement({
  announcements,
  autoRotate = true,
  rotationInterval = 5000,
  className = "",
}: AnnouncementProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoRotate || announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, announcements.length, rotationInterval]);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible || announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className={`bg-primary text-primary-foreground py-2 px-4 ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <button 
          onClick={handlePrev} 
          className="mr-2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex-1 flex items-center justify-center text-sm font-medium">
          <span>{currentAnnouncement.text}</span>
          {currentAnnouncement.link && (
            <a 
              href={currentAnnouncement.link} 
              className="ml-2 underline hover:text-primary-foreground/80 transition-colors"
            >
              {currentAnnouncement.linkText || "Learn more"}
            </a>
          )}
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={handleNext} 
            className="mr-2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
            aria-label="Close announcements"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}