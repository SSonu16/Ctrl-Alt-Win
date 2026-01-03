import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, DollarSign, Image as ImageIcon, Share2, Edit } from "lucide-react";
import { apiRequest, formatDate, calculateDays } from "@/utils/api";
import { toast } from "sonner";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const data = await apiRequest(`/trips/${id}`);
      setTrip(data);
    } catch (error) {
      toast.error("Failed to load trip");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const updated = await apiRequest(`/trips/${id}/publish`, { method: "POST" });
      setTrip(updated);
      toast.success("Trip published! Share your public URL");
    } catch (error) {
      toast.error("Failed to publish trip");
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/public/${trip.public_url}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading trip details...</div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="trip-details-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          data-testid="back-to-trips-btn"
          onClick={() => navigate("/trips")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Trips
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 data-testid="trip-title" className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {trip.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-sky-500" />
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-orange-500" />
                  {calculateDays(trip.start_date, trip.end_date)} days
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {trip.is_public ? (
                <Button
                  data-testid="copy-public-url-btn"
                  onClick={copyPublicUrl}
                  variant="outline"
                  className="border-2"
                >
                  <Share2 size={16} className="mr-2" />
                  Share Link
                </Button>
              ) : (
                <Button
                  data-testid="publish-trip-btn"
                  onClick={handlePublish}
                  variant="outline"
                  className="border-2"
                >
                  <Share2 size={16} className="mr-2" />
                  Publish
                </Button>
              )}
            </div>
          </div>

          {trip.description && (
            <p data-testid="trip-description" className="mt-4 text-gray-700">{trip.description}</p>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger data-testid="tab-overview" value="overview">Overview</TabsTrigger>
            <TabsTrigger data-testid="tab-itinerary" value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger data-testid="tab-budget" value="budget">Budget</TabsTrigger>
            <TabsTrigger data-testid="tab-calendar" value="calendar">Timeline</TabsTrigger>
            <TabsTrigger data-testid="tab-photos" value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="quick-action-itinerary" className="border-2 card-hover cursor-pointer" onClick={() => navigate(`/trips/${id}/itinerary`)}>
                <CardHeader className="pb-3">
                  <MapPin className="text-sky-500 mb-2" size={24} />
                  <CardTitle className="text-lg">Plan Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Add cities and activities</p>
                </CardContent>
              </Card>

              <Card data-testid="quick-action-budget" className="border-2 card-hover cursor-pointer" onClick={() => navigate(`/trips/${id}/budget`)}>
                <CardHeader className="pb-3">
                  <DollarSign className="text-orange-500 mb-2" size={24} />
                  <CardTitle className="text-lg">Manage Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Track your expenses</p>
                </CardContent>
              </Card>

              <Card data-testid="quick-action-calendar" className="border-2 card-hover cursor-pointer" onClick={() => navigate(`/trips/${id}/calendar`)}>
                <CardHeader className="pb-3">
                  <Calendar className="text-pink-500 mb-2" size={24} />
                  <CardTitle className="text-lg">View Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Day-by-day schedule</p>
                </CardContent>
              </Card>

              <Card data-testid="quick-action-photos" className="border-2 card-hover cursor-pointer" onClick={() => navigate(`/trips/${id}/photos`)}>
                <CardHeader className="pb-3">
                  <ImageIcon className="text-green-500 mb-2" size={24} />
                  <CardTitle className="text-lg">Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Upload trip photos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="itinerary">
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Build Your Itinerary</h3>
                <p className="text-gray-600 mb-4">Add cities and activities to your trip</p>
                <Button
                  data-testid="goto-itinerary-btn"
                  onClick={() => navigate(`/trips/${id}/itinerary`)}
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  Go to Itinerary Builder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <DollarSign className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Manage Your Budget</h3>
                <p className="text-gray-600 mb-4">Track expenses and costs</p>
                <Button
                  data-testid="goto-budget-btn"
                  onClick={() => navigate(`/trips/${id}/budget`)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Go to Budget View
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">View Timeline</h3>
                <p className="text-gray-600 mb-4">See your day-by-day schedule</p>
                <Button
                  data-testid="goto-calendar-btn"
                  onClick={() => navigate(`/trips/${id}/calendar`)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Go to Calendar View
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Photo Gallery</h3>
                <p className="text-gray-600 mb-4">Upload and manage trip photos</p>
                <Button
                  data-testid="goto-photos-btn"
                  onClick={() => navigate(`/trips/${id}/photos`)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Go to Photo Gallery
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
