import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  async createFinancialRecord(userId: string, createFinancialRecordDto: CreateFinancialRecordDto) {
    return this.prisma.financialRecord.create({
      data: {
        userId,
        type: createFinancialRecordDto.type,
        date: createFinancialRecordDto.date,
        category: createFinancialRecordDto.category,
        description: createFinancialRecordDto.description,
        amount: createFinancialRecordDto.amount,
        paymentMethod: createFinancialRecordDto.paymentMethod,
        reference: createFinancialRecordDto.reference,
        metadata: createFinancialRecordDto.attachments ? { attachments: createFinancialRecordDto.attachments } : undefined,
      },
    });
  }

  async getFinancialRecords(userId: string, farmId?: string, recordType?: string, category?: string) {
    const where: any = { userId };
    if (recordType) where.type = recordType;
    if (category) where.category = category;

    return this.prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getFinancialRecord(id: string, userId: string) {
    return this.prisma.financialRecord.findFirst({
      where: { id, userId },
    });
  }

  async updateFinancialRecord(id: string, userId: string, updateFinancialRecordDto: UpdateFinancialRecordDto) {
    const updateData: any = { ...updateFinancialRecordDto };
    
    return this.prisma.financialRecord.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteFinancialRecord(id: string, userId: string) {
    return this.prisma.financialRecord.delete({
      where: { id },
    });
  }

  // Get financial summary
  async getFinancialSummary(userId: string, period?: string) {
    const dateFilter = this.getDateFilter(period);
    
    const records = await this.prisma.financialRecord.findMany({
      where: {
        userId,
        date: dateFilter,
      },
    });

    const revenue = records
      .filter(record => record.type === 'revenue')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    const expenses = records
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    const profit = revenue - expenses;

    const expenseCategories = records
      .filter(record => record.type === 'expense')
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + Number(record.amount);
        return acc;
      }, {} as Record<string, number>);

    const revenueCategories = records
      .filter(record => record.type === 'revenue')
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + Number(record.amount);
        return acc;
      }, {} as Record<string, number>);

    return {
      revenue,
      expenses,
      profit,
      expenseCategories,
      revenueCategories,
      recordsCount: records.length,
      recentRecords: records.slice(0, 10),
    };
  }

  // Get profit and loss statement
  async getProfitLossStatement(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const records = await this.prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const monthlyData = records.reduce((acc, record) => {
      const month = record.date.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { revenue: 0, expenses: 0, profit: 0 };
      }
      if (record.type === 'revenue') {
        acc[month].revenue += Number(record.amount);
        acc[month].profit += Number(record.amount);
      } else {
        acc[month].expenses += Number(record.amount);
        acc[month].profit -= Number(record.amount);
      }
      return acc;
    }, {} as Record<string, { revenue: number; expenses: number; profit: number }>);

    return {
      monthlyData,
      totalRevenue: Object.values(monthlyData).reduce((sum, month) => sum + month.revenue, 0),
      totalExpenses: Object.values(monthlyData).reduce((sum, month) => sum + month.expenses, 0),
      totalProfit: Object.values(monthlyData).reduce((sum, month) => sum + month.profit, 0),
    };
  }

  // Loan management
  async createLoanRequest(userId: string, createLoanRequestDto: CreateLoanRequestDto) {
    return this.prisma.serviceRequest.create({
      data: {
        userId,
        serviceType: 'loan',
        title: createLoanRequestDto.title,
        description: createLoanRequestDto.description || '',
        priority: (createLoanRequestDto.urgency || 'medium') as string,
        metadata: {
          amount: createLoanRequestDto.amount,
          requestType: 'loan',
        },
      },
    });
  }

  async getLoanRequests(userId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        userId,
        serviceType: 'loan',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin methods
  async getAllFinancialStats(period?: string) {
    const dateFilter = this.getDateFilter(period);
    
    const records = await this.prisma.financialRecord.findMany({
      where: {
        date: dateFilter,
      },
    });

    const totalRevenue = records
      .filter(record => record.type === 'revenue')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    const totalExpenses = records
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    const totalProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      recordsCount: records.length,
    };
  }

  async getAllLoanRequests() {
    return this.prisma.serviceRequest.findMany({
      where: {
        serviceType: 'loan',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Additional methods required by resolver
  async getLoanRequest(id: string, userId: string) {
    return this.prisma.serviceRequest.findFirst({
      where: { id, userId, serviceType: 'loan' },
    });
  }

  async getActiveLoans(userId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        userId,
        serviceType: 'loan',
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFinancialStats(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const records = await this.prisma.financialRecord.findMany({ where });

    const totalRevenue = records
      .filter(record => record.type === 'revenue')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    const totalExpenses = records
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + Number(record.amount), 0);

    return {
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      recordsCount: records.length,
    };
  }

  async getAdminFinancialStats(region?: string, district?: string) {
    return this.getAllFinancialStats();
  }

  async getExpenseAnalysis(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId, type: 'expense' };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const expenses = await this.prisma.financialRecord.findMany({ where });
    
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      categoryBreakdown,
      expenseCount: expenses.length,
    };
  }

  async getIncomeAnalysis(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId, type: 'revenue' };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const income = await this.prisma.financialRecord.findMany({ where });
    
    const categoryBreakdown = income.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIncome: income.reduce((sum, i) => sum + Number(i.amount), 0),
      categoryBreakdown,
      incomeCount: income.length,
    };
  }

  async getCashFlowStatement(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const records = await this.prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const cashFlow = records.map(record => ({
      date: record.date,
      description: record.description || record.category,
      inflow: record.type === 'revenue' ? Number(record.amount) : 0,
      outflow: record.type === 'expense' ? Number(record.amount) : 0,
      netCash: record.type === 'revenue' ? Number(record.amount) : -Number(record.amount),
    }));

    const totalInflow = cashFlow.reduce((sum, item) => sum + item.inflow, 0);
    const totalOutflow = cashFlow.reduce((sum, item) => sum + item.outflow, 0);
    const netCashFlow = totalInflow - totalOutflow;

    return {
      cashFlow,
      totalInflow,
      totalOutflow,
      netCashFlow,
    };
  }

  async updateLoanRequest(id: string, userId: string, updateData: any) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteLoanRequest(id: string, userId: string) {
    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  async approveLoanRequest(id: string, approvalData: any) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        metadata: approvalData,
      },
    });
  }

  async rejectLoanRequest(id: string, rejectionReason: string) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        metadata: { rejectionReason },
      },
    });
  }

  async disburseLoan(id: string) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'DISBURSED',
        completedAt: new Date(),
      },
    });
  }

  async recordLoanPayment(loanId: string, userId: string, paymentData: any) {
    // Create a financial record for the loan payment
    return this.prisma.financialRecord.create({
      data: {
        userId,
        type: 'expense',
        category: 'loan_payment',
        description: `Loan payment for loan ${loanId}`,
        amount: paymentData.amount,
        date: paymentData.date || new Date(),
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        metadata: { loanId, ...paymentData },
      },
    });
  }

  async generateFinancialReport(userId: string, reportConfig: any) {
    const { startDate, endDate, reportType } = reportConfig;
    
    const where: any = { userId };
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const records = await this.prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return {
      reportType,
      period: { startDate, endDate },
      summary: await this.getFinancialSummary(userId),
      profitLoss: await this.getProfitLossStatement(userId, new Date(startDate), new Date(endDate)),
      records,
      generatedAt: new Date(),
    };
  }

  private getDateFilter(period?: string) {
    const now = new Date();
    switch (period) {
      case 'week':
        return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      case 'month':
        return { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
      case 'year':
        return { gte: new Date(now.getFullYear(), 0, 1) };
      default:
        return undefined;
    }
  }
}
