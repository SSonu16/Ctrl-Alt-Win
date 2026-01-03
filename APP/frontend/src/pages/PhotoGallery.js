import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PhotoGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ image_data: "", caption: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [tripData, photosData] = await Promise.all([
        apiRequest(`/trips/${id}`),
        apiRequest(`/photos/trips/${id}`),
      ]);

      setTrip(tripData);
      setPhotos(photosData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto({ ...newPhoto, image_data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!newPhoto.image_data) {
      toast.error("Please select an image");
      return;
    }

    setUploading(true);
    try {
      const photo = await apiRequest(`/photos/trips/${id}`, {
        method: "POST",
        body: JSON.stringify(newPhoto),
      });

      setPhotos([...photos, photo]);
      setShowUploadDialog(false);
      setNewPhoto({ image_data: "", caption: "" });
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await apiRequest(`/photos/${photoId}`, { method: "DELETE" });
      setPhotos(photos.filter((p) => p.id !== photoId));
      toast.success("Photo deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    <div data-testid="photo-gallery-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
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

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Photo Gallery
            </h1>
            <p className="text-gray-600">{trip?.name}</p>
          </div>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button data-testid="upload-photo-btn" className="bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600">
                <Upload size={18} className="mr-2" />
                Upload Photo
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="upload-dialog">
              <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-file">Select Image *</Label>
                  <Input
                    id="photo-file"
                    data-testid="photo-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </div>

                {newPhoto.image_data && (
                  <div className="border-2 rounded-lg p-2">
                    <img
                      src={newPhoto.image_data}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="photo-caption">Caption (Optional)</Label>
                  <Input
                    id="photo-caption"
                    data-testid="photo-caption-input"
                    placeholder="Add a caption..."
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  />
                </div>

                <Button
                  data-testid="upload-submit-btn"
                  onClick={handleUpload}
                  disabled={uploading || !newPhoto.image_data}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {photos.length === 0 ? (
          <Card data-testid="no-photos-message" className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
              <p className="text-gray-600 mb-4">Start capturing memories from your trip</p>
              <Button
                data-testid="first-photo-btn"
                onClick={() => setShowUploadDialog(true)}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Upload First Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} data-testid={`photo-${photo.id}`} className="border-2 overflow-hidden">
                <div className="relative group">
                  <img
                    src={photo.image_data}
                    alt={photo.caption || "Trip photo"}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <Button
                      data-testid={`delete-photo-${photo.id}`}
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                {photo.caption && (
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-700">{photo.caption}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}