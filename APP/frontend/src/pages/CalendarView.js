import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { apiRequest, formatDate } from "@/utils/api";
import { toast } from "sonner";

export default function CalendarView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [tripCities, setTripCities] = useState([]);
  const [tripActivities, setTripActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [tripData, citiesData, activitiesData] = await Promise.all([
        apiRequest(`/trips/${id}`),
        apiRequest(`/itinerary/trips/${id}/cities`),
        apiRequest(`/itinerary/trips/${id}/activities`),
      ]);

      setTrip(tripData);
      setTripCities(citiesData);
      setTripActivities(activitiesData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const groupActivitiesByDay = () => {
    const grouped = {};
    tripActivities.forEach((activity) => {
      if (!grouped[activity.day_number]) {
        grouped[activity.day_number] = [];
      }
      grouped[activity.day_number].push(activity);
    });
    return grouped;
  };

  const activitiesByDay = groupActivitiesByDay();
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
    <div data-testid="calendar-view-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
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
            Trip Timeline
          </h1>
          <p className="text-gray-600">{trip?.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(trip?.start_date)} - {formatDate(trip?.end_date)}
          </p>
        </div>

        {tripCities.length === 0 ? (
          <Card data-testid="no-data-message" className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">No itinerary data yet</h3>
              <p className="text-gray-600 mb-4">Add cities and activities to see your timeline</p>
              <Button
                data-testid="goto-itinerary-btn"
                onClick={() => navigate(`/trips/${id}/itinerary`)}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Build Itinerary
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cities */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Cities to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tripCities.map((city, index) => (
                    <div
                      key={city.id}
                      data-testid={`timeline-city-${city.id}`}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        {index < tripCities.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-sky-500 to-orange-500"></div>
                        )}
                      </div>
                      <Card className="flex-1 border-2">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin size={18} className="text-sky-500" />
                            {city.city_name}
                          </h3>
                          <p className="text-sm text-gray-600">{city.city_country}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Daily Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(activitiesByDay).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No activities scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(activitiesByDay)
                      .sort((a, b) => parseInt(a) - parseInt(b))
                      .map((day) => (
                        <div key={day} data-testid={`day-${day}`} className="space-y-3">
                          <h3 className="text-lg font-semibold text-sky-600">Day {day}</h3>
                          <div className="space-y-2">
                            {activitiesByDay[day]
                              .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time))
                              .map((activity) => (
                                <Card key={activity.id} data-testid={`activity-${activity.id}`} className="border">
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold text-sky-600">
                                            {activity.scheduled_time}
                                          </span>
                                          <span className="text-sm font-medium">
                                            {activity.activity_name}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {activity.activity_description}
                                        </p>
                                      </div>
                                      <span className="text-sm font-semibold text-green-600">
                                        ${activity.cost}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}