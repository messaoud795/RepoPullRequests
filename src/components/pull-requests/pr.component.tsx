import { useEffect, useState } from "react";
import style from "./pr.module.scss";
import { format, parseISO } from "date-fns";
import { createStructuredSelector } from "reselect";
import { AppDispatch } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import {
  selectedRepoUrlSelector,
  pullRequestsSelector,
} from "../../redux/repositories/repositories.selector";
import { addPR } from "../../redux/repositories/repositories.reducer";
import { isEmpty } from "lodash";
import { authTokenSelector } from "../../redux/config/config.selector";
import { getPR } from "../../services/http/pull-requests/pr.service";
import { PrResponse } from "../../services/http/pull-requests/pr.types";
import Loader from "../loader/loader.component";

export interface PRComponentProps extends PRComponentPropsFromRedux {}
function PRComponent({
  selectedRepoUrl,
  addPullRequests,
  pullRequests,
}: PRComponentProps) {
  const [isPrInProgress, setIsPrInProgress] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPR() {
      setIsPrInProgress(true);
      addPullRequests(await getPR(`${selectedRepoUrl}/pulls`));
      setIsPrInProgress(false);
    }
    fetchPR();
  }, [selectedRepoUrl, addPullRequests]);
  const table_headers: string[] = [
    "id",
    "title",
    "state",
    "created at",
    "labels",
    "created by",
  ];

  return (
    <div className={style.container}>
      <h2>Pull requests :</h2>

      {isPrInProgress && (
        <div className={style.loader}>
          <Loader />
        </div>
      )}
      {isEmpty(pullRequests) && !isPrInProgress && (
        <p> There is no pull requests yet for the selected repository</p>
      )}
      {!isPrInProgress && !isEmpty(pullRequests) && (
        <table className={style.table}>
          <thead>
            <tr>
              {table_headers.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pullRequests.map((pr) => (
              <tr key={pr.id}>
                <td>{pr.id}</td>
                <td>{pr.title}</td>
                <td>{pr.state}</td>
                <td>
                  {format(parseISO(pr.created_at), "HH:mm ")} --{" "}
                  {format(parseISO(pr.created_at), "dd/MM/yyyy")}
                </td>

                <td>{pr.labels.map((label) => label.name).toString()}</td>
                <td>{pr.created_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  selectedRepoUrl: selectedRepoUrlSelector,
  authToken: authTokenSelector,
  pullRequests: pullRequestsSelector,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addPullRequests: (pullRequests: Array<PrResponse>) => {
    dispatch(addPR(pullRequests));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PRComponentPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PRComponent);
