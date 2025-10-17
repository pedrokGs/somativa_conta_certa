import { PontoType } from "@/common/enums/ponto-type";
import mongoose, { Document, Model, Schema } from "mongoose";
export interface IPonto extends Document{
    _id:string;
    userId: string;
    type: string
    clockTime: Date;
}


const PontoSchema: Schema<IPonto> = new mongoose.Schema({
    userId:{
        type:String,
        required:[true, "Não pode ser vazio"],
        trim: true,
        maxlength: [50, "máximo de 50 char"]
    },
    type:{
        type:String,
        required:[true, "Precisa de um tipo"],
        enum: PontoType,
        trim: true,
    },
    clockTime:{
        type: Date,
        default: Date.now
    }
});

const Ponto: Model<IPonto> = mongoose.models.Ponto || mongoose.model<IPonto>("Ponto", PontoSchema);

export default Ponto;