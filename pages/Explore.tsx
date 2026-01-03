import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpg";
import { indianStates, getAllPlaces, type TouristPlace } from "@/data/indianDestinations";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [expandedStates, setExpandedStates] = useState<string[]>([]);
  const navigate = useNavigate();

  // Update search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const regions = [
    { id: "all", name: "All India" },
    { id: "north", name: "North" },
    { id: "south", name: "South" },
    { id: "east", name: "East" },
    { id: "west", name: "West" },
    { id: "central", name: "Central" },
    { id: "northeast", name: "Northeast" },
  ];

  const toggleState = (stateId: string) => {
    setExpandedStates((prev) =>
      prev.includes(stateId)
        ? prev.filter((id) => id !== stateId)
        : [...prev, stateId]
    );
  };

  const handlePlaceClick = (stateId: string, placeId: string) => {
    navigate(`/explore/${stateId}/${placeId}`);
  };

  const filteredStates = indianStates.filter((state) => {
    const matchesRegion = selectedRegion === "all" || state.region === selectedRegion;
    
    if (!searchQuery) return matchesRegion;
    
    const lowerQuery = searchQuery.toLowerCase();
    const stateMatches = state.name.toLowerCase().includes(lowerQuery);
    const placesMatch = state.places.some(
      (place) =>
        place.name.toLowerCase().includes(lowerQuery) ||
        place.description.toLowerCase().includes(lowerQuery)
    );
    
    return matchesRegion && (stateMatches || placesMatch);
  });

  // Filter places within each state based on search
  const getFilteredPlaces = (state: typeof indianStates[0]) => {
    if (!searchQuery) return state.places;
    
    const lowerQuery = searchQuery.toLowerCase();
    return state.places.filter(
      (place) =>
        place.name.toLowerCase().includes(lowerQuery) ||
        place.description.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
          <Link to="/auth">
            <Button className="btn-gradient">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore India
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover amazing destinations across all 28 states and 8 union territories of Incredible India.
          </p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search states, cities, attractions..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={selectedRegion === region.id ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region.id)}
                  className={selectedRegion === region.id ? "btn-gradient" : ""}
                  size="sm"
                >
                  {region.name}
                </Button>
              ))}
            </div>
          </div>

          {/* States & Places */}
          <div className="space-y-4">
            {filteredStates.map((state, stateIndex) => {
              const isExpanded = expandedStates.includes(state.id);
              const filteredPlaces = getFilteredPlaces(state);
              
              return (
                <motion.div
                  key={state.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stateIndex * 0.05, duration: 0.4 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* State Header */}
                  <button
                    onClick={() => toggleState(state.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={state.image}
                      alt={state.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        {state.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredPlaces.length} tourist destinations • Capital: {state.capital}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                        {state.region}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Places Grid */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {filteredPlaces.map((place, placeIndex) => (
                          <motion.div
                            key={place.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: placeIndex * 0.05 }}
                            onClick={() => handlePlaceClick(state.id, place.id)}
                            className="bg-muted/50 rounded-xl overflow-hidden border border-border/50 card-hover cursor-pointer group"
                          >
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-2 right-2 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 text-warning fill-warning" />
                                <span className="text-xs font-medium">{place.rating}</span>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                                {place.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {place.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {place.bestTime}
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                  ₹{place.avgCost.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filteredStates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No destinations found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>

    </div>
  );
};

export default Explore;
