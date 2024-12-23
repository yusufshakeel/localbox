import {AccountType} from '@/types/account-type';

export type LoginPayload = {
  username: string;
  password: string;
  accountType: AccountType;
}