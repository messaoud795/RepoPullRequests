import { PullRequestStates } from "./repositories.constants";

export interface NewRepositoryAdditionType {
  repoUrl: string;
  repoFullName: string;
}

export interface RepositoryDataType extends NewRepositoryAdditionType {}

export interface RepositoriesSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<RepoSearchResponse>;
}

export interface RepoSearchResponse {
  id: number;
  name: string;
  full_name: string;
  url: string;
  selected?: boolean;
}
