import { ObjectId } from "mongoose";

export interface UserInterface {
    id: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    otp:number;
}