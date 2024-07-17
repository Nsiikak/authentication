import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema() 
export class User {
    @Prop()
    username:string;
    @Prop()
    password:string;
    @Prop()
    email:string;
    @Prop()
    DOB:string;
    @Prop({default:false})
    isBlocked:boolean;

    
}
export const userSchema =SchemaFactory.createForClass(User)

