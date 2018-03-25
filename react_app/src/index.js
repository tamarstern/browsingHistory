import React from 'react';
import ReactDOM from 'react-dom';
import BrowsingHistoryLst from './BrowsingHistoryLst';
import './index.css';

// Change subreddit to whatever you like:
ReactDOM.render(
  <BrowsingHistoryLst browsingHistory='reactjs' />,
  document.getElementById('root')
);
