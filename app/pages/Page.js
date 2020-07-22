import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/api';
import css from './Home.css';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Input from '../components/Input';
import Radio from '../components/Radio';
import Select from '../components/Select';

export default (props) => {
  const [data, refetch, status] = useApi('/get', {
    params: { name: 'martin' },
  });
  const [form, setForm] = useState();
  const updateField = (e, k, v) => {
    setForm((form) => ({ ...form, [k]: v }));
  };
  useEffect(() => {
    setForm(data ? data.args : {});
  }, [data]);
  if (!status.loaded) {
    return <p>Loading ...</p>;
  }

  // The api endpoint returns a JSON document with the param args
  // Let's just show that in a list.

  const fields = Object.entries(form).map((entry) => (
    <li key={entry[0]}>
      <Input
        label={entry[0]}
        name={entry[0]}
        value={entry[1]}
        onChange={updateField}
      />
    </li>
  ));

  return (
    <div className={css.root}>
      <h1>Sample API Response</h1>
      <ul>{fields}</ul>
      <Button onClick={refetch}>reload</Button>
    </div>
  );
};
