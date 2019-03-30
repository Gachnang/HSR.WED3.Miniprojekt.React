import React from "react";
import {render} from "react-dom";
import App from "./App";

import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducer from './reducers'

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  reducer,
  composeWithDevTools({trace: true, traceLimit: 25})(
    applyMiddleware(...middleware),
    // other store enhancers if any
  ));

// render(<App />, document.getElementById("root"));
render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
