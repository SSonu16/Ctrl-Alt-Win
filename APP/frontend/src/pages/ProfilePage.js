import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export default function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name: profileData.name }),
      });

      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="profile-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Profile Settings
        </h1>

        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={24} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form data-testid="profile-form" onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="email-input"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="border-2 bg-gray-100"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <Button
                data-testid="save-profile-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white font-semibold"
              >
                <Save size={18} className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
