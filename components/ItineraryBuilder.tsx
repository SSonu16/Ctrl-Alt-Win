import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit2,
  Save,
  X,
  Utensils,
  Camera,
  Car,
  Bed,
  ShoppingBag,
  Mountain,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useItinerary, ItineraryItem } from "@/hooks/useItinerary";
import { format, addDays, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ItineraryBuilderProps {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string | null;
  tripDuration: number;
  autoGenerate?: boolean;
  onAutoGenerateComplete?: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  accommodation: <Bed className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  adventure: <Mountain className="w-4 h-4" />,
  cultural: <Camera className="w-4 h-4" />,
  activity: <Clock className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  sightseeing: "bg-blue-500/10 text-blue-500",
  food: "bg-orange-500/10 text-orange-500",
  transport: "bg-purple-500/10 text-purple-500",
  accommodation: "bg-green-500/10 text-green-500",
  shopping: "bg-pink-500/10 text-pink-500",
  adventure: "bg-red-500/10 text-red-500",
  cultural: "bg-amber-500/10 text-amber-500",
  activity: "bg-primary/10 text-primary",
};

const ItineraryBuilder = ({
  tripId,
  tripName,
  startDate,
  endDate,
  budget,
  description,
  tripDuration,
  autoGenerate = false,
  onAutoGenerateComplete,
}: ItineraryBuilderProps) => {
  const {
    items,
    loading,
    generating,
    addItem,
    updateItem,
    deleteItem,
    generateAIItinerary,
    getItemsByDay,
  } = useItinerary(tripId);

  const { toast } = useToast();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ItineraryItem>>({});
  const [isAddingItem, setIsAddingItem] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [newItem, setNewItem] = useState({
    time_slot: "",
    title: "",
    description: "",
    location: "",
    estimated_cost: 0,
    duration_minutes: 60,
    category: "activity",
  });
  const [hasTriggeredAutoGenerate, setHasTriggeredAutoGenerate] = useState(false);

  const itemsByDay = getItemsByDay();

  // Auto-generate itinerary if requested
  useEffect(() => {
    if (autoGenerate && !hasTriggeredAutoGenerate && !loading && !generating && items.length === 0) {
      setHasTriggeredAutoGenerate(true);
      handleGenerateAI().then(() => {
        onAutoGenerateComplete?.();
      });
    }
  }, [autoGenerate, hasTriggeredAutoGenerate, loading, generating, items.length]);

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleGenerateAI = async () => {
    const result = await generateAIItinerary({
      tripName,
      startDate,
      endDate,
      budget,
      description: description || undefined,
    });
    
    if (!result.error) {
      // Expand all days after generation
      const allDays = new Set(Array.from({ length: tripDuration }, (_, i) => i + 1));
      setExpandedDays(allDays);
    }
  };

  const handleAddItem = async (dayNumber: number) => {
    if (!newItem.title.trim()) return;

    const { error } = await addItem({
      day_number: dayNumber,
      time_slot: newItem.time_slot || undefined,
      title: newItem.title,
      description: newItem.description || undefined,
      location: newItem.location || undefined,
      estimated_cost: newItem.estimated_cost,
      duration_minutes: newItem.duration_minutes,
      category: newItem.category,
    });

    if (!error) {
      setNewItem({
        time_slot: "",
        title: "",
        description: "",
        location: "",
        estimated_cost: 0,
        duration_minutes: 60,
        category: "activity",
      });
      setIsAddingItem(null);
      toast({ title: "Activity added successfully!" });
    }
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item.id);
    setEditForm({
      time_slot: item.time_slot,
      title: item.title,
      description: item.description,
      location: item.location,
      estimated_cost: item.estimated_cost,
      duration_minutes: item.duration_minutes,
      category: item.category,
    });
  };

  const handleSaveEdit = async (itemId: string) => {
    const { error } = await updateItem(itemId, editForm);
    if (!error) {
      setEditingItem(null);
      setEditForm({});
      toast({ title: "Activity updated successfully!" });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
    toast({ title: "Activity deleted" });
  };

  const getDayDate = (dayNumber: number) => {
    const date = addDays(parseISO(startDate), dayNumber - 1);
    return format(date, "EEE, MMM d");
  };

  const getTotalCostForDay = (dayItems: ItineraryItem[]) => {
    return dayItems.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);
  };

  const getTotalCost = () => {
    return items.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);
  };

  // Export as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(tripName, 20, 20);
    
    // Trip details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${format(parseISO(startDate), "MMM d, yyyy")} - ${format(parseISO(endDate), "MMM d, yyyy")}`, 20, 30);
    doc.text(`Total Budget: Rs. ${budget?.toLocaleString("en-IN") || "N/A"}`, 20, 38);
    doc.text(`Estimated Cost: Rs. ${getTotalCost().toLocaleString("en-IN")}`, 20, 46);
    
    let yPos = 60;
    
    // Iterate through days
    for (let day = 1; day <= tripDuration; day++) {
      const dayItems = itemsByDay[day] || [];
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Day header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day} - ${getDayDate(day)}`, 20, yPos);
      yPos += 8;
      
      if (dayItems.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("No activities planned", 25, yPos);
        yPos += 12;
      } else {
        dayItems.forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          const timeText = item.time_slot ? `${item.time_slot} - ` : "";
          doc.text(`${timeText}${item.title}`, 25, yPos);
          yPos += 6;
          
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          if (item.location) {
            doc.text(`Location: ${item.location}`, 30, yPos);
            yPos += 5;
          }
          if (item.description) {
            const descLines = doc.splitTextToSize(item.description, 150);
            doc.text(descLines, 30, yPos);
            yPos += descLines.length * 4;
          }
          if (item.estimated_cost && item.estimated_cost > 0) {
            doc.text(`Cost: Rs. ${Number(item.estimated_cost).toLocaleString("en-IN")}`, 30, yPos);
            yPos += 5;
          }
          yPos += 4;
        });
      }
      yPos += 6;
    }
    
    // Save PDF
    doc.save(`${tripName.replace(/\s+/g, "_")}_Itinerary.pdf`);
    toast({ title: "PDF downloaded successfully!" });
  };

  // Generate shareable text
  const getShareableText = () => {
    let text = `🌍 ${tripName}\n`;
    text += `📅 ${format(parseISO(startDate), "MMM d")} - ${format(parseISO(endDate), "MMM d, yyyy")}\n`;
    text += `💰 Budget: ₹${budget?.toLocaleString("en-IN") || "N/A"}\n\n`;
    
    for (let day = 1; day <= tripDuration; day++) {
      const dayItems = itemsByDay[day] || [];
      text += `📍 Day ${day} - ${getDayDate(day)}\n`;
      
      if (dayItems.length === 0) {
        text += "   No activities planned\n";
      } else {
        dayItems.forEach((item) => {
          const time = item.time_slot ? `${item.time_slot} ` : "";
          text += `   ${time}${item.title}`;
          if (item.location) text += ` @ ${item.location}`;
          if (item.estimated_cost && item.estimated_cost > 0) text += ` (₹${item.estimated_cost})`;
          text += "\n";
        });
      }
      text += "\n";
    }
    
    text += `Total Estimated: ₹${getTotalCost().toLocaleString("en-IN")}`;
    return text;
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareableText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast({ title: "Opening WhatsApp..." });
  };

  // Share via Email
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Trip Itinerary: ${tripName}`);
    const body = encodeURIComponent(getShareableText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast({ title: "Opening email client..." });
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableText());
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Trip Itinerary
          </h2>
          <p className="text-muted-foreground text-sm">
            {items.length} activities planned • ₹{getTotalCost().toLocaleString("en-IN")} estimated
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Share Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShareWhatsApp}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Share via WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Share via Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyToClipboard}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Export PDF */}
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          
          {/* Generate AI */}
          <Button
            onClick={handleGenerateAI}
            disabled={generating}
            className="btn-gradient"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {Array.from({ length: tripDuration }, (_, i) => i + 1).map((dayNumber) => {
          const dayItems = itemsByDay[dayNumber] || [];
          const isExpanded = expandedDays.has(dayNumber);
          const dayTotalCost = getTotalCostForDay(dayItems);

          return (
            <motion.div
              key={dayNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayNumber * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayNumber)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary">
                      {dayNumber}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      Day {dayNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getDayDate(dayNumber)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {dayItems.length} activities
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      ₹{dayTotalCost.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Day Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">
                      {dayItems.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No activities planned for this day
                        </p>
                      ) : (
                        dayItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl group"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                categoryColors[item.category] || categoryColors.activity
                              }`}
                            >
                              {categoryIcons[item.category] || categoryIcons.activity}
                            </div>
                            
                            {editingItem === item.id ? (
                              // Edit Mode
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Title"
                                    value={editForm.title || ""}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Time (e.g., 9:00 AM)"
                                    value={editForm.time_slot || ""}
                                    onChange={(e) => setEditForm({ ...editForm, time_slot: e.target.value })}
                                  />
                                </div>
                                <Textarea
                                  placeholder="Description"
                                  value={editForm.description || ""}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  rows={2}
                                />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <Input
                                    placeholder="Location"
                                    value={editForm.location || ""}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Cost"
                                    value={editForm.estimated_cost || ""}
                                    onChange={(e) => setEditForm({ ...editForm, estimated_cost: Number(e.target.value) })}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Duration (min)"
                                    value={editForm.duration_minutes || ""}
                                    onChange={(e) => setEditForm({ ...editForm, duration_minutes: Number(e.target.value) })}
                                  />
                                  <Select
                                    value={editForm.category || "activity"}
                                    onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="sightseeing">Sightseeing</SelectItem>
                                      <SelectItem value="food">Food</SelectItem>
                                      <SelectItem value="transport">Transport</SelectItem>
                                      <SelectItem value="accommodation">Accommodation</SelectItem>
                                      <SelectItem value="shopping">Shopping</SelectItem>
                                      <SelectItem value="adventure">Adventure</SelectItem>
                                      <SelectItem value="cultural">Cultural</SelectItem>
                                      <SelectItem value="activity">Activity</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                    <X className="w-4 h-4 mr-1" /> Cancel
                                  </Button>
                                  <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                                    <Save className="w-4 h-4 mr-1" /> Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // View Mode
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {item.title}
                                    </p>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleEditItem(item)}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  {item.time_slot && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {item.time_slot}
                                    </span>
                                  )}
                                  {item.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.location}
                                    </span>
                                  )}
                                  {item.estimated_cost > 0 && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      ₹{Number(item.estimated_cost).toLocaleString("en-IN")}
                                    </span>
                                  )}
                                  {item.duration_minutes && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {item.duration_minutes} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}

                      {/* Add Activity Form */}
                      {isAddingItem === dayNumber ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-secondary/50 rounded-xl space-y-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              placeholder="Activity title"
                              value={newItem.title}
                              onChange={(e) =>
                                setNewItem({ ...newItem, title: e.target.value })
                              }
                            />
                            <Input
                              placeholder="Time (e.g., 9:00 AM)"
                              value={newItem.time_slot}
                              onChange={(e) =>
                                setNewItem({ ...newItem, time_slot: e.target.value })
                              }
                            />
                          </div>
                          <Textarea
                            placeholder="Description (optional)"
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({ ...newItem, description: e.target.value })
                            }
                            rows={2}
                          />
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Input
                              placeholder="Location"
                              value={newItem.location}
                              onChange={(e) =>
                                setNewItem({ ...newItem, location: e.target.value })
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Cost (₹)"
                              value={newItem.estimated_cost || ""}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  estimated_cost: Number(e.target.value),
                                })
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Duration (min)"
                              value={newItem.duration_minutes || ""}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  duration_minutes: Number(e.target.value),
                                })
                              }
                            />
                            <Select
                              value={newItem.category}
                              onValueChange={(value) =>
                                setNewItem({ ...newItem, category: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sightseeing">Sightseeing</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="accommodation">Accommodation</SelectItem>
                                <SelectItem value="shopping">Shopping</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                                <SelectItem value="cultural">Cultural</SelectItem>
                                <SelectItem value="activity">Activity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingItem(null)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddItem(dayNumber)}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save Activity
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={() => setIsAddingItem(dayNumber)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
