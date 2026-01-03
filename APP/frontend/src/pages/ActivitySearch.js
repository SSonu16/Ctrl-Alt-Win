import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await apiRequest("/activities");
      setActivities(data);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div data-testid="activity-search-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Explore Activities
        </h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              data-testid="activity-search-input"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} data-testid={`activity-${activity.id}`} className="border-2 card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      ${activity.cost}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {activity.duration}
                    </span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">
                      {activity.category}
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