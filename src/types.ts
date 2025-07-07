export interface Member {
  id: string;
  name: string;
  pin: string;
  createdAt: string;
}

export interface Problem {
  id: string;
  title: string;
  link: string;
  category: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  memberId: string;
  problemId: string;
  isSolved: boolean;
  solution: string;
  notes: string;
  updatedAt: string;
}

export interface AppState {
  members: Member[];
  problems: Problem[];
  submissions: Submission[];
  currentMember: Member | null;
  authenticatedMemberId: string | null;
  darkMode: boolean;
}