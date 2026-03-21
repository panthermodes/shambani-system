import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Object, { name: 'profile' })
  @UseGuards(GqlAuthGuard)
  async getProfile(@Context() context) {
    const userId = context.req.user.id;
    return this.usersService.getProfile(userId);
  }

  @Query(() => [Object], { name: 'getUsersByRole' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getUsersByRole(@Args('role') role: string) {
    return this.usersService.getUsersByRole(role);
  }

  @Query(() => [Object], { name: 'getAllUsers' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => Object, { name: 'getUser' })
  @UseGuards(GqlAuthGuard)
  async getUser(@Args('id') id: string, @Context() context) {
    const currentUser = context.req.user;
    return this.usersService.getUser(id, currentUser);
  }

  @Query(() => [Object], { name: 'searchUsers' })
  @UseGuards(GqlAuthGuard)
  async searchUsers(@Args('query') query: string, @Context() context) {
    const currentUser = context.req.user;
    return this.usersService.searchUsers(query, currentUser);
  }

  @Query(() => Object, { name: 'getUserStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Query(() => Object, { name: 'getFarmersStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  async getFarmersStats(@Context() context) {
    const currentUser = context.req.user;
    return this.usersService.getFarmersStats(currentUser);
  }

  @Query(() => Object, { name: 'getExtensionOfficersStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getExtensionOfficersStats() {
    return this.usersService.getExtensionOfficersStats();
  }

  @Mutation(() => Object, { name: 'updateProfile' })
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('input') input: UpdateProfileDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.usersService.updateProfile(userId, input);
  }

  @Mutation(() => Boolean, { name: 'updatePassword' })
  @UseGuards(GqlAuthGuard)
  async updatePassword(
    @Args('input') input: UpdatePasswordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.usersService.updatePassword(userId, input);
  }

  @Mutation(() => Boolean, { name: 'deactivateUser' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async deactivateUser(@Args('userId') userId: string) {
    return this.usersService.deactivateUser(userId);
  }

  @Mutation(() => Boolean, { name: 'activateUser' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async activateUser(@Args('userId') userId: string) {
    return this.usersService.activateUser(userId);
  }

  @Mutation(() => Boolean, { name: 'verifyUser' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async verifyUser(@Args('userId') userId: string) {
    return this.usersService.verifyUser(userId);
  }

  @Mutation(() => Object, { name: 'updateUserRole' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateUserRole(
    @Args('userId') userId: string,
    @Args('role') role: string
  ) {
    return this.usersService.updateUserRole(userId, role);
  }

  @Mutation(() => Object, { name: 'transferUser' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async transferUser(
    @Args('userId') userId: string,
    @Args('location') location: string,
    @Args('region') region: string,
    @Args('district') district: string
  ) {
    return this.usersService.transferUser(userId, { location, region, district });
  }
}