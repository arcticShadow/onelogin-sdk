export enum OLUserStatus {
  Unactivated = 0,
  Active = 1,
  Suspended = 2,
  Locked = 3,
  PasswordExpired = 4,
  AwaitingPasswordReset = 5,
  PendingPassword = 7,
  SecurityQuestionsRequired = 8,
}
export enum OLUserState {
  Unapproved = 0,
  Approved = 1,
  Rejected = 2,
  Unlicensed = 3,
}

export type OLUser = {
  activated_at: string;
  created_at: string;
  email: string;
  username: string;
  firstname: string;
  group_id: number;
  id: number;
  invalid_login_attempts: number;
  invitation_sent_at: string;
  last_login: string;
  lastname: string;
  locked_until: null | string;
  comment: string;
  openid_name: string;
  locale_code: null | string;
  preferred_locale_code: null | string;
  password_changed_at: string;
  phone: string;
  status: OLUserStatus;
  updated_at: string;
  distinguished_name: null | string;
  external_id: string;
  directory_id: null | string;
  member_of: null | string;
  samaccountname: null | string;
  userprincipalname: null | string;
  manager_ad_id: null | string;
  manager_user_id: null | string;
  role_id: number[];
  company: string;
  department: string;
  title: string;
  state: OLUserState;
  trusted_idp_id: null;
  custom_attributes: {
    preferredName: string;
    personalEmail: string;
    hireDate: string;
    manager: string;
    timezone: string;
    location: string;
    division: string;
    country: string;
  };
};
export type OLUsers = OLUser[];
