import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Star, Calendar, DollarSign, Heart, Plus, Hotel, IndianRupee, Phone, ExternalLink, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TouristPlace } from "@/data/indianDestinations";

// Sample hotels data generator based on place cost
const generateHotels = (placeName: string, avgCost: number) => {
  const basePrice = Math.round(avgCost / 10);
  return [
    {
      name: `${placeName} Budget Stay`,
      rating: 4.2,
      pricePerNight: Math.round(basePrice * 0.5),
      amenities: ["Free WiFi", "AC", "Breakfast"],
      distance: "1.5 km"
    },
    {
      name: `Zostel ${placeName}`,
      rating: 4.4,
      pricePerNight: Math.round(basePrice * 0.4),
      amenities: ["Free WiFi", "Cafe", "Tours"],
      distance: "2.0 km"
    },
    {
      name: `Hotel ${placeName} Inn`,
      rating: 4.3,
      pricePerNight: Math.round(basePrice * 0.8),
      amenities: ["Restaurant", "Parking", "Room Service"],
      distance: "0.8 km"
    },
  ];
};

interface PlaceDetailModalProps {
  place: (TouristPlace & { stateName: string }) | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlaceDetailModal = ({ place, isOpen, onClose }: PlaceDetailModalProps) => {
  if (!place) return null;

  const hotels = place.hotels || generateHotels(place.name, place.avgCost);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-card rounded-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-48 md:h-56 flex-shrink-0">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Rating Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{place.rating}</span>
              </div>

              {/* Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                  {place.name}
                </h2>
                <p className="text-white/80 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {place.stateName}, India
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">From ₹{place.avgCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{place.bestTime}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Top Attractions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Things to Do
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {place.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearest Airport */}
              {place.airport && (
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Nearest Airport
                  </h3>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{place.airport.name}</h4>
                        <p className="text-sm text-muted-foreground">Code: {place.airport.code}</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {place.airport.distance} away
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget-Friendly Hotels */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-primary" />
                  Budget-Friendly Stays
                </h3>
                <div className="space-y-3">
                  {hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="bg-secondary/30 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{hotel.name}</h4>
                          <p className="text-sm text-muted-foreground">{hotel.distance} from center</p>
                        </div>
                        <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {hotel.pricePerNight.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-card">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Agent
                </Button>
                <Button className="flex-1 btn-gradient">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailModal;
