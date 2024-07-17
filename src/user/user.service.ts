import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './Schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(payload: CreateUserDto) {
    const { email, password, ...result } = payload;
    const user = await this.authModel.findOne({email});

    if (user) {
      throw new UnauthorizedException('email already exist');
    }
    const newPassword = await bcrypt.hash(password, 10);

    try {
      const signUp = new this.authModel({email, password:newPassword, ...result});
    await signUp.save();
    const { password: _, ...userWithoutPassword } = signUp.toObject();
    return {
      message: 'successfully',
      result: userWithoutPassword,
      
    };
    } catch  (error){
      throw new Error('Error saving user to database: ' + error.message);
    }
    
  }

  async logIn(payload: LoginDto) {
    const { email, password } = payload;

    const findUser = await this.authModel.findOne({ email });
    // console.log(findUser);
            
    // if (findUser?.password !== password) {
    //   throw new UnauthorizedException('wrong password');
    // }
    if (!findUser){
      throw new UnauthorizedException('wrong username')
    }
    const isMatch = await bcrypt.compare(password, findUser.password)
    if (!isMatch) {
      throw new UnauthorizedException('wrong password');
    }
    const tokenHolder = { email: findUser.email, userId: findUser._id ,isBlocked:findUser.isBlocked};
    const accessToken = await this.jwtService.signAsync(tokenHolder);
    const { password: _, ...userWithoutPassword } = findUser.toObject();
    return {
      msg: 'sucessfull',
      user: userWithoutPassword,
      token: accessToken,
    };
  }

  
  async findAll() {
    return await this.authModel.find()
  }

  async blockUser(_id:string){
    const findUser = await this.authModel.findOne({_id})
    if (!findUser){
      throw new NotFoundException('user not found')
    }
    findUser.isBlocked = true;
    await findUser.save()
    return findUser
  }

  async unblockUser(_id:string){
    const findUser = await this.authModel.findOne({_id})
    if (!findUser){
      throw new NotFoundException('user not found')
    }
    findUser.isBlocked = false;
    await findUser.save()
    return findUser
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
