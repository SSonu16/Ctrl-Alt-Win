import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trip = await apiRequest("/trips", {
        method: "POST",
        body: JSON.stringify(tripData),
      });

      toast.success("Trip created successfully!");
      navigate(`/trips/${trip.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div data-testid="create-trip-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          data-testid="back-btn"
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-sky-500 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Plan Your New Adventure
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form data-testid="create-trip-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="trip-name">Trip Name *</Label>
                <Input
                  id="trip-name"
                  data-testid="trip-name-input"
                  type="text"
                  placeholder="e.g., Summer Europe Tour"
                  value={tripData.name}
                  onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                  required
                  className="border-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      id="start-date"
                      data-testid="start-date-input"
                      type="date"
                      value={tripData.start_date}
                      onChange={(e) => setTripData({ ...tripData, start_date: e.target.value })}
                      required
                      className="pl-10 border-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      id="end-date"
                      data-testid="end-date-input"
                      type="date"
                      value={tripData.end_date}
                      onChange={(e) => setTripData({ ...tripData, end_date: e.target.value })}
                      required
                      min={tripData.start_date}
                      className="pl-10 border-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  data-testid="description-input"
                  placeholder="Describe your trip plans..."
                  value={tripData.description}
                  onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                  rows={4}
                  className="border-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  data-testid="cancel-btn"
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 border-2"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="create-trip-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white font-semibold"
                >
                  {loading ? "Creating..." : "Create Trip"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}