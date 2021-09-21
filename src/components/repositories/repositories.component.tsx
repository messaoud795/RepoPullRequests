import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import style from "./repositories.module.scss";
import { createStructuredSelector } from "reselect";
import { AppDispatch } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import {
  repoListSelector,
  selectedRepoUrlSelector,
} from "../../redux/repositories/repositories.selector";
import {
  RepoSearchResponse,
  RepositoryDataType,
} from "../../services/http/repositories/repositories.types";
import {
  addRepositoryToState,
  selectRepository,
} from "../../redux/repositories/repositories.reducer";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { authTokenSelector } from "../../redux/config/config.selector";
import { getRepositoriesForKeyword } from "../../services/http/repositories/repositories.service";
import produce from "immer";
import ClickAwayListener from "react-click-away-listener";
import { TimeOutType } from "../../types/app.types";
import IconCheckMark from "../../images/svg/icon-check-mark.svg";

export interface RepositoriesComponentProps
  extends RepositoriesComponentPropsFromRedux {}

let timeOut: TimeOutType;

function RepositoriesComponent({
  repoList = [],
  selectedRepoUrl = "",
  selectRepository,
  authToken = "",
  addRepo,
}: RepositoriesComponentProps) {
  const [newRepoUrl, setNewRepoUrl] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Array<RepoSearchResponse>>(
    []
  );
  const [isSearchResultsOpen, setSearchResultsIsOpen] =
    useState<boolean>(false);
  const [isRepoSelected, setIsRepoSelected] = useState<boolean>(false);
  const [isSearchInProgress, setIsSearchInProgress] = useState<boolean>(false);
  const [isRepoRequestInProgress, setIsRepoRequestInProgress] =
    useState<boolean>(false);
  const _isMounted = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (_isMounted.current)
      setIsRepoSelected(searchResults.some((r) => r.selected));
  }, [searchResults]);

  useEffect(() => {
    if (_isMounted.current) setIsRepoRequestInProgress(false);
  }, [repoList]);

  const addSelectedRepo = () => {
    const selectedRepo: RepoSearchResponse | undefined = searchResults.find(
      (r) => r.selected
    );
    if (selectedRepo) {
      setIsRepoRequestInProgress(true);
      addRepo(selectedRepo.url, selectedRepo.full_name);
    }
  };

  const handleNewRepoNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNewRepoUrl(value);

    if (value?.length > 3) {
      if (timeOut) {
        clearTimeout(timeOut);
      }
      timeOut = setTimeout(() => {
        setSelectedSearchResult(-1);
        setIsSearchInProgress(true);
        getRepositoriesForKeyword(value, authToken)
          .then((searchResults: Array<RepoSearchResponse>) => {
            if (!isEmpty(searchResults)) {
              setSearchResults(searchResults);
              setSearchResultsIsOpen(true);
              setIsSearchInProgress(false);
            }
          })
          .finally(() => {
            if (isSearchInProgress) {
              setIsSearchInProgress(false);
            }
          });
      }, 1000);
    }
  };

  const setSelectedSearchResult = (repoId: number) => {
    setSearchResults(
      produce((draft: any) => {
        draft.forEach((item: RepoSearchResponse) => {
          item.selected = item.id === repoId;
        });
      })
    );
    setSearchResultsIsOpen(false);
  };

  const openSearchResults = () => {
    if (!isEmpty(searchResults)) {
      setSearchResultsIsOpen(true);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.title}>GitHub Repositories</div>

      <div className={style.add_repo_container}>
        <ClickAwayListener onClickAway={() => setSearchResultsIsOpen(false)}>
          <div className={style.add_repo_input}>
            <input
              type="text"
              value={
                searchResults.find((r) => r.selected)?.full_name ?? newRepoUrl
              }
              onChange={handleNewRepoNameChange}
              onFocus={openSearchResults}
            />
            {isSearchInProgress && <span className={style.input_loader} />}
            {isSearchResultsOpen && !isEmpty(searchResults) && (
              <div className={style.search_results_container}>
                {searchResults.reduce((acc: any, res: RepoSearchResponse) => {
                  if (!repoList.some((repo) => repo.repoUrl === res.url)) {
                    acc.push(
                      <div
                        key={res.id}
                        className={style.search_result}
                        onClick={() => setSelectedSearchResult(res.id)}
                      >
                        {res.full_name}
                      </div>
                    );
                  }
                  return acc;
                }, [])}
              </div>
            )}
          </div>
        </ClickAwayListener>
        <button disabled={!isRepoSelected} onClick={addSelectedRepo}>
          {isRepoRequestInProgress ? (
            <div className={style.input_loader} />
          ) : (
            "Add Repo"
          )}
        </button>
      </div>

      <div className={style.repo_list}>
        {isEmpty(repoList)
          ? "No repos added yet..."
          : repoList.map((repoData: RepositoryDataType) => (
              <div
                key={repoData.repoUrl}
                className={clsx(
                  style.repo,
                  selectedRepoUrl === repoData.repoUrl && style.selected
                )}
                onClick={() => selectRepository(repoData.repoUrl)}
              >
                {repoData.repoFullName}
                {selectedRepoUrl === repoData.repoUrl && (
                  <IconCheckMark className={style.input_check_icon} />
                )}
              </div>
            ))}
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  repoList: repoListSelector,
  selectedRepoUrl: selectedRepoUrlSelector,
  authToken: authTokenSelector,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  selectRepository: (repoUrl: string) => {
    dispatch(selectRepository(repoUrl));
  },
  addRepo: (repoUrl: string, repoFullName: string) => {
    dispatch(addRepositoryToState({ repoUrl, repoFullName }));
    dispatch(selectRepository(repoUrl));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type RepositoriesComponentPropsFromRedux = ConnectedProps<
  typeof connector
>;

export default connector(RepositoriesComponent);
