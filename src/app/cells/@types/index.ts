export interface Member {
  member_id: string;
  user_id: string;
  cell_id: string;
  zone_id: string | null;
  fellowship_id: string | null;
  firstname: string;
  lastname: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  role: "ADMIN" | "MEMBER";
  birth_date: string;
  occupation: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface Fellowship {
  fellowship_id: string;
  zone_id: string;
  fellowship_name: string;
  created_at: string;
  updated_at: string;
}

export interface Leaders {
  member: {
    member_id: string;
    firstname: string;
    created_at: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export interface Cell {
  cell_id: string;
  fellowship_id: string;
  cell_name: string;
  super_cell_id: string | null;
  division_level: number;
  became_fellowship: boolean;
  created_at: string;
  updated_at: string;
  fellowship: Fellowship;
  leaders: Leaders[];
  members: Member[];
}

export interface History {
  history_id: string;
  cell_id: string;
  parent_cell_id: string;
  child_cell_id: string;
  child_cell_name: string;
  division_date: string;
  division_level: number;
  became_fellowship: boolean;
  reason_for_division: string;
  created_at: string;
  cell: Omit<Cell, "leaders" | "members">;
}

export interface CellData {
  cell: Cell;
  history: History[];
}

export interface EditCellDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  cellData: {
    cell: {
      cell_id: string;
      cell_name: string;
    };
    history: {
      history_id: string;
    };
  };
  editData: {
    cell_name: string;
    cell_leader_id: string;
  };
  setEditData: (value: { cell_name: string; cell_leader_id: string }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

export interface MitosisCellDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  cellData: {
    cell: {
      cell_id: string;
      cell_name: string;
    };
    history: {
      history_id: string;
    };
  };
}
