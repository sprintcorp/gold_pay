export class Helper{

  static uniqueRandomNumber(length:number):string{
     let result = '';
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     const charactersLength = characters.length;
     let counter = 0;
     while (counter < length) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
       counter += 1;
     }
     return result.toUpperCase();
  }

  static addTime(time: number){
    const d = new Date();
    return d.setMinutes(d.getMinutes() + time);
  }
}

export enum PaymentType {
    DEPOSIT='deposit',
    WITHDRAW='withdraw'
}

export const populateValue = 'firstname lastname balance blockchain_balance email accountNumber accountName bankName';
