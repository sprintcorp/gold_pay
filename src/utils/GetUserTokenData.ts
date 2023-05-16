import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class GetUserTokenData{
    public config = {'password':process.env.ANDA_PASSKEY};
    constructor(private readonly httpService: HttpService){

    }

    async getWalletInformation(){
        try{
        const data = await this.httpService.axiosRef.post(process.env.ANDA_TOKEN_URL+'agd/generate-address',
        this.config);
        return data.data.Result;
        }catch(error){
            throw error;
        }
    }

    async getUserWalletBallance(address: string){
        try{
            const dataSent = {'address':address};
            const data = await this.httpService.axiosRef.post(
                process.env.ANDA_TOKEN_URL+'agd/get-balance', dataSent);
            return data.data.result;
            }catch(error){
                throw error;
            }   
    }
}