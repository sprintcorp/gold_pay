import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class GetUserTokenData{
    constructor(private readonly httpService: HttpService){

    }

    async getWalletInformation(){
        try{
        const data = await this.httpService.axiosRef.post(process.env.ANDA_TOKEN_URL+'agd/generate-address',
        {'password':process.env.ANDA_PASSKEY});
        return data.data.Result;
        }catch(error){
            throw error;
        }
    }
}