import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { financialAPI } from "@/utils/api";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Plus, Edit, Trash2, PieChart } from "lucide-react";
import type { User } from "@/utils/types";

interface FinancialRecord {
  id: string;
  date: string;
  type: "REVENUE" | "EXPENSE" | "LOAN" | "INVESTMENT";
  category: string;
  amount: number;
  description: string;
  source?: string;
  status?: "PENDING" | "PAID" | "OVERDUE";
}

interface LoanRequest {
  id: string;
  amount: number;
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  applicationDate: string;
  dueDate?: string;
  interestRate?: number;
}

export function FinancialManager({ user }: { user: User }) {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "loans">("overview");

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, loansResponse, statsResponse] = await Promise.all([
        financialAPI.getRecords({ userId: user.id }),
        financialAPI.getLoans({ userId: user.id }),
        financialAPI.getSummary({ userId: user.id })
      ]);

      if (recordsResponse.success) {
        setFinancialRecords(recordsResponse.data || []);
      }
      if (loansResponse.success) {
        setLoanRequests(loansResponse.data || []);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data || {});
      }
    } catch (error) {
      console.error("Failed to load financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (recordData: Partial<FinancialRecord>) => {
    try {
      const response = await financialAPI.createRecord({
        ...recordData,
        userId: user.id,
        date: new Date().toISOString(),
      });

      if (response.success) {
        await loadFinancialData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add financial record:", error);
    }
  };

  const handleUpdateRecord = async (id: string, recordData: Partial<FinancialRecord>) => {
    try {
      const response = await financialAPI.updateRecord(id, recordData);

      if (response.success) {
        await loadFinancialData();
        setEditingRecord(null);
      }
    } catch (error) {
      console.error("Failed to update financial record:", error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this financial record?")) {
      try {
        const response = await financialAPI.deleteRecord(id);
        if (response.success) {
          await loadFinancialData();
        }
      } catch (error) {
        console.error("Failed to delete financial record:", error);
      }
    }
  };

  const handleLoanRequest = async (loanData: Partial<LoanRequest>) => {
    try {
      const response = await financialAPI.createLoan({
        ...loanData,
        userId: user.id,
        applicationDate: new Date().toISOString(),
      });

      if (response.success) {
        await loadFinancialData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to submit loan request:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REVENUE": return "bg-green-100 text-green-800";
      case "EXPENSE": return "bg-red-100 text-red-800";
      case "LOAN": return "bg-blue-100 text-blue-800";
      case "INVESTMENT": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const FinancialForm = ({ record, onSubmit, onCancel }: { 
    record?: FinancialRecord | null; 
    onSubmit: (data: Partial<FinancialRecord>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      type: record?.type || "EXPENSE",
      category: record?.category || "",
      amount: record?.amount || 0,
      description: record?.description || "",
      source: record?.source || "",
      status: record?.status || "PAID",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const getCategories = (type: string) => {
      switch (type) {
        case "REVENUE": return ["Egg Sales", "Chick Sales", "Manure Sales", "Services", "Other"];
        case "EXPENSE": return ["Feed", "Medicine", "Labor", "Equipment", "Utilities", "Other"];
        case "LOAN": return ["Business Loan", "Equipment Loan", "Emergency Loan"];
        case "INVESTMENT": return ["Equipment", "Infrastructure", "Technology"];
        default: return ["Other"];
      }
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{record ? "Edit Financial Record" : "Add Financial Record"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: "" })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="LOAN">Loan</option>
                  <option value="INVESTMENT">Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select category</option>
                  {getCategories(formData.type).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (TZS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
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
              <label className="block text-sm font-medium mb-1">Source/Recipient</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Customer name, Supplier name"
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

  const LoanForm = ({ onSubmit, onCancel }: { 
    onSubmit: (data: Partial<LoanRequest>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      amount: 0,
      purpose: "",
      dueDate: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Apply for Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Loan Amount (TZS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Describe how you plan to use the loan"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Submit Application</Button>
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
          <p className="mt-2 text-gray-600">Loading financial data...</p>
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">TZS {stats.revenue || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">TZS {stats.expenses || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">TZS {stats.profit || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {stats.activeLoans || 0}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
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
          variant={activeTab === "records" ? "default" : "ghost"}
          onClick={() => setActiveTab("records")}
        >
          Records
        </Button>
        <Button
          variant={activeTab === "loans" ? "default" : "ghost"}
          onClick={() => setActiveTab("loans")}
        >
          Loans
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{record.category}</p>
                        <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${record.type === "REVENUE" ? "text-green-600" : "text-red-600"}`}>
                          {record.type === "REVENUE" ? "+" : "-"} TZS {record.amount}
                        </p>
                        <Badge className={getStatusColor(record.status || "PAID")}>
                          {record.status || "PAID"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Monthly breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Growth</span>
                    <Badge variant="secondary">+15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expense Reduction</span>
                    <Badge className="bg-green-100 text-green-800">-8%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin</span>
                    <Badge variant="outline">23%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI</span>
                    <Badge variant="secondary">18%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Financial Records</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {(showAddForm || editingRecord) && (
            <FinancialForm
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
            {financialRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getTypeColor(record.type)}>
                          {record.type}
                        </Badge>
                        <h3 className="font-medium">{record.category}</h3>
                        <Badge className={getStatusColor(record.status || "PAID")}>
                          {record.status || "PAID"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p>{new Date(record.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className={`font-medium ${record.type === "REVENUE" ? "text-green-600" : "text-red-600"}`}>
                            {record.type === "REVENUE" ? "+" : "-"} TZS {record.amount}
                          </p>
                        </div>
                        {record.source && (
                          <div>
                            <span className="text-gray-500">Source:</span>
                            <p>{record.source}</p>
                          </div>
                        )}
                      </div>
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

      {/* Loans Tab */}
      {activeTab === "loans" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Loan Management</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Apply for Loan
            </Button>
          </div>

          {showAddForm && (
            <LoanForm
              onSubmit={handleLoanRequest}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          <div className="space-y-4">
            {loanRequests.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Loan Application</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium">TZS {loan.amount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Purpose:</span>
                          <p>{loan.purpose}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Applied:</span>
                          <p>{new Date(loan.applicationDate).toLocaleDateString()}</p>
                        </div>
                        {loan.dueDate && (
                          <div>
                            <span className="text-gray-500">Due:</span>
                            <p>{new Date(loan.dueDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      {loan.interestRate && (
                        <p className="text-sm text-gray-500 mt-1">Interest Rate: {loan.interestRate}%</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
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
