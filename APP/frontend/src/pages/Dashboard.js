import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { apiRequest, formatDate } from "@/utils/api";
import { toast } from "sonner";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
    seedData();
  }, []);

  const seedData = async () => {
    try {
      await apiRequest("/seed-data", { method: "POST" });
    } catch (error) {
      console.log("Seed data already exists");
    }
  };

  const fetchTrips = async () => {
    try {
      const data = await apiRequest("/trips");
      setTrips(data.slice(0, 3)); // Show only first 3 trips on dashboard
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { name: "Paris", country: "France", image: "🗼" },
    { name: "Tokyo", country: "Japan", image: "🗾" },
    { name: "New York", country: "USA", image: "🗽" },
    { name: "Barcelona", country: "Spain", image: "🏖️" },
  ];

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div data-testid="hero-section" className="bg-gradient-to-r from-sky-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Ready to plan your next adventure? Create a new trip or continue exploring.
            </p>
            <Button
              data-testid="plan-new-trip-btn"
              onClick={() => navigate("/trips/new")}
              size="lg"
              className="bg-white text-sky-600 hover:bg-gray-100 font-semibold"
            >
              <Plus size={20} className="mr-2" />
              Plan New Trip
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="stat-trips" className="border-2 shadow-lg hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Trips</CardTitle>
              <MapPin className="text-sky-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600">{trips.length}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-destinations" className="border-2 shadow-lg hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Destinations</CardTitle>
              <Calendar className="text-orange-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {trips.reduce((acc, trip) => acc + (trip.cities?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-budget" className="border-2 shadow-lg hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
              <DollarSign className="text-pink-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">$0</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Trips */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Upcoming Trips
            </h2>
            <Link to="/trips">
              <Button data-testid="view-all-trips" variant="ghost" className="text-sky-600">
                View All →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <Card data-testid="no-trips-card" className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-4">Start planning your first adventure!</p>
                <Button
                  data-testid="create-first-trip-btn"
                  onClick={() => navigate("/trips/new")}
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  Create Your First Trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  data-testid={`trip-card-${trip.id}`}
                  className="card-hover border-2 shadow-lg"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">{trip.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-sky-500" />
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </div>
                      {trip.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{trip.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Popular Destinations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest) => (
              <Card
                key={dest.name}
                data-testid={`destination-card-${dest.name.toLowerCase()}`}
                className="card-hover border-2 shadow-lg cursor-pointer"
                onClick={() => navigate("/cities")}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{dest.image}</div>
                  <h3 className="font-semibold text-lg mb-1">{dest.name}</h3>
                  <p className="text-sm text-gray-600">{dest.country}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                data-testid="quick-browse-cities"
                onClick={() => navigate("/cities")}
                variant="outline"
                className="h-auto py-4 border-2 hover:border-sky-500 hover:bg-sky-50"
              >
                <div className="text-center w-full">
                  <MapPin className="mx-auto mb-2 text-sky-500" size={24} />
                  <div className="font-semibold">Browse Cities</div>
                </div>
              </Button>

              <Button
                data-testid="quick-browse-activities"
                onClick={() => navigate("/activities")}
                variant="outline"
                className="h-auto py-4 border-2 hover:border-orange-500 hover:bg-orange-50"
              >
                <div className="text-center w-full">
                  <TrendingUp className="mx-auto mb-2 text-orange-500" size={24} />
                  <div className="font-semibold">Explore Activities</div>
                </div>
              </Button>

              <Button
                data-testid="quick-view-profile"
                onClick={() => navigate("/profile")}
                variant="outline"
                className="h-auto py-4 border-2 hover:border-pink-500 hover:bg-pink-50"
              >
                <div className="text-center w-full">
                  <Calendar className="mx-auto mb-2 text-pink-500" size={24} />
                  <div className="font-semibold">My Profile</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}