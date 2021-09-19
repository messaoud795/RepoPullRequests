import httpService from "../http-core/http.service";
import {
  RepoSearchResponse,
  RepositoriesSearchResponse,
} from "./repositories.types";
import { isEmpty } from "lodash";
import { GITHUB_API_REPO_SEARCH_URL } from "./repositories.constants";
import { FetchInitCredentialsTypes } from "../http-core/http-service.constants";

export async function getRepositoriesForKeyword(
  repoFullName: string,
  authToken: string
): Promise<Array<RepoSearchResponse>> {
  let result: Array<RepoSearchResponse> = [];
  if (!isEmpty(repoFullName) && !isEmpty(authToken)) {
    const response = await httpService<RepositoriesSearchResponse>({
      url: GITHUB_API_REPO_SEARCH_URL,
      credentialsType: FetchInitCredentialsTypes.SAME_ORIGIN,
      queryParams: {
        // q: `${repoFullName}+in:name`
        q: repoFullName,
        per_page: 100,
      },
      headers: {
        Authorization: `token ${authToken}`,
      },
      errorHandler: (error: any, response?: Response) => {
        console.error(
          "Error while trying to get repositories search!",
          error ?? response
        );
        return {};
      },
    });
    result = response?.items;
  }
  return result;
}
