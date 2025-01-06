export  interface AuthMemebr {
  data: {
    user_id: string;
    email: string;
    password: string | null;
    firstname: string;
    birth_date: string | null;
    lastname: string;
    gender: string | null;
    username: string | null;
    role:
      | "MEMBER"
      | "ADMIN"
      | "FELLOWSHIP_LEADER"
      | "CELL_LEADER"
      | "ZONE_LEADER";
    is_active: boolean;
    created_at: string;
    updated_at: string;
    member: {
      member_id: string;
      user_id: string;
      cell_id: string;
      zone_id: string | null;
      fellowship_id: string | null;
      firstname: string;
      lastname: string;
      email: string;
      gender: "MALE" | "FEMALE";
      role:
        | "MEMBER"
        | "ADMIN"
        | "FELLOWSHIP_LEADER"
        | "CELL_LEADER"
        | "ZONE_LEADER";
      birth_date: string | null;
      occupation: string;
      address: string;
      created_at: string;
      updated_at: string;
    };
  };
};


export interface AuthMemberActionsStore {
    me: AuthMemebr | null
    setMe: (me: AuthMemebr | null) => void
}