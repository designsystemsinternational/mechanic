import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/api';
import Header from '../components/Header';
import css from './Home.css';

export default (props) => {
  const [data, loadData, status] = useApi('/get');

  if (!status.loaded) {
    return <p>Loading ...</p>;
  }

  // The api endpoint returns a JSON document with the headers
  // Let's just show that in a list.
  const list = Object.entries(data.headers).map((entry) => (
    <li key={entry[0]}>
      {entry[0]}: {entry[1]}
    </li>
  ));

  return (
    <div className={css.root}>
      <Header title="Homepage" />
      <Link to={'/page'}>Go to /page</Link>
      <h1>Sample API Response</h1>
      <ul>{list}</ul>
    </div>
  );
};
