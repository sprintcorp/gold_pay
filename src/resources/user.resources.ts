import { UserEntity } from "src/transformers/auth.response";

export class UserResources{
   
    response(user: UserEntity){
        return {
            'id': user._id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'balance': user.balance,
            'email': user.email,
            'login_pin': user.login_pin,
            'transaction_pin': user.transaction_pin,
            'address': user.address,
            'otp': user.otp,
            'user_referral_code': user.user_referral_code,
        }
    }
}