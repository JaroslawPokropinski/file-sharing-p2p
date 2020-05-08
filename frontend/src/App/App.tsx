import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Share from '../Share/Share';
import Download from '../Download/Download';

function App() {
  return (
    <Switch>
      <Route path="/download/:fileID">
        <Download />
      </Route>
      <Route path="/">
        <Share />
      </Route>
    </Switch>
  );
}

export default App;
