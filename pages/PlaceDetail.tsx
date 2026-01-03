import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Plane,
  Building,
  CheckCircle,
  Activity,
  Wifi,
  Car,
  Coffee,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import { indianStates, type TouristPlace, type Hotel } from "@/data/indianDestinations";
import FlightSearchModal from "@/components/FlightSearchModal";
import HotelBookingModal from "@/components/HotelBookingModal";

const PlaceDetail = () => {
  const { stateId, placeId } = useParams();
  const navigate = useNavigate();
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Find the state and place
  const state = indianStates.find((s) => s.id === stateId);
  const place = state?.places.find((p) => p.id === placeId);

  if (!state || !place) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Place not found</h1>
          <Button onClick={() => navigate("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  // Generate hotels if not present
  const hotels: Hotel[] = place.hotels || [
    {
      name: `${place.name} Heritage Hotel`,
      rating: 4.5,
      pricePerNight: Math.round(place.avgCost / 3),
      amenities: ["WiFi", "Breakfast", "AC", "Room Service"],
      distance: "0.5 km from center",
    },
    {
      name: `Hotel Royal ${place.name}`,
      rating: 4.2,
      pricePerNight: Math.round(place.avgCost / 4),
      amenities: ["WiFi", "Parking", "Restaurant", "AC"],
      distance: "1 km from center",
    },
    {
      name: `${place.name} Inn`,
      rating: 3.8,
      pricePerNight: Math.round(place.avgCost / 5),
      amenities: ["WiFi", "AC", "TV"],
      distance: "1.5 km from center",
    },
    {
      name: `Budget Stay ${place.name}`,
      rating: 3.5,
      pricePerNight: Math.round(place.avgCost / 6),
      amenities: ["WiFi", "Fan", "Hot Water"],
      distance: "2 km from center",
    },
    {
      name: `${place.name} Guest House`,
      rating: 4.0,
      pricePerNight: Math.round(place.avgCost / 4.5),
      amenities: ["WiFi", "Breakfast", "Garden"],
      distance: "0.8 km from center",
    },
  ];

  // Generate airport info if not present
  const airport = place.airport || {
    name: `${state.capital} Airport`,
    code: state.capital.substring(0, 3).toUpperCase(),
    distance: `${Math.floor(Math.random() * 100) + 20} km`,
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ReactNode> = {
      WiFi: <Wifi className="w-3 h-3" />,
      Parking: <Car className="w-3 h-3" />,
      Breakfast: <Coffee className="w-3 h-3" />,
      Restaurant: <Utensils className="w-3 h-3" />,
    };
    return icons[amenity] || <CheckCircle className="w-3 h-3" />;
  };

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsHotelModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/explore")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="GlobeTrotter"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
                GlobeTrotter
              </span>
            </Link>
          </div>
          <Link to="/auth">
            <Button className="btn-gradient">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{state.name}, India</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="font-semibold">{place.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{place.bestTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>Avg. ₹{place.avgCost.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-xl font-semibold mb-3">
                About {place.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {place.description}
              </p>
            </motion.section>

            {/* Highlights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-xl font-semibold mb-4">
                Top Highlights
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {place.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Activities */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-xl font-semibold mb-4">
                Things to Do
              </h2>
              <div className="flex flex-wrap gap-2">
                {place.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <Activity className="w-3 h-3" />
                    {activity}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Hotels List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Nearby Hotels & Stays
              </h2>
              <div className="space-y-4">
                {hotels.map((hotel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs font-medium">
                            {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {hotel.distance}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-xs text-muted-foreground bg-background px-2 py-1 rounded"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 text-right">
                      <p className="text-lg font-bold text-primary">
                        ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">per night</p>
                      <Button
                        size="sm"
                        className="mt-2 btn-gradient"
                        onClick={() => handleBookHotel(hotel)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Airport Info */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                Nearest Airport
              </h2>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-1">
                  {airport.name}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Airport Code</span>
                  <span className="font-mono font-bold text-primary">
                    {airport.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium">{airport.distance}</span>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => setIsFlightModalOpen(true)}
              >
                <Plane className="w-4 h-4 mr-2" />
                Search Flights
              </Button>
            </motion.section>

            {/* Quick Info */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                Quick Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">State</span>
                  <span className="font-medium">{state.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium capitalize">{state.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Best Time</span>
                  <span className="font-medium text-sm text-right">
                    {place.bestTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg. Budget</span>
                  <span className="font-bold text-primary">
                    ₹{place.avgCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-6 border border-primary/30"
            >
              <h3 className="font-display text-lg font-semibold mb-2">
                Plan Your Trip
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a personalized itinerary for {place.name} with our AI
                planner.
              </p>
              <Link to="/trips/new">
                <Button className="w-full btn-gradient">Start Planning</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Flight Search Modal */}
      <FlightSearchModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        destinationAirport={airport}
      />

      {/* Hotel Booking Modal */}
      <HotelBookingModal
        isOpen={isHotelModalOpen}
        onClose={() => setIsHotelModalOpen(false)}
        hotel={selectedHotel}
        placeName={place.name}
      />
    </div>
  );
};

export default PlaceDetail;
