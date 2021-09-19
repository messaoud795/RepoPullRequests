import { PrResponse, PrSearch } from "./pr.types";
import httpService from "../http-core/http.service";
import { FetchInitCredentialsTypes } from "../http-core/http-service.constants";

export async function getPR(
  selectedRepoUrl: string
): Promise<Array<PrResponse>> {
  let results: Array<PrResponse> = [];

  const response = await httpService<PrSearch[]>({
    url: selectedRepoUrl,
    credentialsType: FetchInitCredentialsTypes.SAME_ORIGIN,
    errorHandler: (error: any, response?: Response) => {
      console.error(
        "Error while trying to get pull requests search!",
        error ?? response
      );
      return {};
    },
  });

  console.log(typeof response);

  results = response?.map((el) => {
    let pr: PrResponse = {
      id: el.id,
      state: el.state,
      title: el.title,
      created_at: el.created_at,
      labels: el.labels,
      created_by: el.user.login,
    };

    return pr;
  });
  return results;
}
