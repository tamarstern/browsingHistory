import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class BrowsingHistoryLst extends React.Component {
  static propTypes = {
    browsingHistory: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props);
    this.setExpanded = this.setExpanded.bind(this);
  }
  state = {
    histories: [],
    loading: true,
    error: null
  }

  componentDidMount() {
    axios.get(`http://localhost:3030/api/browsingHistorys`)
      .then(res => {
        // Transform the raw data by extracting the nested histories
        const histories = res.data.map((h) => ({...h, isExpanded:false}));;
        
        // Update state to trigger a re-render.
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
          histories,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }


  setExpanded (hID) {
    this.setState((prev) => ({...prev, histories:prev.histories.map((h) => {
      if (h._id != hID) return h;
      return {...h, isExpanded: !h.isExpanded};
    })}));
  }

  renderHistories() {
    // Using destructuring to extract the 'error' and 'histories'
    // keys from state. This saves having to write "this.state.X" everwhere.
    const { error, histories } = this.state;
    
    if (error) {
      return this.renderError();
    }
    
    return (
      <ul>
        {histories.map(history =>
          <li onClick={(e) => this.setExpanded(history._id)} key={history._id}>
            <div>
              <span className="dateStyle">{history.time}</span>
              {history.url}
              <h3 hidden={!history.isExpanded}>referrer : {history.referrer} </h3>
              <h3 hidden={!history.isExpanded && history.iframes}> iframes : {history.iframes ? history.iframes : 'NO_IFRAMES'}</h3>
            </div>
          </li>
        )}
      </ul>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <h1>{`My Browing History`}</h1>
        {loading ? this.renderLoading() : this.renderHistories()}
      </div>
    );
  }
}


export default BrowsingHistoryLst;
