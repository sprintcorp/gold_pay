import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserInterface } from 'src/interfaces/user.interface';
import { User } from 'src/models/user.schema';

export class CustomInterceptors implements NestInterceptor {
 intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
   console.log('Before...');
   return handler.handle().pipe(
     map((data) =>
       data.map((item: User) => {
         console.log('After....');
         const res = {
           ...item,
           firstName: item.firstname,
           lastName: item.lastname,
         };
         delete res.firstname, delete res.lastname;
         return res;
       }),
     ),
   );
 }
}