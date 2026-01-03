import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, Calendar, DollarSign, Users, Star, ArrowRight, Plane, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FeatureDetailModal from "@/components/FeatureDetailModal";
import heroImage from "@/assets/hero-india.jpg";
import jaipurDest from "@/assets/destination-jaipur.jpg";
import keralaDest from "@/assets/destination-kerala.jpg";
import varanasiDest from "@/assets/destination-varanasi.jpg";
import logo from "@/assets/logo.jpg";

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: MapPin,
      title: "Multi-City Planning",
      description: "Plan trips across multiple cities in India with ease. Add stops, reorder, and create the perfect route.",
      details: [
        "Add multiple destinations to your trip",
        "Drag and drop to reorder your route",
        "Get optimized travel routes between cities",
        "Save and share your custom itinerary"
      ],
      benefits: ["Save time on route planning", "Discover hidden gems along the way", "Optimize travel time and costs"]
    },
    {
      icon: Calendar,
      title: "Smart Itineraries",
      description: "Build day-by-day itineraries with activities, timings, and locations all in one place.",
      details: [
        "Create daily activity schedules",
        "Set times and durations for each activity",
        "Add notes and important details",
        "Get reminder notifications"
      ],
      benefits: ["Never miss an attraction", "Balance rest and exploration", "Share plans with travel companions"]
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description: "Keep track of your travel expenses in INR with detailed cost breakdowns and alerts.",
      details: [
        "Set your total trip budget",
        "Log expenses by category",
        "Track spending in real-time",
        "Get alerts when approaching limits"
      ],
      benefits: ["Stay within budget", "Identify spending patterns", "Plan future trips better"]
    },
    {
      icon: Users,
      title: "Share & Collaborate",
      description: "Share your trips publicly or collaborate with travel companions in real-time.",
      details: [
        "Invite friends to collaborate",
        "Edit itineraries together",
        "Share public trip links",
        "Export and print your plans"
      ],
      benefits: ["Plan group trips easily", "Get input from travel buddies", "Inspire others with your journeys"]
    },
  ];

  const destinations = [
    { 
      name: "Jaipur", 
      state: "Rajasthan",
      stateId: "rajasthan",
      placeId: "jaipur",
      image: jaipurDest, 
      rating: 4.9,
    },
    { 
      name: "Kerala", 
      state: "God's Own Country",
      stateId: "kerala",
      placeId: "alleppey",
      image: keralaDest, 
      rating: 4.8,
    },
    { 
      name: "Varanasi", 
      state: "Uttar Pradesh",
      stateId: "uttar-pradesh",
      placeId: "varanasi",
      image: varanasiDest, 
      rating: 4.7,
    },
  ];

  const handleDestinationClick = (stateId: string, placeId: string) => {
    navigate(`/explore/${stateId}/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground">GlobeTrotter</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:flex">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="btn-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Taj Mahal at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Plane className="w-4 h-4" />
                Explore Incredible India
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Discover
                <span className="hero-text-gradient block">Incredible India</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                From the Himalayas to Kerala backwaters, plan your perfect Indian adventure. 
                GlobeTrotter makes exploring India effortless and exciting.
              </p>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 text-lg bg-background/80 backdrop-blur-sm"
                  />
                </div>
                <Button type="submit" size="lg" className="btn-gradient px-6">
                  Search
                </Button>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="btn-gradient text-lg px-8 py-6 w-full sm:w-auto">
                    Start Planning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                    Explore Destinations
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-20 right-10 md:right-32 glass-card p-4 rounded-2xl hidden lg:block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">29 States</p>
              <p className="text-sm text-muted-foreground">Ready to explore</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you plan, organize, and enjoy your Indian travels without the stress.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card rounded-2xl p-8 card-hover border border-border cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Popular Destinations
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore trending destinations across India.
              </p>
            </div>
            <Link to="/explore" className="mt-4 md:mt-0">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                className="group relative rounded-3xl overflow-hidden card-hover cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => handleDestinationClick(dest.stateId, dest.placeId)}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-primary-foreground text-sm">{dest.rating}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                    {dest.name}
                  </h3>
                  <p className="text-primary-foreground/80">{dest.state}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Explore India?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who use GlobeTrotter to plan unforgettable Indian adventures.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="btn-accent-gradient text-lg px-8 py-6">
                Create Your Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="GlobeTrotter" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-display text-xl font-bold text-primary-foreground">GlobeTrotter India</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                Contact
              </Link>
            </div>
            <p className="text-primary-foreground/50 text-sm">
              © 2025 GlobeTrotter India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  );
};

export default Index;
