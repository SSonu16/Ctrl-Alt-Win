import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Upload,
  MapPin,
  X,
  DollarSign,
  Sparkles,
  Plane,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTrips } from "@/hooks/useTrips";
import logo from "@/assets/logo.jpg";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { createTrip } = useTrips();
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    budget: "",
  });
  const [autoGenerateItinerary, setAutoGenerateItinerary] = useState(true);
  const [showBookingOptions, setShowBookingOptions] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error, data } = await createTrip({
      name: formData.name,
      description: formData.description || undefined,
      start_date: formData.startDate,
      end_date: formData.endDate,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      cover_url: coverPreview || undefined,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trip Created! 🎉",
      description: autoGenerateItinerary 
        ? `Your trip "${formData.name}" has been created. Generating AI itinerary...`
        : `Your trip "${formData.name}" has been created successfully.`,
    });
    
    // Navigate to trip detail page with flags for auto-generation and booking
    navigate(`/trips/${data.id}`, { 
      state: { 
        autoGenerateItinerary, 
        showBookingOptions 
      } 
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Plan a New Trip
          </h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to start planning your adventure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Photo */}
            <div className="space-y-2">
              <Label>Cover Photo (Optional)</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-colors ${
                  coverPreview ? "border-transparent" : "border-border hover:border-primary/50"
                }`}
              >
                {coverPreview ? (
                  <div className="relative aspect-video">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverPreview(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-foreground/80 hover:bg-foreground rounded-full flex items-center justify-center text-primary-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <span className="text-muted-foreground">Click to upload a cover photo</span>
                    <span className="text-sm text-muted-foreground/70 mt-1">
                      JPG, PNG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Trip Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Trip Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Rajasthan Royal Tour"
                className="h-12"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10 h-12"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10 h-12"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 50000"
                  className="pl-10 h-12"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your trip plans, goals, or any notes..."
                className="min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* AI Assistance Options */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">AI Trip Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI automatically create your itinerary with optimized routes, budget suggestions, and local recommendations.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="autoItinerary" 
                    checked={autoGenerateItinerary}
                    onCheckedChange={(checked) => setAutoGenerateItinerary(checked as boolean)}
                  />
                  <label htmlFor="autoItinerary" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Auto-generate AI Itinerary
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="showBooking" 
                    checked={showBookingOptions}
                    onCheckedChange={(checked) => setShowBookingOptions(checked as boolean)}
                  />
                  <label htmlFor="showBooking" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary" />
                    Show Flight & Hotel Booking Options
                  </label>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Include the destination name in your trip title (e.g., "Rajasthan Adventure") for better AI suggestions!
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="btn-gradient flex-1 h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Trip"}
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateTrip;
