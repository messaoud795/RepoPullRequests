export interface PrSearch {
  id: number;
  state: string;
  title: string;
  created_at: string;
  labels: Array<Label>;
  user: User;
}

export interface PrResponse {
  id: number;
  state: string;
  title: string;
  created_at: string;
  labels: Array<Label>;
  created_by: string;
}

interface Label {
  name: string;
}
interface User {
  login: string;
}
