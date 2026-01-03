import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Activity, TrendingUp } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiRequest("/admin/stats");
      setStats(data);
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div data-testid="admin-dashboard-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Admin Dashboard
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card data-testid="stat-users" className="border-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="text-sky-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_users || 0}</div>
                </CardContent>
              </Card>

              <Card data-testid="stat-trips" className="border-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                  <MapPin className="text-orange-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total_trips || 0}</div>
                </CardContent>
              </Card>

              <Card data-testid="stat-public" className="border-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Public Trips</CardTitle>
                  <TrendingUp className="text-pink-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.public_trips || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Popular Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.popular_cities?.length > 0 ? (
                    <div className="space-y-2">
                      {stats.popular_cities.map((city, index) => (
                        <div key={index} data-testid={`popular-city-${index}`} className="flex justify-between items-center p-2 bg-sky-50 rounded">
                          <span>{city._id}</span>
                          <span className="font-semibold">{city.count} trips</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No data yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Popular Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.popular_activities?.length > 0 ? (
                    <div className="space-y-2">
                      {stats.popular_activities.map((activity, index) => (
                        <div key={index} data-testid={`popular-activity-${index}`} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                          <span>{activity._id}</span>
                          <span className="font-semibold">{activity.count} times</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
