import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, MapPin, Trash2, Edit, Eye, Share2, Search } from "lucide-react";
import { apiRequest, formatDate, calculateDays } from "@/utils/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TripList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = trips.filter((trip) =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips(trips);
    }
  }, [searchQuery, trips]);

  const fetchTrips = async () => {
    try {
      const data = await apiRequest("/trips");
      setTrips(data);
      setFilteredTrips(data);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiRequest(`/trips/${deleteId}`, { method: "DELETE" });
      toast.success("Trip deleted successfully");
      setTrips(trips.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div data-testid="trip-list-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Trips
          </h1>
          <Button
            data-testid="create-new-trip-btn"
            onClick={() => navigate("/trips/new")}
            className="bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white font-semibold"
          >
            <Plus size={18} className="mr-2" />
            Create New Trip
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              data-testid="search-trips-input"
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <Card data-testid="no-trips-message" className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No trips found" : "No trips yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Start planning your first adventure!"}
              </p>
              {!searchQuery && (
                <Button
                  data-testid="create-first-trip-btn"
                  onClick={() => navigate("/trips/new")}
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  Create Your First Trip
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                data-testid={`trip-item-${trip.id}`}
                className="border-2 shadow-lg hover:shadow-xl"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl line-clamp-1">{trip.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-sky-500" />
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-orange-500" />
                      {calculateDays(trip.start_date, trip.end_date)} days
                    </div>
                    {trip.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-2">{trip.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      data-testid={`view-trip-${trip.id}`}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      size="sm"
                      className="flex-1 bg-sky-500 hover:bg-sky-600"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      data-testid={`delete-trip-${trip.id}`}
                      onClick={() => setDeleteId(trip.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-testid="delete-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-btn"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}