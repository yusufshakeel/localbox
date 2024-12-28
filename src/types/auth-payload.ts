import {AccountType} from '@/types/account-type';
import {AccountRBAC} from '@/types/account-rbac';

export type AuthPayload = {
  id: string;
  username: string;
  accountType: AccountType;
  rbac: AccountRBAC;
}