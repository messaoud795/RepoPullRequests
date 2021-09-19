import React from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./navigation.module.scss";
import { RoutingDetails } from "../../constants/routing.constants";
import { isEmpty, isNil } from "lodash";
import { createStructuredSelector } from "reselect";
import { selectedRepoFullNameSelector } from "../../redux/repositories/repositories.selector";
import { connect, ConnectedProps } from "react-redux";
import clsx from "clsx";
import { RoutingDetailType, RoutingPaths } from "../../types/app.types";

export interface NavigationComponentProps
  extends NavigationComponentPropsFromRedux {}

function NavigationComponent({
  selectedRepoFullName = "",
}: NavigationComponentProps) {
  const location = useLocation();

  const getSuffix = (path: RoutingPaths) =>
    path === RoutingPaths.ANALYTICS && !isEmpty(selectedRepoFullName)
      ? ` / ${selectedRepoFullName}`
      : "";

  return (
    <div className={style.container}>
      {RoutingDetails.reduce(
        (
          acc: any[],
          { title, path, exact, component, icon }: RoutingDetailType,
          index
        ) => {
          if (!isNil(title)) {
            acc.push(
              <Link
                className={clsx(
                  style.link,
                  location.pathname === path && style.selected
                )}
                to={path}
                key={index}
              >
                {icon}
                {`${title}${getSuffix(path)}`}
              </Link>
            );
          }
          return acc;
        },
        []
      )}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  selectedRepoFullName: selectedRepoFullNameSelector,
});

const connector = connect(mapStateToProps);

export type NavigationComponentPropsFromRedux = ConnectedProps<
  typeof connector
>;

export default connector(NavigationComponent);
