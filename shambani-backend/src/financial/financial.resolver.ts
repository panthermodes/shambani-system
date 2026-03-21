import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FinancialService } from '../financial/financial.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class FinancialResolver {
  constructor(private readonly financialService: FinancialService) {}

  @Query(() => [Object], { name: 'getFinancialRecords' })
  @UseGuards(GqlAuthGuard)
  async getFinancialRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('transactionType', { nullable: true }) transactionType: string,
    @Args('category', { nullable: true }) category: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getFinancialRecords(userId, farmId, transactionType, category);
  }

  @Query(() => Object, { name: 'getFinancialRecord' })
  @UseGuards(GqlAuthGuard)
  async getFinancialRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.financialService.getFinancialRecord(id, userId);
  }

  @Query(() => Object, { name: 'getFinancialSummary' })
  @UseGuards(GqlAuthGuard)
  async getFinancialSummary(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getFinancialSummary(userId);
  }

  @Query(() => Object, { name: 'getProfitLossStatement' })
  @UseGuards(GqlAuthGuard)
  async getProfitLossStatement(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('period') period: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getProfitLossStatement(userId, startDate, endDate);
  }

  @Query(() => [Object], { name: 'getLoanRequests' })
  @UseGuards(GqlAuthGuard)
  async getLoanRequests(
    @Args('status', { nullable: true }) status: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getLoanRequests(userId);
  }

  @Query(() => Object, { name: 'getLoanRequest' })
  @UseGuards(GqlAuthGuard)
  async getLoanRequest(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.financialService.getLoanRequest(id, userId);
  }

  @Query(() => [Object], { name: 'getActiveLoans' })
  @UseGuards(GqlAuthGuard)
  async getActiveLoans(@Context() context) {
    const userId = context.req.user.id;
    return this.financialService.getActiveLoans(userId);
  }

  @Query(() => Object, { name: 'getFinancialStats' })
  @UseGuards(GqlAuthGuard)
  async getFinancialStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getFinancialStats(userId, farmId, houseId, startDate, endDate);
  }

  @Query(() => Object, { name: 'getAdminFinancialStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminFinancialStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string
  ) {
    return this.financialService.getAdminFinancialStats(region, district);
  }

  @Query(() => Object, { name: 'getExpenseAnalysis' })
  @UseGuards(GqlAuthGuard)
  async getExpenseAnalysis(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getExpenseAnalysis(userId, farmId, houseId, startDate, endDate);
  }

  @Query(() => Object, { name: 'getIncomeAnalysis' })
  @UseGuards(GqlAuthGuard)
  async getIncomeAnalysis(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getIncomeAnalysis(userId, farmId, houseId, startDate, endDate);
  }

  @Query(() => Object, { name: 'getCashFlowStatement' })
  @UseGuards(GqlAuthGuard)
  async getCashFlowStatement(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.getCashFlowStatement(userId, farmId, houseId, startDate, endDate);
  }

  @Mutation(() => Object, { name: 'createFinancialRecord' })
  @UseGuards(GqlAuthGuard)
  async createFinancialRecord(
    @Args('input') input: CreateFinancialRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.createFinancialRecord(userId, input);
  }

  @Mutation(() => Object, { name: 'updateFinancialRecord' })
  @UseGuards(GqlAuthGuard)
  async updateFinancialRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateFinancialRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.updateFinancialRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteFinancialRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteFinancialRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.financialService.deleteFinancialRecord(id, userId);
  }

  @Mutation(() => Object, { name: 'createLoanRequest' })
  @UseGuards(GqlAuthGuard)
  async createLoanRequest(
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.createLoanRequest(userId, input);
  }

  @Mutation(() => Object, { name: 'updateLoanRequest' })
  @UseGuards(GqlAuthGuard)
  async updateLoanRequest(
    @Args('id') id: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.updateLoanRequest(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteLoanRequest' })
  @UseGuards(GqlAuthGuard)
  async deleteLoanRequest(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.financialService.deleteLoanRequest(id, userId);
  }

  @Mutation(() => Object, { name: 'approveLoanRequest' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async approveLoanRequest(
    @Args('id') id: string,
    @Args('input') input: any
  ) {
    return this.financialService.approveLoanRequest(id, input);
  }

  @Mutation(() => Object, { name: 'rejectLoanRequest' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async rejectLoanRequest(
    @Args('id') id: string,
    @Args('rejectionReason') rejectionReason: string
  ) {
    return this.financialService.rejectLoanRequest(id, rejectionReason);
  }

  @Mutation(() => Object, { name: 'disburseLoan' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async disburseLoan(@Args('id') id: string) {
    return this.financialService.disburseLoan(id);
  }

  @Mutation(() => Object, { name: 'recordLoanPayment' })
  @UseGuards(GqlAuthGuard)
  async recordLoanPayment(
    @Args('loanId') loanId: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.recordLoanPayment(loanId, userId, input);
  }

  @Mutation(() => Object, { name: 'generateFinancialReport' })
  @UseGuards(GqlAuthGuard)
  async generateFinancialReport(
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.financialService.generateFinancialReport(userId, input);
  }
}
