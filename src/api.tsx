// @flow

/* Type Definitions for Flow, can be ignored if Flow is not used. */

export type AccountNr = string;

export type User = {
  login: string,
  firstname: string,
  lastname: string,
  accountNr: AccountNr
};

export type Account = {
  accountNr: AccountNr,
  amount?: number,
  owner: { firstname: string, lastname: string, login?: string }
}

export type TransferResult = {
  from: AccountNr,
  target: AccountNr,
  amount: number,
  total: number,
  date: string
};

export type Transaction = {
  from: AccountNr,
  target: AccountNr,
  amount: number,
  total: number,
  date: string
};

/* Use the exported functions to call the API. 
 * If necessary, adapt the backend address below:
 */

export function userToAccount(user: User): Account {
  return {
    accountNr: user.accountNr,
    owner: {
      login: user.login,
      firstname: user.firstname,
      lastname: user.lastname
    }
  }
}

const backend = "http://localhost:3000";

export function login(
  login: string,
  password: string
): Promise<{ token: string, owner: User }> {
  return postJson("/auth/login", { login, password }).then(parseJSON);
}

export function signup(
  login: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<User> {
  return postJson("/auth/register", {
    login,
    firstname,
    lastname,
    password
  }).then(parseJSON);
}

export function getAccountDetails(
  token: string
): Promise<Account> {
  return getAuthenticatedJson(`/accounts`, token).then(parseJSON);
}

export function getAccount(
  accountNr: AccountNr,
  token: string
): Promise<Account> {
  return getAuthenticatedJson(`/accounts/${accountNr}`, token).then(parseJSON);
}

export function transfer(
  target: AccountNr,
  amount: number,
  token: string
): Promise<TransferResult> {
  return postAuthenticatedJson("/accounts/transactions", token, {
    target,
    amount
  }).then(parseJSON);
}

export function getTransactions(
  token: string,
  fromDate: string = "",
  toDate: string = "",
  count: number = 3,
  skip: number = 0
): Promise<{ result: Array<Transaction>, query: { resultcount: number } }> {
  return getAuthenticatedJson(
    `/accounts/transactions?fromDate=${fromDate}&toDate=${toDate}&count=${count}&skip=${skip}`,
    token
  ).then(parseJSON);
}

function checkStatus(response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error: any = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function getAuthenticatedJson(endpoint: string, token: string): Promise<Response> {
  return fetch(`${backend}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  }).then(checkStatus);
}

function postJson(endpoint: string, params: Object): Promise<Response> {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(params)
  }).then(checkStatus);
}

function postAuthenticatedJson(
  endpoint: string,
  token: string,
  params: Object
): Promise<Response> {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(params)
  }).then(checkStatus);
}
