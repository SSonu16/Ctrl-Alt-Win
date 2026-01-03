import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, IndianRupee, Calendar, Hotel, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  distance: string;
}

interface DestinationDetailModalProps {
  destination: {
    name: string;
    state: string;
    image: string;
    rating: number;
    description?: string;
    bestTimeToVisit?: string;
    avgCost?: string;
    highlights?: string[];
    hotels?: Hotel[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const DestinationDetailModal = ({ destination, isOpen, onClose }: DestinationDetailModalProps) => {
  if (!destination) return null;

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
            {/* Hero Image */}
            <div className="relative h-48 md:h-64 flex-shrink-0">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-white text-sm">{destination.rating}</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                  {destination.name}
                </h2>
                <div className="flex items-center gap-1 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.state}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {destination.bestTimeToVisit && (
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Best Time</span>
                    </div>
                    <p className="font-medium text-foreground">{destination.bestTimeToVisit}</p>
                  </div>
                )}
                {destination.avgCost && (
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-sm">Avg. Cost/Day</span>
                    </div>
                    <p className="font-medium text-foreground">{destination.avgCost}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {destination.description && (
                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.description}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    Top Attractions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget-Friendly Hotels */}
              {destination.hotels && destination.hotels.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-primary" />
                    Budget-Friendly Stays
                  </h3>
                  <div className="space-y-3">
                    {destination.hotels.map((hotel, index) => (
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
                              {hotel.pricePerNight}
                            </p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-card">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
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

export default DestinationDetailModal;
