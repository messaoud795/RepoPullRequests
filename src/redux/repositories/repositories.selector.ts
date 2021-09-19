import { RepositoriesDataState } from "./repositories.reducer";
import { createSelector } from "reselect";
import { RepositoryDataType } from "../../services/http/repositories/repositories.types";
import { isEmpty } from "lodash";
import { PrResponse } from "../../services/http/pull-requests/pr.types";

const selectRepositoriesState = (state: any): RepositoriesDataState =>
  state.repositories;

export const repoListSelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): Array<RepositoryDataType> =>
    reposState.repoList
);

export const isRepoListEmptySelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): boolean => isEmpty(reposState.repoList)
);

export const selectedRepoUrlSelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): string => reposState.selectedRepoUrl
);

export const pullRequestsSelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): Array<PrResponse> =>
    reposState.pullRequests
);

export const selectedRepoFullNameSelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): string =>
    reposState.repoList.find((r) => r.repoUrl === reposState.selectedRepoUrl)
      ?.repoFullName ?? ""
);

export const selectedRepoSelector = createSelector(
  [selectRepositoriesState],
  (reposState: RepositoriesDataState): RepositoryDataType | undefined => {
    const { selectedRepoUrl = "" } = reposState;
    return reposState.repoList.find((r) => r.repoUrl === selectedRepoUrl);
  }
);
