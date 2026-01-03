import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Camera,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Heart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.jpg";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTrips } from "@/hooks/useTrips";
import { useSavedDestinations } from "@/hooks/useSavedDestinations";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut, updateProfile } = useAuth();
  const { trips } = useTrips();
  const { savedDestinations, removeDestination } = useSavedDestinations();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Sync profile data
  useEffect(() => {
    if (profile && user) {
      setUserData({
        name: profile.full_name || "",
        email: user.email || "",
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: userData.name });
    setSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRemoveDestination = async (id: string) => {
    await removeDestination(id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "Trips Planned", value: trips.length },
    { label: "Saved Places", value: savedDestinations.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-14 h-14 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        disabled
                        className="h-12 opacity-50"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="btn-gradient" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                      {profile?.full_name || "Traveler"}
                    </h1>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 md:gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Destinations */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Saved Destinations
              </h2>
              <Link to="/explore" className="text-primary hover:underline text-sm">
                Explore more
              </Link>
            </div>

            {savedDestinations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">No saved destinations yet</p>
                <Link to="/explore">
                  <Button variant="outline">Explore Destinations</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="relative group rounded-2xl overflow-hidden"
                  >
                    {dest.destination_image ? (
                      <img
                        src={dest.destination_image}
                        alt={dest.destination_name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="font-semibold text-primary-foreground">{dest.destination_name}</p>
                      {dest.state_name && (
                        <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dest.state_name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveDestination(dest.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-destructive/80 rounded-full flex items-center justify-center text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
                <Button variant="outline">English</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Currency</p>
                  <p className="text-sm text-muted-foreground">Display prices in your currency</p>
                </div>
                <Button variant="outline">INR (₹)</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Manage email notifications</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-3xl p-8 border border-destructive/30">
            <h2 className="font-display text-xl font-semibold text-destructive mb-2">
              Danger Zone
            </h2>
            <p className="text-muted-foreground mb-6">
              These actions are permanent and cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
