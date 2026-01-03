import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Camera,
  Share2,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Heart,
  Map,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import FeatureDetailModal from "@/components/FeatureDetailModal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  benefits: string[];
}

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: MapPin,
      title: "Multi-City Planning",
      description:
        "Plan trips across multiple cities with ease. Add stops, reorder destinations, and create the perfect route for your Indian adventure.",
      details: [
        "Add unlimited cities to your trip itinerary",
        "Drag and drop to reorder your destinations",
        "View distances and travel times between cities",
        "Get route suggestions for optimal travel",
      ],
      benefits: [
        "Save time with smart route optimization",
        "Never miss a must-see destination",
        "Flexible planning for any travel style",
        "Works offline once downloaded",
      ],
    },
    {
      icon: Calendar,
      title: "Smart Itineraries",
      description:
        "Build day-by-day itineraries with activities, timings, and locations. Drag and drop to reorganize your perfect schedule.",
      details: [
        "Create detailed day-by-day plans",
        "Add activities with time slots and duration",
        "Include locations, notes, and booking details",
        "Duplicate and modify existing itineraries",
      ],
      benefits: [
        "Stay organized throughout your trip",
        "Share plans with travel companions",
        "Quick access to reservations and bookings",
        "Automatic reminders for activities",
      ],
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description:
        "Track expenses in real-time with detailed breakdowns by category. Set budgets and get alerts when you're close to limits.",
      details: [
        "Set overall trip budget in INR",
        "Categorize expenses (food, transport, stay, activities)",
        "Track spending in real-time",
        "View charts and breakdowns",
      ],
      benefits: [
        "Never overspend on trips",
        "Understand your spending patterns",
        "Plan better for future trips",
        "Split costs with travel companions",
      ],
    },
    {
      icon: Camera,
      title: "Trip Photo Storage",
      description:
        "Store and organize photos for each trip. Create beautiful galleries and preserve your travel memories forever.",
      details: [
        "Upload photos directly from your device",
        "Organize photos by trip and day",
        "Add captions and location tags",
        "Create shareable photo galleries",
      ],
      benefits: [
        "All memories in one place",
        "Easy sharing with family and friends",
        "Secure cloud backup",
        "Access photos from any device",
      ],
    },
    {
      icon: Share2,
      title: "Share & Collaborate",
      description:
        "Share your itineraries with friends and family. Collaborate on trip planning and let others copy your perfect plans.",
      details: [
        "Generate shareable trip links",
        "Set view or edit permissions",
        "Real-time collaboration with co-travelers",
        "Allow others to copy your itineraries",
      ],
      benefits: [
        "Plan together, travel together",
        "Keep everyone on the same page",
        "Inspire others with your trips",
        "Get feedback before traveling",
      ],
    },
    {
      icon: Users,
      title: "Group Travel",
      description:
        "Plan trips with friends and family. Split costs, assign tasks, and keep everyone on the same page.",
      details: [
        "Create group trips with multiple members",
        "Assign tasks and responsibilities",
        "Track group expenses and split costs",
        "Group chat for coordination",
      ],
      benefits: [
        "Fair expense splitting",
        "Clear task assignments",
        "Reduced planning chaos",
        "Everyone stays informed",
      ],
    },
    {
      icon: Globe,
      title: "All India Coverage",
      description:
        "Explore destinations across all 28 states and 8 union territories. From Ladakh to Kerala, we've got India covered.",
      details: [
        "100+ destinations across India",
        "Detailed information for each place",
        "Best time to visit recommendations",
        "Local tips and hidden gems",
      ],
      benefits: [
        "Discover new places to explore",
        "Accurate local information",
        "Off-the-beaten-path suggestions",
        "Cultural insights and tips",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Access your trips on any device. Our responsive design works seamlessly on phones, tablets, and desktops.",
      details: [
        "Fully responsive web application",
        "Optimized for touch interactions",
        "Fast loading on mobile networks",
        "Add to home screen for quick access",
      ],
      benefits: [
        "Plan on the go",
        "Access trips from any device",
        "No app download required",
        "Seamless cross-device sync",
      ],
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is safe with us. We use industry-standard encryption to protect your travel plans and personal information.",
      details: [
        "End-to-end encryption for all data",
        "Secure authentication system",
        "Regular security audits",
        "GDPR compliant data handling",
      ],
      benefits: [
        "Peace of mind for your data",
        "Private trips stay private",
        "No selling of personal data",
        "Transparent privacy policy",
      ],
    },
    {
      icon: Zap,
      title: "Instant Sync",
      description:
        "Changes sync instantly across all devices. Never worry about losing your trip details or having outdated information.",
      details: [
        "Real-time synchronization",
        "Automatic conflict resolution",
        "Works across multiple devices",
        "Sync status indicators",
      ],
      benefits: [
        "Always up to date",
        "No manual syncing needed",
        "Collaborate in real-time",
        "Never lose your changes",
      ],
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description:
        "Save your favorite destinations, activities, and hotels. Quick access to places you love for future trips.",
      details: [
        "Bookmark any destination or activity",
        "Create custom lists and collections",
        "Quick add to new trips",
        "Personalized recommendations",
      ],
      benefits: [
        "Build your travel wishlist",
        "Quick trip planning",
        "Never forget great places",
        "Better recommendations over time",
      ],
    },
    {
      icon: Map,
      title: "Offline Access",
      description:
        "Download your itineraries for offline access. Stay on track even without internet connectivity.",
      details: [
        "Download complete trip details",
        "Access maps and directions offline",
        "View photos without internet",
        "Sync when back online",
      ],
      benefits: [
        "No internet worries while traveling",
        "Save mobile data",
        "Works in remote areas",
        "Always have your plans handy",
      ],
    },
  ];

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground">GlobeTrotter</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link to="/features" className="text-foreground font-medium">
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
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Plan
            <span className="hero-text-gradient block">Your Perfect Trip</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GlobeTrotter comes packed with powerful features to make your travel planning effortless and enjoyable. Click on any feature to learn more.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => handleFeatureClick(feature)}
              className="bg-card rounded-2xl p-6 border border-border card-hover cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <p className="text-sm text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to learn more →
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of travelers who plan their trips with GlobeTrotter.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="btn-gradient text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 GlobeTrotter India. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Features;
