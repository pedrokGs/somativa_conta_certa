import { UserRole } from "@/common/enums/user-role";
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document{
    _id:string;
    name: string;
    email: string;
    password?: string;
    comparePassword(passwordUser: string): Promise<boolean>
    role: string
    createdAt: Date;
}


const UserSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Nome não pode ser vazio"],
        trim: true,
        maxlength: [50, "máximo de 50 char"]
    },
    email:{
        type:String,
        required:[true, "campo email não pode ser vazio"],
        trim: true,
        maxLength: [80, "máximo de 80 char"],
        unique: [true, "Esse email já está cadastrado"]
    },
    password:{
        type:String,
        required:[true, "campo password não pode ser falso"],
        trim: true,
        maxLength: [50, "máximo de 50 char"],
        select: false
    },
    role:{
        type:String,
        required:[true, "Precisa de uma função"],
        enum: UserRole,
        default: UserRole.USER.toString,
        trim: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

UserSchema.pre<IUser>('save', async function (next){
    if(!this.isModified('password') || !this.password) return next();
    try{
        const salt = (await bcrypt.genSalt(10));
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(e: any){
        next(e);
    }
});

UserSchema.methods.comparePassword = function(passwordUser: string): Promise<boolean>{
    return bcrypt.compare(passwordUser, this.password);
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;