import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { feedingAPI } from "@/utils/api";
import { Leaf, Calendar, TrendingUp, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import type { User } from "@/utils/types";

interface FeedingManagerProps {
  user: User;
}

interface FeedingRecord {
  id: string;
  date: string;
  feedType: string;
  quantity: number;
  cost: number;
  notes?: string;
  birdCount: number;
}

export function FeedingManager({ user }: FeedingManagerProps) {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FeedingRecord | null>(null);

  useEffect(() => {
    loadFeedingData();
  }, []);

  const loadFeedingData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, statsResponse] = await Promise.all([
        feedingAPI.getRecords({ farmId: user.id }),
        feedingAPI.getStats({ farmId: user.id })
      ]);

      if (recordsResponse.success) {
        setFeedingRecords(recordsResponse.data || []);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data || {});
      }
    } catch (error) {
      console.error("Failed to load feeding data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (recordData: Partial<FeedingRecord>) => {
    try {
      const response = await feedingAPI.createRecord({
        ...recordData,
        userId: user.id,
        date: new Date().toISOString(),
      });

      if (response.success) {
        await loadFeedingData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add feeding record:", error);
    }
  };

  const handleUpdateRecord = async (id: string, recordData: Partial<FeedingRecord>) => {
    try {
      const response = await feedingAPI.updateRecord(id, recordData);

      if (response.success) {
        await loadFeedingData();
        setEditingRecord(null);
      }
    } catch (error) {
      console.error("Failed to update feeding record:", error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feeding record?")) {
      try {
        const response = await feedingAPI.deleteRecord(id);
        if (response.success) {
          await loadFeedingData();
        }
      } catch (error) {
        console.error("Failed to delete feeding record:", error);
      }
    }
  };

  const FeedingForm = ({ record, onSubmit, onCancel }: { 
    record?: FeedingRecord | null; 
    onSubmit: (data: Partial<FeedingRecord>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      feedType: record?.feedType || "",
      quantity: record?.quantity || 0,
      cost: record?.cost || 0,
      notes: record?.notes || "",
      birdCount: record?.birdCount || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{record ? "Edit Feeding Record" : "Add Feeding Record"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Feed Type</label>
                <select
                  value={formData.feedType}
                  onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select feed type</option>
                  <option value="STARTER">Starter Feed</option>
                  <option value="GROWER">Grower Feed</option>
                  <option value="FINISHER">Finisher Feed</option>
                  <option value="LAYER">Layer Feed</option>
                  <option value="BROILER">Broiler Feed</option>
                  <option value="SUPPLEMENT">Supplement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost (TZS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bird Count</label>
                <input
                  type="number"
                  value={formData.birdCount}
                  onChange={(e) => setFormData({ ...formData, birdCount: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {record ? "Update" : "Add"} Record
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading feeding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Feed</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayFeed || 0}kg</div>
            <p className="text-xs text-muted-foreground">Consumed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyAvg || 0}kg</div>
            <p className="text-xs text-muted-foreground">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Efficiency</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.efficiency || 0}%</div>
            <p className="text-xs text-muted-foreground">Conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {stats.monthlyCost || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Record Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feeding Records</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingRecord) && (
        <FeedingForm
          record={editingRecord}
          onSubmit={editingRecord ? 
            (data) => handleUpdateRecord(editingRecord.id, data) : 
            handleAddRecord
          }
          onCancel={() => {
            setShowAddForm(false);
            setEditingRecord(null);
          }}
        />
      )}

      {/* Records List */}
      <div className="space-y-4">
        {feedingRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No feeding records yet</p>
              <p className="text-sm text-gray-500">Add your first feeding record to get started</p>
            </CardContent>
          </Card>
        ) : (
          feedingRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{record.feedType}</h3>
                      <Badge variant="secondary">{record.quantity}kg</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p>{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <p>TZS {record.cost}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Birds:</span>
                        <p>{record.birdCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Per Bird:</span>
                        <p>{(record.quantity / record.birdCount).toFixed(2)}kg</p>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Notes:</span>
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingRecord(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
