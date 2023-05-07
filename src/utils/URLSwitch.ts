import { Injectable } from "@nestjs/common";

@Injectable()
export class URLSwitch{
    constructor(private subscriptionType: string, private network: string,
         private amount:number, private userId: string, private subPackage: string = '', private smartCard: string = ''){

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
                url=`https://www.nellobytesystems.com/APIDatabundleV1.asp?UserID=${process.env.CONNECT_USER_ID}` +
                `&APIKey=${process.env.CONNECT_API_KEY}&MobileNetwork=${this.network}&DataPlan=${this.amount}` +
                `&MobileNumber= ${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
                break;
            case 'smile':
                url=`https://www.nellobytesystems.com/APIVerifySmileV1.asp?UserID=${process.env.CONNECT_USER_ID}` +
                `&APIKey=${process.env.CONNECT_API_KEY}&MobileNetwork=${this.network}&DataPlan=${this.amount}` +
                `&MobileNumber= ${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
                break;
            case 'spectranet':
                url=`https://www.nellobytesystems.com/APISpectranetV1.asp?UserID=${process.env.CONNECT_USER_ID}` +
                `&APIKey=${process.env.CONNECT_API_KEY}&MobileNetwork=${this.network}&DataPlan=${this.amount}` +
                `&MobileNumber= ${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
                break;
            case 'cable':
                url=`https://www.nellobytesystems.com/APICableTVV1.asp?UserID=${process.env.CONNECT_USER_ID}&`+
                `APIKey=${process.env.CONNECT_API_KEY}&CableTV=${this.network}&Package=${this.subPackage}&SmartCardNo=${this.smartCard}`+
                `&PhoneNo=${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
            case 'electricity':
                url=`https://www.nellobytesystems.com/APIElectricityV1.asp?UserID=${process.env.CONNECT_USER_ID}&APIKey=${process.env.CONNECT_API_KEY}`+
                `&ElectricCompany=${this.network}&MeterType=${this.subPackage}&MeterNo=${this.smartCard}&Amount=${this.amount}`+
                `&PhoneNo=${this.userId}&RequestID=request_id&CallBackURL=${process.env.CALLBACK_URL}`;
            default:
                url=``;
        }
        return url;
    }


    

 
}