import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export default function CitySearch() {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const data = await apiRequest("/cities");
      setCities(data);
    } catch (error) {
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div data-testid="city-search-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Explore Cities
        </h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              data-testid="city-search-input"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCities.map((city) => (
              <Card key={city.id} data-testid={`city-${city.id}`} className="border-2 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <MapPin className="text-sky-500" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{city.country}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded">
                      Cost: {city.cost_index}/10
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      Popular: {city.popularity}/10
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}