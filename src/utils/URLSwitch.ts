import { Injectable } from "@nestjs/common";

@Injectable()
export class URLSwitch{
    constructor(private subscriptionType: string, private network: string,
         private amount:number, private userId: string){

    }

    getSubscriptionURL(){
        let url = '';
        switch(this.subscriptionType){
            case 'airtime':
                url=`https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env.CONNECT_USER_ID}` +
                `&APIKey=${process.env.CONNECT_API_KEY}&MobileNetwork=${this.network}&Amount=${this.amount}` +
                `&MobileNumber= ${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
                break;
            case 'data':
                url=``;
                break;
            default:
                url=``;
        }
        return url;
    }
}