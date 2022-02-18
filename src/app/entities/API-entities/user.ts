import { ISubscription } from '../abstract-entities/subscription';

export interface IUser {
  birthday?: Date;
  created_at?: Date;
  current_account?: any; //TODO: ask backend about this parameter
  email?: string;
  email_verified_at?: Date;
  full_name: string;
  gender?: string;
  id: number;
  alpha2Code?: string;
  phone: string;
  phone_verified_at?: Date;
  profile_img: string;
  subscription: ISubscription;
  token: string;
  user_scope: string;
  username: string;
  user:IUser[]
  is_active: boolean ; // for group Discuss
}

export class IUser implements IUser{
is_active = false;
}