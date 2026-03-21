import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { healthAPI } from "@/utils/api";
import { Heart, Stethoscope, AlertTriangle, Calendar, Plus, Edit, Trash2, Shield } from "lucide-react";
import type { User } from "@/utils/types";

interface HealthRecord {
  id: string;
  date: string;
  type: "CHECKUP" | "VACCINATION" | "TREATMENT" | "EMERGENCY";
  description: string;
  symptoms?: string;
  treatment?: string;
  medication?: string;
  cost?: number;
  veterinarian?: string;
  affectedBirds: number;
  status: "HEALTHY" | "SICK" | "RECOVERING" | "TREATED";
}

interface VaccinationRecord {
  id: string;
  vaccineType: string;
  date: string;
  nextDue: string;
  birdCount: number;
  administeredBy: string;
}

export function HealthManager({ user }: HealthManagerProps) {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"records" | "vaccinations">("records");

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, vaccinationsResponse, statsResponse] = await Promise.all([
        healthAPI.getRecords({ farmId: user.id }),
        healthAPI.getVaccinations({ farmId: user.id }),
        healthAPI.getStats({ farmId: user.id })
      ]);

      if (recordsResponse.success) {
        setHealthRecords(recordsResponse.data || []);
      }
      if (vaccinationsResponse.success) {
        setVaccinationRecords(vaccinationsResponse.data || []);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data || {});
      }
    } catch (error) {
      console.error("Failed to load health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (recordData: Partial<HealthRecord>) => {
    try {
      const response = await healthAPI.createRecord({
        ...recordData,
        userId: user.id,
        date: new Date().toISOString(),
      });

      if (response.success) {
        await loadHealthData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add health record:", error);
    }
  };

  const handleUpdateRecord = async (id: string, recordData: Partial<HealthRecord>) => {
    try {
      const response = await healthAPI.updateRecord(id, recordData);

      if (response.success) {
        await loadHealthData();
        setEditingRecord(null);
      }
    } catch (error) {
      console.error("Failed to update health record:", error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this health record?")) {
      try {
        const response = await healthAPI.deleteRecord(id);
        if (response.success) {
          await loadHealthData();
        }
      } catch (error) {
        console.error("Failed to delete health record:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HEALTHY": return "bg-green-100 text-green-800";
      case "SICK": return "bg-red-100 text-red-800";
      case "RECOVERING": return "bg-yellow-100 text-yellow-800";
      case "TREATED": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "CHECKUP": return <Stethoscope className="h-4 w-4" />;
      case "VACCINATION": return <Shield className="h-4 w-4" />;
      case "TREATMENT": return <Heart className="h-4 w-4" />;
      case "EMERGENCY": return <AlertTriangle className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const HealthForm = ({ record, onSubmit, onCancel }: { 
    record?: HealthRecord | null; 
    onSubmit: (data: Partial<HealthRecord>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      type: record?.type || "CHECKUP",
      description: record?.description || "",
      symptoms: record?.symptoms || "",
      treatment: record?.treatment || "",
      medication: record?.medication || "",
      cost: record?.cost || 0,
      veterinarian: record?.veterinarian || "",
      affectedBirds: record?.affectedBirds || 0,
      status: record?.status || "HEALTHY",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{record ? "Edit Health Record" : "Add Health Record"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Record Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="CHECKUP">Regular Checkup</option>
                  <option value="VACCINATION">Vaccination</option>
                  <option value="TREATMENT">Treatment</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="HEALTHY">Healthy</option>
                  <option value="SICK">Sick</option>
                  <option value="RECOVERING">Recovering</option>
                  <option value="TREATED">Treated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Affected Birds</label>
                <input
                  type="number"
                  value={formData.affectedBirds}
                  onChange={(e) => setFormData({ ...formData, affectedBirds: parseInt(e.target.value) })}
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
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symptoms</label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Treatment</label>
              <textarea
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medication</label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Veterinarian</label>
              <input
                type="text"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                className="w-full p-2 border rounded"
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
          <p className="mt-2 text-gray-600">Loading health data...</p>
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
            <CardTitle className="text-sm font-medium">Healthy Birds</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.healthyBirds || 0}%</div>
            <p className="text-xs text-muted-foreground">Health rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Treatment</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sickBirds || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Vaccination</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nextVaccination || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Costs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {stats.monthlyCost || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === "records" ? "default" : "ghost"}
          onClick={() => setActiveTab("records")}
        >
          Health Records
        </Button>
        <Button
          variant={activeTab === "vaccinations" ? "default" : "ghost"}
          onClick={() => setActiveTab("vaccinations")}
        >
          Vaccinations
        </Button>
      </div>

      {/* Health Records Tab */}
      {activeTab === "records" && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Health Records</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingRecord) && (
            <HealthForm
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
            {healthRecords.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No health records yet</p>
                  <p className="text-sm text-gray-500">Add your first health record to get started</p>
                </CardContent>
              </Card>
            ) : (
              healthRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(record.type)}
                          <h3 className="font-medium">{record.type.replace("_", " ")}</h3>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p>{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Affected:</span>
                            <p>{record.affectedBirds} birds</p>
                          </div>
                          {record.cost && (
                            <div>
                              <span className="text-gray-500">Cost:</span>
                              <p>TZS {record.cost}</p>
                            </div>
                          )}
                          {record.veterinarian && (
                            <div>
                              <span className="text-gray-500">Vet:</span>
                              <p>{record.veterinarian}</p>
                            </div>
                          )}
                        </div>
                        {record.symptoms && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Symptoms:</span>
                            <p className="text-sm">{record.symptoms}</p>
                          </div>
                        )}
                        {record.treatment && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Treatment:</span>
                            <p className="text-sm">{record.treatment}</p>
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
        </>
      )}

      {/* Vaccinations Tab */}
      {activeTab === "vaccinations" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vaccination Schedule</h2>
          
          {vaccinationRecords.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No vaccination records yet</p>
                <p className="text-sm text-gray-500">Vaccination records will appear here</p>
              </CardContent>
            </Card>
          ) : (
            vaccinationRecords.map((vaccine) => (
              <Card key={vaccine.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{vaccine.vaccineType}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p>{new Date(vaccine.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Next Due:</span>
                          <p>{new Date(vaccine.nextDue).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Birds:</span>
                          <p>{vaccine.birdCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Administered by:</span>
                          <p>{vaccine.administeredBy}</p>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={new Date(vaccine.nextDue) <= new Date() ? "destructive" : "secondary"}
                    >
                      {new Date(vaccine.nextDue) <= new Date() ? "Due" : "Scheduled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
