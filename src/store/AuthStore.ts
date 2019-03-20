import Store from "./Store";
import * as api from "../api";
import {User} from "../api";

export type AuthStoreState = {
  isAuthenticated: boolean,
  token?: string,
  account?: api.Account,

}

function getInitState(): AuthStoreState {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("account");

  return (token && user) ? {
    isAuthenticated: true,
    token,
    account: JSON.parse(user)
  } : {isAuthenticated: false};
}

export class AuthStore extends Store<AuthStoreState> {
  constructor() {
    super(getInitState());
  }

  get isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  get token(): string | undefined {
    return this.state.token;
  }

  get account(): api.Account | undefined {
    return this.state.account;
  }

  updateAccount(): Promise<api.Account> {
    if (this.isAuthenticated) {
      return api
        .getAccountDetails(this.state.token)
        .then(account => {
          this.setState({account: account});
          return account;
        });
    }
    return new Promise<api.Account>(resolve => resolve(this.state.account));
  }

  signup(
    login: string,
    firstname: string,
    lastname: string,
    password: string
  ): Promise<User> {
    return api.signup(login, firstname, lastname, password);
  }

  authenticate(
    login: string,
    password: string,
    callback: (error?: Error) => void) {
    api
      .login(login, password)
      .then((value: {token: string, owner: api.User}) => {
        sessionStorage.setItem("token", value.token);

        api.getAccountDetails(value.token).then(account => {
          sessionStorage.setItem("account", JSON.stringify(account));
          this.setState({isAuthenticated: true, token: value.token, account: account});
        }).catch(error => {
          const account = api.userToAccount(value.owner);
          sessionStorage.setItem("account", JSON.stringify(account));
          this.setState({isAuthenticated: true, token: value.token, account: account});

          console.log(`AuthStore.authenticate getAccountDetails failed`, error);
        });

        callback(null);
      })
      .catch(error => {
        console.log(`AuthStore.authenticate login failed`, error);
        callback(error);
      });
  }

  signout = (callback: () => void) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("account");
    this.setState({
      isAuthenticated: false,
      token: undefined,
      account: undefined
    });
    callback();
  };
}

export default AuthStore;