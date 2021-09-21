import React, { useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect, ConnectedProps } from "react-redux";
import {
  isRepoListEmptySelector,
  selectedRepoUrlSelector,
} from "../../redux/repositories/repositories.selector";
import style from "./selected-repo-pr-analytics.module.scss";
import { isEmpty } from "lodash";
import PrComponent from "../../components/pull-requests/pr.component";

export interface SelectedRepoPrAnalyticsComponentProps
  extends SelectedRepoPrAnalyticsComponentPropsFromRedux {}

function SelectedRepoPrAnalyticsComponent({
  selectedRepoUrl,
  isRepoListEmpty,
}: SelectedRepoPrAnalyticsComponentProps) {
  const [prNameFilter, setPrNameFilter] = useState<string>("");

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
        {!isEmpty(selectedRepoUrl) && (
          <PrComponent prNameFilter={prNameFilter} />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  selectedRepoUrl: selectedRepoUrlSelector,
  isRepoListEmpty: isRepoListEmptySelector,
});

const connector = connect(mapStateToProps);

export type SelectedRepoPrAnalyticsComponentPropsFromRedux = ConnectedProps<
  typeof connector
>;

export default connector(SelectedRepoPrAnalyticsComponent);
