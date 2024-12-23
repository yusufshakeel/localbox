import {AccountType} from '@/types/account-type';

export type AuthPayload = {
  username: string;
  accountType: AccountType;
}