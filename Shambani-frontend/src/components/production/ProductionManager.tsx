import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { productionAPI } from "@/utils/api";
import { Bird, TrendingUp, AlertTriangle, Egg, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import type { User } from "@/utils/types";

interface ProductionRecord {
  id: string;
  date: string;
  recordType: "EGGS" | "CHICKS" | "MORTALITY" | "WEIGHT";
  value: number;
  notes?: string;
  houseId?: string;
  birdAge?: string;
}

interface EggProduction {
  id: string;
  date: string;
  totalEggs: number;
  brokenEggs: number;
  smallEggs: number;
  largeEggs: number;
  houseId?: string;
}

export function ProductionManager({ user }: ProductionManagerProps) {
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([]);
  const [eggProduction, setEggProduction] = useState<EggProduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "eggs" | "chicks" | "mortality" | "weight">("overview");

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, eggResponse, statsResponse] = await Promise.all([
        productionAPI.getRecords({ farmId: user.id }),
        productionAPI.getEggStats({ farmId: user.id }),
        productionAPI.getDashboard({ farmId: user.id })
      ]);

      if (recordsResponse.success) {
        setProductionRecords(recordsResponse.data || []);
      }
      if (eggResponse.success) {
        setEggProduction(eggResponse.data || []);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data || {});
      }
    } catch (error) {
      console.error("Failed to load production data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (recordData: Partial<ProductionRecord>) => {
    try {
      const response = await productionAPI.createRecord({
        ...recordData,
        userId: user.id,
        date: new Date().toISOString(),
      });

      if (response.success) {
        await loadProductionData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add production record:", error);
    }
  };

  const handleUpdateRecord = async (id: string, recordData: Partial<ProductionRecord>) => {
    try {
      const response = await productionAPI.updateRecord(id, recordData);

      if (response.success) {
        await loadProductionData();
        setEditingRecord(null);
      }
    } catch (error) {
      console.error("Failed to update production record:", error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this production record?")) {
      try {
        const response = await productionAPI.deleteRecord(id);
        if (response.success) {
          await loadProductionData();
        }
      } catch (error) {
        console.error("Failed to delete production record:", error);
      }
    }
  };

  const handleAddEggProduction = async (eggData: Partial<EggProduction>) => {
    try {
      const response = await productionAPI.createEggProduction({
        ...eggData,
        userId: user.id,
        date: new Date().toISOString(),
      });

      if (response.success) {
        await loadProductionData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add egg production record:", error);
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "EGGS": return <Egg className="h-4 w-4" />;
      case "CHICKS": return <Bird className="h-4 w-4" />;
      case "MORTALITY": return <AlertTriangle className="h-4 w-4" />;
      case "WEIGHT": return <TrendingUp className="h-4 w-4" />;
      default: return <Bird className="h-4 w-4" />;
    }
  };

  const ProductionForm = ({ record, onSubmit, onCancel }: { 
    record?: ProductionRecord | null; 
    onSubmit: (data: Partial<ProductionRecord>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      recordType: record?.recordType || "EGGS",
      value: record?.value || 0,
      notes: record?.notes || "",
      houseId: record?.houseId || "",
      birdAge: record?.birdAge || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{record ? "Edit Production Record" : "Add Production Record"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Record Type</label>
                <select
                  value={formData.recordType}
                  onChange={(e) => setFormData({ ...formData, recordType: e.target.value as any })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="EGGS">Egg Production</option>
                  <option value="CHICKS">Chick Production</option>
                  <option value="MORTALITY">Mortality</option>
                  <option value="WEIGHT">Weight Measurement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.recordType === "WEIGHT" ? "Weight (g)" : "Count"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">House ID</label>
                <input
                  type="text"
                  value={formData.houseId}
                  onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., House A, House 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bird Age</label>
                <input
                  type="text"
                  value={formData.birdAge}
                  onChange={(e) => setFormData({ ...formData, birdAge: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 4 weeks, 8 weeks"
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

  const EggProductionForm = ({ onSubmit, onCancel }: { 
    onSubmit: (data: Partial<EggProduction>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      totalEggs: 0,
      brokenEggs: 0,
      smallEggs: 0,
      largeEggs: 0,
      houseId: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Egg Production Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total Eggs</label>
                <input
                  type="number"
                  value={formData.totalEggs}
                  onChange={(e) => setFormData({ ...formData, totalEggs: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Broken Eggs</label>
                <input
                  type="number"
                  value={formData.brokenEggs}
                  onChange={(e) => setFormData({ ...formData, brokenEggs: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Small Eggs</label>
                <input
                  type="number"
                  value={formData.smallEggs}
                  onChange={(e) => setFormData({ ...formData, smallEggs: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Large Eggs</label>
                <input
                  type="number"
                  value={formData.largeEggs}
                  onChange={(e) => setFormData({ ...formData, largeEggs: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">House ID</label>
                <input
                  type="text"
                  value={formData.houseId}
                  onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., House A, House 1"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Add Record</Button>
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
          <p className="mt-2 text-gray-600">Loading production data...</p>
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
            <CardTitle className="text-sm font-medium">Today's Eggs</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayEggs || 0}</div>
            <p className="text-xs text-muted-foreground">Eggs collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chicks Hatched</CardTitle>
            <Bird className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chicksHatched || 0}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.mortalityRate || 0}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWeight || 0}g</div>
            <p className="text-xs text-muted-foreground">Current average</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "eggs" ? "default" : "ghost"}
          onClick={() => setActiveTab("eggs")}
        >
          Egg Production
        </Button>
        <Button
          variant={activeTab === "chicks" ? "default" : "ghost"}
          onClick={() => setActiveTab("chicks")}
        >
          Chicks
        </Button>
        <Button
          variant={activeTab === "mortality" ? "default" : "ghost"}
          onClick={() => setActiveTab("mortality")}
        >
          Mortality
        </Button>
        <Button
          variant={activeTab === "weight" ? "default" : "ghost"}
          onClick={() => setActiveTab("weight")}
        >
          Weight
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Production</CardTitle>
                <CardDescription>Latest production records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getRecordTypeIcon(record.recordType)}
                        <span className="text-sm">{record.recordType}</span>
                      </div>
                      <span className="font-medium">{record.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Trends</CardTitle>
                <CardDescription>Weekly production summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Egg Production</span>
                    <Badge variant="secondary">+12%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Chick Survival</span>
                    <Badge className="bg-green-100 text-green-800">95%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Feed Efficiency</span>
                    <Badge variant="outline">2.1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Egg Production Tab */}
      {activeTab === "eggs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Egg Production Records</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Egg Record
            </Button>
          </div>

          {showAddForm && (
            <EggProductionForm
              onSubmit={handleAddEggProduction}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          <div className="space-y-4">
            {eggProduction.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{new Date(record.date).toLocaleDateString()}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="font-medium">{record.totalEggs}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Broken:</span>
                          <p className="text-red-600">{record.brokenEggs}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Small:</span>
                          <p>{record.smallEggs}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Large:</span>
                          <p>{record.largeEggs}</p>
                        </div>
                      </div>
                      {record.houseId && (
                        <p className="text-sm text-gray-500 mt-1">House: {record.houseId}</p>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {((record.totalEggs - record.brokenEggs) / record.totalEggs * 100).toFixed(1)}% good
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs (chicks, mortality, weight) */}
      {(activeTab === "chicks" || activeTab === "mortality" || activeTab === "weight") && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold capitalize">{activeTab} Records</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {(showAddForm || editingRecord) && (
            <ProductionForm
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

          <div className="space-y-4">
            {productionRecords
              .filter(record => record.recordType === activeTab.toUpperCase())
              .map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getRecordTypeIcon(record.recordType)}
                          <h3 className="font-medium">{record.recordType}</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p>{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Value:</span>
                            <p className="font-medium">{record.value}</p>
                          </div>
                          {record.houseId && (
                            <div>
                              <span className="text-gray-500">House:</span>
                              <p>{record.houseId}</p>
                            </div>
                          )}
                          {record.birdAge && (
                            <div>
                              <span className="text-gray-500">Age:</span>
                              <p>{record.birdAge}</p>
                            </div>
                          )}
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
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
