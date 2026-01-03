import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Calendar, Users, Search, ArrowRight, ExternalLink } from "lucide-react";
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

interface FlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationAirport: {
    name: string;
    code: string;
  };
}

const FlightSearchModal = ({ isOpen, onClose, destinationAirport }: FlightSearchModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
  });

  const handleSearchFlights = () => {
    if (!formData.from) {
      toast({
        title: "Missing Information",
        description: "Please enter departure city",
        variant: "destructive",
      });
      return;
    }

    const fromCity = encodeURIComponent(formData.from);
    const toCity = encodeURIComponent(destinationAirport.name || destinationAirport.code);
    const date = formData.departureDate || new Date().toISOString().split('T')[0];
    const passengers = formData.passengers || "1";
    
    // Format date for MakeMyTrip (DD/MM/YYYY)
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    
    // MakeMyTrip flight search URL
    const makeMyTripUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCity}-${destinationAirport.code || toCity}-${formattedDate}&tripType=O&paxType=A-${passengers}_C-0_I-0&intl=false&cabinClass=E`;
    
    toast({
      title: "Opening MakeMyTrip",
      description: `Searching flights from ${formData.from} to ${destinationAirport.name}...`,
    });
    
    window.open(makeMyTripUrl, "_blank", "noopener,noreferrer");
  };

  const handleGoToAgoda = () => {
    const toCity = encodeURIComponent(destinationAirport.name || destinationAirport.code);
    const agodaUrl = `https://www.agoda.com/flights/search?origin=${encodeURIComponent(formData.from || "Delhi")}&destination=${toCity}&departDate=${formData.departureDate || ""}&adults=${formData.passengers || 1}`;
    
    toast({
      title: "Opening Agoda",
      description: "Redirecting to Agoda for flights...",
    });
    
    window.open(agodaUrl, "_blank", "noopener,noreferrer");
  };

  const handleGoToBookMyTrip = () => {
    const toCity = encodeURIComponent(destinationAirport.name || destinationAirport.code);
    const date = formData.departureDate || new Date().toISOString().split('T')[0];
    
    // Cleartrip URL (popular Indian booking site)
    const cleartripUrl = `https://www.cleartrip.com/flights/results?adults=${formData.passengers || 1}&childs=0&infants=0&class=Economy&depart_date=${date}&from=${encodeURIComponent(formData.from || "DEL")}&to=${destinationAirport.code || toCity}&intl=n&origin=${encodeURIComponent(formData.from || "Delhi")}&destination=${toCity}&sft=&sd=${date}`;
    
    toast({
      title: "Opening Cleartrip",
      description: "Redirecting to Cleartrip for flights...",
    });
    
    window.open(cleartripUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plane className="w-5 h-5 text-primary" />
            Book Flights to {destinationAirport.name || destinationAirport.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                placeholder="Enter departure city (e.g., Delhi, Mumbai)"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                value={`${destinationAirport.name} (${destinationAirport.code})`}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Return Date (Optional)</Label>
              <Input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passengers</Label>
              <Input
                type="number"
                min="1"
                max="9"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              />
            </div>
          </div>

          {/* Booking Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Book on Popular Sites</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSearchFlights}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <span className="font-bold">MakeMyTrip</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Search & Book <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGoToAgoda}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <span className="font-bold">Agoda</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Compare Prices <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGoToBookMyTrip}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <span className="font-bold">Cleartrip</span>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    Book Now <ExternalLink className="w-3 h-3" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Travel Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Book 2-3 weeks in advance for best prices</li>
              <li>• Compare prices across all platforms</li>
              <li>• Consider nearby airports for cheaper options</li>
              <li>• Tuesday and Wednesday flights are often cheaper</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlightSearchModal;
