import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Calendar, Users, Star, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  distance: string;
}

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  placeName: string;
}

const HotelBookingModal = ({ isOpen, onClose, hotel, placeName }: HotelBookingModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
  });

  const handleBookOnAgoda = () => {
    const destination = encodeURIComponent(placeName);
    const checkIn = formData.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const guests = formData.guests || "2";
    const rooms = formData.rooms || "1";
    
    // Agoda hotel search URL
    const agodaUrl = `https://www.agoda.com/search?city=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${guests}&children=0`;
    
    toast({
      title: "Opening Agoda",
      description: `Searching hotels in ${placeName}...`,
    });
    
    window.open(agodaUrl, "_blank", "noopener,noreferrer");
  };

  const handleBookOnMakeMyTrip = () => {
    const destination = encodeURIComponent(placeName);
    const checkIn = formData.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const guests = formData.guests || "2";
    const rooms = formData.rooms || "1";
    
    // Format dates for MakeMyTrip (MMDDYYYY)
    const formatMMT = (dateStr: string) => {
      const [year, month, day] = dateStr.split("-");
      return `${month}${day}${year}`;
    };
    
    const makeMyTripUrl = `https://www.makemytrip.com/hotels/hotel-listing/?checkin=${formatMMT(checkIn)}&checkout=${formatMMT(checkOut)}&city=${destination}&country=IN&roomStayQualifier=${rooms}e${guests}e0e`;
    
    toast({
      title: "Opening MakeMyTrip",
      description: `Searching hotels in ${placeName}...`,
    });
    
    window.open(makeMyTripUrl, "_blank", "noopener,noreferrer");
  };

  const handleBookOnBooking = () => {
    const destination = encodeURIComponent(placeName + ", India");
    const checkIn = formData.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const guests = formData.guests || "2";
    const rooms = formData.rooms || "1";
    
    const bookingUrl = `https://www.booking.com/searchresults.html?ss=${destination}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=${rooms}&group_children=0`;
    
    toast({
      title: "Opening Booking.com",
      description: `Searching hotels in ${placeName}...`,
    });
    
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  const handleBookOnOyo = () => {
    const destination = encodeURIComponent(placeName);
    const checkIn = formData.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const oyoUrl = `https://www.oyorooms.com/search?location=${destination}&checkin=${checkIn}&checkout=${checkOut}`;
    
    toast({
      title: "Opening OYO Rooms",
      description: `Searching budget hotels in ${placeName}...`,
    });
    
    window.open(oyoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="w-5 h-5 text-primary" />
            Book Hotels in {placeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hotel Info if provided */}
          {hotel && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{hotel.name}</h3>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{placeName} • {hotel.distance}</p>
              <p className="text-lg font-bold text-primary">
                ₹{hotel.pricePerNight.toLocaleString("en-IN")} <span className="text-sm font-normal text-muted-foreground">per night</span>
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Guests</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rooms</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              />
            </div>
          </div>

          {/* Booking Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Book on Popular Sites</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleBookOnAgoda}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  <span className="font-bold">Agoda</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Best Deals <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleBookOnMakeMyTrip}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <span className="font-bold">MakeMyTrip</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Domestic Hotels <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleBookOnBooking}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"
                >
                  <span className="font-bold">Booking.com</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Global Selection <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleBookOnOyo}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500"
                >
                  <span className="font-bold">OYO Rooms</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Budget Stays <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Booking Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Compare prices across all platforms</li>
              <li>• Check for member-only discounts</li>
              <li>• Read recent reviews before booking</li>
              <li>• Look for free cancellation options</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelBookingModal;
