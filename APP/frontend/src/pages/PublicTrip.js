import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Globe } from "lucide-react";
import { apiRequest, formatDate } from "@/utils/api";

export default function PublicTrip() {
  const { url } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [url]);

  const fetchTrip = async () => {
    try {
      const data = await apiRequest(`/trips/public/${url}`, { noAuth: true });
      setTrip(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trip not found</h2>
          <p className="text-gray-600">This trip may have been removed or is no longer public.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="public-trip-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Globe className="mx-auto mb-4 text-sky-500" size={48} />
          <h1 data-testid="public-trip-title" className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {trip.name}
          </h1>
          {trip.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{trip.description}</p>
          )}
        </div>

        <Card className="border-2 shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-sky-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}