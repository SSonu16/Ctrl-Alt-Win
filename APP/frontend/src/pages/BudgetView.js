import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, DollarSign, Save } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [tripData, budgetData] = await Promise.all([
        apiRequest(`/trips/${id}`),
        apiRequest(`/budget/trips/${id}`),
      ]);

      setTrip(tripData);
      setBudget(budgetData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await apiRequest(`/budget/trips/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          transport_cost: parseFloat(budget.transport_cost) || 0,
          stay_cost: parseFloat(budget.stay_cost) || 0,
          meals_cost: parseFloat(budget.meals_cost) || 0,
          activities_cost: parseFloat(budget.activities_cost) || 0,
        }),
      });

      setBudget(updated);
      toast.success("Budget updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const chartData = budget ? {
    labels: ['Transport', 'Accommodation', 'Meals', 'Activities'],
    datasets: [
      {
        data: [
          budget.transport_cost,
          budget.stay_cost,
          budget.meals_cost,
          budget.activities_cost,
        ],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(14, 165, 233, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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
    <div data-testid="budget-view-page" className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-pink-50">
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
            Budget & Cost Breakdown
          </h1>
          <p className="text-gray-600">{trip?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Edit Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transport">Transport Cost ($)</Label>
                <Input
                  id="transport"
                  data-testid="transport-cost-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget?.transport_cost || 0}
                  onChange={(e) => setBudget({ ...budget, transport_cost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stay">Accommodation Cost ($)</Label>
                <Input
                  id="stay"
                  data-testid="stay-cost-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget?.stay_cost || 0}
                  onChange={(e) => setBudget({ ...budget, stay_cost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meals">Meals Cost ($)</Label>
                <Input
                  id="meals"
                  data-testid="meals-cost-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget?.meals_cost || 0}
                  onChange={(e) => setBudget({ ...budget, meals_cost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activities">Activities Cost ($)</Label>
                <Input
                  id="activities"
                  data-testid="activities-cost-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget?.activities_cost || 0}
                  onChange={(e) => setBudget({ ...budget, activities_cost: e.target.value })}
                  disabled
                />
                <p className="text-xs text-gray-500">Automatically calculated from added activities</p>
              </div>

              <Button
                data-testid="save-budget-btn"
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white font-semibold"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Budget"}
              </Button>
            </CardContent>
          </Card>

          {/* Budget Visualization */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div data-testid="total-budget" className="text-5xl font-bold text-center text-sky-600">
                  ${budget?.total_cost?.toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {budget && budget.total_cost > 0 ? (
                  <div data-testid="budget-chart" style={{ height: '300px' }}>
                    <Pie data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign className="mx-auto mb-2" size={48} />
                    <p>No budget data yet</p>
                    <p className="text-sm mt-1">Add budget items to see the breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Breakdown Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div data-testid="breakdown-transport" className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
                  <span className="font-medium">Transport</span>
                  <span className="text-sky-600 font-semibold">${budget?.transport_cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div data-testid="breakdown-stay" className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">Accommodation</span>
                  <span className="text-orange-600 font-semibold">${budget?.stay_cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div data-testid="breakdown-meals" className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="font-medium">Meals</span>
                  <span className="text-pink-600 font-semibold">${budget?.meals_cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div data-testid="breakdown-activities" className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Activities</span>
                  <span className="text-green-600 font-semibold">${budget?.activities_cost?.toFixed(2) || '0.00'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}