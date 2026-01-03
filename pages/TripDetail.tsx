import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Share2,
  Camera,
  ChevronDown,
  ChevronUp,
  Plane,
  Route,
  Building,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO, differenceInDays } from "date-fns";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import FlightSearchModal from "@/components/FlightSearchModal";
import HotelBookingModal from "@/components/HotelBookingModal";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_url: string | null;
  budget: number;
  spent: number;
  created_at: string;
  updated_at: string;
}

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    budget: 0,
    start_date: "",
    end_date: "",
  });
  
  // Check if we should auto-generate itinerary or show booking options
  const locationState = location.state as { autoGenerateItinerary?: boolean; showBookingOptions?: boolean } | null;
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(locationState?.autoGenerateItinerary || false);
  const [showBookingBanner, setShowBookingBanner] = useState(locationState?.showBookingOptions || false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchTrip = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate("/trips");
          return;
        }
        setTrip(data);
        setEditForm({
          name: data.name,
          description: data.description || "",
          budget: data.budget || 0,
          start_date: data.start_date,
          end_date: data.end_date,
        });
      } catch (error) {
        console.error("Error fetching trip:", error);
        navigate("/trips");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrip();
    }
  }, [id, user, authLoading, navigate]);

  const handleUpdateTrip = async () => {
    if (!trip || !user) return;

    try {
      const { error } = await supabase
        .from("trips")
        .update({
          name: editForm.name,
          description: editForm.description,
          budget: editForm.budget,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
        })
        .eq("id", trip.id)
        .eq("user_id", user.id);

      if (error) throw error;

      setTrip({
        ...trip,
        name: editForm.name,
        description: editForm.description,
        budget: editForm.budget,
        start_date: editForm.start_date,
        end_date: editForm.end_date,
      });
      setShowEditModal(false);
      toast({ title: "Trip updated successfully!" });
    } catch (error) {
      console.error("Error updating trip:", error);
      toast({ title: "Failed to update trip", variant: "destructive" });
    }
  };

  const getShareableText = () => {
    if (!trip) return "";
    let text = `🌍 ${trip.name}\n`;
    text += `📅 ${format(parseISO(trip.start_date), "MMM d")} - ${format(parseISO(trip.end_date), "MMM d, yyyy")}\n`;
    if (trip.budget) text += `💰 Budget: ₹${trip.budget.toLocaleString("en-IN")}\n`;
    if (trip.description) text += `\n${trip.description}`;
    return text;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareableText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast({ title: "Opening WhatsApp..." });
  };

  const handleShareEmail = () => {
    if (!trip) return;
    const subject = encodeURIComponent(`Trip Plan: ${trip.name}`);
    const body = encodeURIComponent(getShareableText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast({ title: "Opening email client..." });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareableText());
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  const tripDuration = differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1;
  const budgetSpent = Number(trip.spent) || 0;
  const totalBudget = Number(trip.budget) || 0;
  const budgetPercentage = totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/trips">
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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share via WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {trip.cover_url ? (
          <img
            src={trip.cover_url}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Plane className="w-20 h-20 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(parseISO(trip.start_date), "MMM d, yyyy")} - {format(parseISO(trip.end_date), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tripDuration} days
              </span>
              {totalBudget > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ₹{totalBudget.toLocaleString('en-IN')} budget
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Booking Options Banner */}
        {showBookingBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-6 border border-primary/20 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  Complete Your Trip Planning
                </h3>
                <p className="text-muted-foreground text-sm">
                  Book flights and hotels for your {trip.name} trip
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowFlightModal(true)}
                  className="btn-gradient"
                >
                  <Plane className="w-4 h-4 mr-2" />
                  Search Flights
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowHotelModal(true)}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Book Hotels
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBookingBanner(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trip Description */}
        {trip.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 border border-border mb-8"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              About This Trip
            </h2>
            <p className="text-muted-foreground">{trip.description}</p>
          </motion.div>
        )}

        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="itinerary">
              <Route className="w-4 h-4 mr-2" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Plane className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <ItineraryBuilder
              tripId={trip.id}
              tripName={trip.name}
              startDate={trip.start_date}
              endDate={trip.end_date}
              budget={totalBudget}
              description={trip.description}
              tripDuration={tripDuration}
              autoGenerate={shouldAutoGenerate}
              onAutoGenerateComplete={() => setShouldAutoGenerate(false)}
            />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setShowFlightModal(true)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Flight Booking
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Search and compare flights
                    </p>
                  </div>
                </div>
                <Button className="w-full btn-gradient">
                  <Plane className="w-4 h-4 mr-2" />
                  Search Flights
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setShowHotelModal(true)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Hotel Booking
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Find and book hotels
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Building className="w-4 h-4 mr-2" />
                  Browse Hotels
                </Button>
              </motion.div>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Trip Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {tripDuration} Days
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      ₹{totalBudget.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Budget</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      ₹{tripDuration > 0 ? Math.round(totalBudget / tripDuration).toLocaleString('en-IN') : 0}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Trip Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="font-semibold text-foreground">
                    {format(parseISO(trip.start_date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <p className="font-semibold text-foreground">
                    {format(parseISO(trip.end_date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Budget Summary
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-semibold text-foreground">
                        ₹{budgetSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Progress value={budgetPercentage} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                      <p className="font-display text-2xl font-bold text-success">
                        ₹{(totalBudget - budgetSpent).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Daily Budget</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        ₹{tripDuration > 0 ? Math.round(totalBudget / tripDuration).toLocaleString('en-IN') : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Expense Tracking Coming Soon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Expense Tracking
                </h3>
                <p className="text-muted-foreground">
                  Detailed expense tracking by category will be available soon.
                </p>
              </motion.div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No photos yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Add photos from your Rajasthan trip to create lasting memories.
              </p>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Flight Search Modal */}
      <FlightSearchModal
        isOpen={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        destinationAirport={{
          name: trip.name,
          code: trip.name.substring(0, 3).toUpperCase(),
        }}
      />

      {/* Hotel Booking Modal */}
      <HotelBookingModal
        isOpen={showHotelModal}
        onClose={() => setShowHotelModal(false)}
        hotel={{
          name: `Hotel in ${trip.name}`,
          rating: 4.2,
          pricePerNight: 2500,
          amenities: ["WiFi", "AC", "Breakfast"],
          distance: "City center",
        }}
        placeName={trip.name}
      />

      {/* Edit Trip Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Trip
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Trip Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter trip name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe your trip"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={editForm.start_date}
                  onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={editForm.end_date}
                  onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget (₹)</Label>
              <Input
                type="number"
                value={editForm.budget || ""}
                onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                placeholder="Enter budget"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTrip} className="btn-gradient">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetail;
