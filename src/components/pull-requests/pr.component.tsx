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
import PrPlot from "./prPlot.component";

export interface PRComponentProps extends PRComponentPropsFromRedux {
  prNameFilter: string;
}
export interface plotdata {
  type: string;
  x: string[];
  y: number[];
}
function PRComponent({
  selectedRepoUrl,
  addPullRequests,
  pullRequests,
  prNameFilter,
}: PRComponentProps) {
  //state to mark the pending state during pr request
  const [isPrInProgress, setIsPrInProgress] = useState<boolean>(false);
  const [pullRequestsFiltered, setPullRequestsFiltered] =
    useState<Array<PrResponse>>(pullRequests);

  //request pr each time the selected repo url is updated
  useEffect(() => {
    async function fetchPR() {
      setIsPrInProgress(true);
      addPullRequests(await getPR(`${selectedRepoUrl}/pulls`));
      setIsPrInProgress(false);
    }
    fetchPR();
  }, [selectedRepoUrl, addPullRequests]);

  useEffect(() => {
    if (prNameFilter.length > 1)
      setPullRequestsFiltered(
        pullRequests.filter((pr) =>
          pr.title.toLowerCase().includes(prNameFilter.toLowerCase())
        )
      );
  }, [pullRequests, prNameFilter]);

  //defining table headers
  const table_headers: string[] = [
    "id",
    "title",
    "state",
    "created at",
    "labels",
    "created by",
  ];
  //return the occurence of an element in array
  const countOccurrences = (arr: string[], val: string) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  //prepare the data of the plot
  function getPlotData(PRS: PrResponse[]) {
    var days: Array<string>;
    var x: Array<string> = [];
    var y: number[] = [];
    days = pullRequestsFiltered.map((pr) =>
      format(parseISO(pr.created_at), "dd/MM/yyyy")
    );
    for (var i in days) {
      if (!countOccurrences(x, days[i])) {
        x.push(days[i]);
        y.push(countOccurrences(days, days[i]));
      }
    }
    const data: plotdata[] = [{ type: "bar", x: x.reverse(), y: y.reverse() }];
    return data;
  }
  console.log(pullRequests);
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
        <>
          <div className={style.prPlot}>
            <PrPlot data={getPlotData(pullRequests)} />
          </div>
          <h3>Pull requests data</h3>
          <table className={style.table}>
            <thead>
              <tr>
                {table_headers.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pullRequestsFiltered.map((pr) => (
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
        </>
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
