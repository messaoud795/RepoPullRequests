import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NewRepositoryAdditionType,
  RepositoryDataType,
} from "../../services/http/repositories/repositories.types";
import { PrResponse } from "../../services/http/pull-requests/pr.types";

export interface RepositoriesDataState {
  repoList: Array<RepositoryDataType>;
  selectedRepoUrl: string;
  pullRequests: Array<PrResponse>;
}

const initialState: RepositoriesDataState = {
  repoList: [],
  selectedRepoUrl: "",
  pullRequests: [],
};

const repositoriesSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    addRepositoryToState: (
      state,
      action: PayloadAction<NewRepositoryAdditionType>
    ) => {
      state.repoList.push(action.payload);
    },
    selectRepository: (state, action: PayloadAction<string>) => {
      state.selectedRepoUrl = action.payload;
    },
    addPR: (state, action: PayloadAction<Array<PrResponse>>) => {
      state.pullRequests = action.payload;
    },
  },
});

export const { addRepositoryToState, selectRepository, addPR } =
  repositoriesSlice.actions;

export default repositoriesSlice.reducer;
