import React, { ChangeEvent, useState } from "react";
import style from "./auth-token-input.module.scss";
import { AppDispatch } from "../../redux/store";
import { setAuthToken } from "../../redux/config/config.reducer";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { authTokenSelector } from "../../redux/config/config.selector";
import {
  isAuthTokenValid,
  setAuthTokenToLocalStorage,
} from "./auth-token-input.utils";
import { useHistory } from "react-router-dom";
import IconCheckMark from "../../images/svg/icon-check-mark.svg";
import IconRemove from "../../images/svg/icon-remove.svg";
import { RoutingPaths } from "../../types/app.types";

export interface AuthTokenInputComponentProps
  extends AuthTokenInputComponentPropsFromRedux {}

function AuthTokenInputComponent({
  authToken = "",
  setAuthToken,
}: AuthTokenInputComponentProps) {
  const history = useHistory();
  const [token, setToken] = useState<string>(authToken);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isErrorIconVisible, setIsErrorIconVisible] = useState<boolean>(false);

  const handleTokenInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setToken(value);
    if (isAuthTokenValid(value, authToken)) {
      setIsTokenValid(true);
      setIsErrorIconVisible(false);
    } else {
      setIsTokenValid(false);
      setIsErrorIconVisible(true);
    }
  };

  const handleAddToken = () => {
    if (isTokenValid) {
      setAuthToken(token);
      setAuthTokenToLocalStorage(token);
      setTimeout(() => {
        history.push(RoutingPaths.REPOSITORIES);
      }, 200);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.title}>GitHub Personal Access Token</div>
      <div className={style.input_wrapper}>
        <input
          type="password"
          value={token}
          onChange={handleTokenInputChange}
        />
        {isErrorIconVisible && (
          <IconRemove className={style.input_error_icon} />
        )}
        {isTokenValid && <IconCheckMark className={style.input_check_icon} />}
      </div>
      <button disabled={!isTokenValid} onClick={handleAddToken}>
        Set New Token
      </button>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  authToken: authTokenSelector,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setAuthToken: (token: string) => {
    dispatch(setAuthToken(token));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type AuthTokenInputComponentPropsFromRedux = ConnectedProps<
  typeof connector
>;

export default connector(AuthTokenInputComponent);
