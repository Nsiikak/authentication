import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserGuard } from './user.guard';
import { BlockGuard } from './block.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }
 
  @Post('login')
  logIn(@Body() createUserDto: LoginDto) {
    return this.userService.logIn(createUserDto);
  }

  @UseGuards(UserGuard, BlockGuard)
  @Get('findall')
  findAll() {
    return this.userService.findAll();
  }

@UseGuards(UserGuard)
@Post('blockuser/:id')
async blockUser(@Param('id') id:string){
  return await this.userService.blockUser(id)
}

@UseGuards(UserGuard)
@Post('unblockuser/:id')
async unblockUser(@Param('id') id:string){
  return await this.userService.unblockUser(id)
}
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
