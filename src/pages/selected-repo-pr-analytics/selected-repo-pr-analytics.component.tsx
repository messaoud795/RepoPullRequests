import React, { useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect, ConnectedProps } from "react-redux";
import {
  pullRequestsSelector,
  selectedRepoUrlSelector,
} from "../../redux/repositories/repositories.selector";
import style from "./selected-repo-pr-analytics.module.scss";
import { isEmpty } from "lodash";
import { addPR } from "../../redux/repositories/repositories.reducer";
import { PrResponse } from "../../services/http/pull-requests/pr.types";
import { AppDispatch } from "../../redux/store";
import { getPR } from "../../services/http/pull-requests/pr.service";
import Loader from "../../components/loader/loader.component";
import parseISO from "date-fns/parseISO";
import { format } from "date-fns";
import PrPlot from "../../components/pull-requests/prPlot.component";
import PRTableComponent from "../../components/pull-requests/pr-table.component";

export interface plotdata {
  type: string;
  x: string[];
  y: number[];
}
export interface plotlayout {
  width: number;
  height: number;
  title: string;
}

export interface SelectedRepoPrAnalyticsComponentProps
  extends SelectedRepoPrAnalyticsComponentPropsFromRedux {}

function SelectedRepoPrAnalyticsComponent({
  selectedRepoUrl,
  addPullRequests,
  pullRequests,
}: SelectedRepoPrAnalyticsComponentProps) {
  const [prNameFilter, setPrNameFilter] = useState<string>("");
  //state to mark the pending state during pr request
  const [isPrInProgress, setIsPrInProgress] = useState<boolean>(false);
  const [pullRequestsFiltered, setPullRequestsFiltered] =
    useState<Array<PrResponse>>(pullRequests);

  //request prs each time the selected repo url is updated
  useEffect(() => {
    async function fetchPR() {
      setIsPrInProgress(true);
      addPullRequests(await getPR(`${selectedRepoUrl}/pulls`));
      setIsPrInProgress(false);
    }
    if (!isEmpty(selectedRepoUrl)) fetchPR();
  }, [selectedRepoUrl, addPullRequests]);

  //filter the array of prs according to the input value
  useEffect(() => {
    if (prNameFilter.length > 1)
      setPullRequestsFiltered(
        pullRequests.filter((pr) =>
          pr.title.toLowerCase().includes(prNameFilter.toLowerCase())
        )
      );
    else setPullRequestsFiltered(pullRequests);
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
  //set the data of the plot
  function getPlotData(PRS: PrResponse[]) {
    var days: Array<string>;
    var x: Array<string> = [];
    var y: number[] = [];
    //get the array of pull requests days
    days = pullRequestsFiltered.map((pr) =>
      format(parseISO(pr.created_at), "dd/MM/yyyy")
    );
    //set the array of x axis and y axis
    for (var i in days) {
      if (!countOccurrences(x, days[i])) {
        x.push(days[i]);
        y.push(countOccurrences(days, days[i]));
      }
    }
    const data: plotdata[] = [{ type: "bar", x: x.reverse(), y: y.reverse() }];
    return data;
  }
  const layout: plotlayout = {
    width: 800,
    height: 400,
    title: "Pull requests per day",
  };

  return (
    <div className={style.container}>
      <div className={style.filterPr}>
        <p className={style.title}>Select pull requests by title</p>
        <input
          type="text"
          onChange={(e) => setPrNameFilter(e.target.value)}
          value={prNameFilter}
          className={style.input}
        />
      </div>
      <div className={style.pr_analytics_container}>
        <h3>Pull requests chart </h3>
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
              <PrPlot data={getPlotData(pullRequests)} layout={layout} />
            </div>
            <h3>Pull requests data</h3>
            <PRTableComponent
              pullRequestsFiltered={pullRequestsFiltered}
              table_headers={table_headers}
            />
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  selectedRepoUrl: selectedRepoUrlSelector,
  pullRequests: pullRequestsSelector,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addPullRequests: (pullRequests: Array<PrResponse>) => {
    dispatch(addPR(pullRequests));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type SelectedRepoPrAnalyticsComponentPropsFromRedux = ConnectedProps<
  typeof connector
>;

export default connector(SelectedRepoPrAnalyticsComponent);
