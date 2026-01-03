import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, MapPin, Trash2, Search } from "lucide-react";
import { apiRequest, formatDate } from "@/utils/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [tripCities, setTripCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tripActivities, setTripActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citySearch, setCitySearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [showCityDialog, setShowCityDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [newCityData, setNewCityData] = useState({
    arrival_date: "",
    departure_date: "",
  });
  const [newActivityData, setNewActivityData] = useState({
    city_id: "",
    scheduled_time: "",
    day_number: 1,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [tripData, citiesData, tripCitiesData, activitiesData, tripActivitiesData] = await Promise.all([
        apiRequest(`/trips/${id}`),
        apiRequest("/cities"),
        apiRequest(`/itinerary/trips/${id}/cities`),
        apiRequest("/activities"),
        apiRequest(`/itinerary/trips/${id}/activities`),
      ]);

      setTrip(tripData);
      setCities(citiesData);
      setTripCities(tripCitiesData);
      setActivities(activitiesData);
      setTripActivities(tripActivitiesData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (city) => {
    try {
      const data = await apiRequest(`/itinerary/trips/${id}/cities`, {
        method: "POST",
        body: JSON.stringify({
          city_id: city.id,
          arrival_date: newCityData.arrival_date,
          departure_date: newCityData.departure_date,
          order: tripCities.length + 1,
        }),
      });

      setTripCities([...tripCities, data]);
      setShowCityDialog(false);
      setNewCityData({ arrival_date: "", departure_date: "" });
      toast.success("City added to itinerary");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveCity = async (cityId) => {
    try {
      await apiRequest(`/itinerary/trips/${id}/cities/${cityId}`, { method: "DELETE" });
      setTripCities(tripCities.filter((c) => c.id !== cityId));
      toast.success("City removed from itinerary");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddActivity = async (activity) => {
    try {
      const data = await apiRequest(`/itinerary/trips/${id}/activities`, {
        method: "POST",
        body: JSON.stringify({
          city_id: newActivityData.city_id,
          activity_id: activity.id,
          scheduled_time: newActivityData.scheduled_time,
          day_number: parseInt(newActivityData.day_number),
          cost: activity.cost,
        }),
      });

      setTripActivities([...tripActivities, data]);
      setShowActivityDialog(false);
      setNewActivityData({ city_id: "", scheduled_time: "", day_number: 1 });
      toast.success("Activity added to itinerary");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveActivity = async (activityId) => {
    try {
      await apiRequest(`/itinerary/trips/${id}/activities/${activityId}`, { method: "DELETE" });
      setTripActivities(tripActivities.filter((a) => a.id !== activityId));
      toast.success("Activity removed from itinerary");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="itinerary-builder-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          data-testid="back-btn"
          onClick={() => navigate(`/trips/${id}`)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Trip
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Itinerary Builder
          </h1>
          <p className="text-gray-600">{trip.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cities Section */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cities ({tripCities.length})</CardTitle>
              <Dialog open={showCityDialog} onOpenChange={setShowCityDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="add-city-btn" size="sm" className="bg-sky-500 hover:bg-sky-600">
                    <Plus size={16} className="mr-1" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="add-city-dialog" className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add City to Trip</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input
                        data-testid="city-search-input"
                        placeholder="Search cities..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Arrival Date</Label>
                      <Input
                        data-testid="city-arrival-date"
                        type="date"
                        value={newCityData.arrival_date}
                        onChange={(e) => setNewCityData({ ...newCityData, arrival_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Departure Date</Label>
                      <Input
                        data-testid="city-departure-date"
                        type="date"
                        value={newCityData.departure_date}
                        onChange={(e) => setNewCityData({ ...newCityData, departure_date: e.target.value })}
                        min={newCityData.arrival_date}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <Card
                          key={city.id}
                          data-testid={`city-option-${city.id}`}
                          className="cursor-pointer hover:bg-sky-50 border-2"
                          onClick={() => newCityData.arrival_date && newCityData.departure_date && handleAddCity(city)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{city.name}</h3>
                            <p className="text-sm text-gray-600">{city.country}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded">Cost: {city.cost_index}/10</span>
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">Popular: {city.popularity}/10</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {tripCities.length === 0 ? (
                <div data-testid="no-cities-message" className="text-center py-8 text-gray-500">
                  <MapPin className="mx-auto mb-2" size={32} />
                  <p>No cities added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tripCities.map((city) => (
                    <Card key={city.id} data-testid={`trip-city-${city.id}`} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{city.city_name}</h3>
                            <p className="text-sm text-gray-600">{city.city_country}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                            </p>
                          </div>
                          <Button
                            data-testid={`remove-city-${city.id}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCity(city.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activities Section */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Activities ({tripActivities.length})</CardTitle>
              <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="add-activity-btn"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={tripCities.length === 0}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="add-activity-dialog" className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Activity to Trip</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <select
                        data-testid="activity-city-select"
                        className="w-full border-2 rounded-md p-2"
                        value={newActivityData.city_id}
                        onChange={(e) => setNewActivityData({ ...newActivityData, city_id: e.target.value })}
                      >
                        <option value="">Select a city</option>
                        {tripCities.map((city) => (
                          <option key={city.id} value={city.city_id}>
                            {city.city_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Scheduled Time</Label>
                      <Input
                        data-testid="activity-time-input"
                        type="time"
                        value={newActivityData.scheduled_time}
                        onChange={(e) => setNewActivityData({ ...newActivityData, scheduled_time: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Day Number</Label>
                      <Input
                        data-testid="activity-day-input"
                        type="number"
                        min="1"
                        value={newActivityData.day_number}
                        onChange={(e) => setNewActivityData({ ...newActivityData, day_number: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input
                        data-testid="activity-search-input"
                        placeholder="Search activities..."
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                      {filteredActivities.map((activity) => (
                        <Card
                          key={activity.id}
                          data-testid={`activity-option-${activity.id}`}
                          className="cursor-pointer hover:bg-orange-50 border-2"
                          onClick={() => newActivityData.city_id && newActivityData.scheduled_time && handleAddActivity(activity)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{activity.name}</h3>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">${activity.cost}</span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{activity.duration}</span>
                              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">{activity.category}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {tripActivities.length === 0 ? (
                <div data-testid="no-activities-message" className="text-center py-8 text-gray-500">
                  <Plus className="mx-auto mb-2" size={32} />
                  <p>No activities added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tripActivities.map((activity) => (
                    <Card key={activity.id} data-testid={`trip-activity-${activity.id}`} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{activity.activity_name}</h3>
                            <p className="text-sm text-gray-600">{activity.activity_description}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="text-gray-600">Day {activity.day_number}</span>
                              <span className="text-gray-600">{activity.scheduled_time}</span>
                              <span className="text-green-600 font-semibold">${activity.cost}</span>
                            </div>
                          </div>
                          <Button
                            data-testid={`remove-activity-${activity.id}`}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveActivity(activity.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}