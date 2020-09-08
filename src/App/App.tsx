import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Share from '../Share/Share';
import Download from '../Download/Download';

export const DownloadContext = React.createContext<{ magnet: string | null }>({ magnet: null });

function App() {
  return (
    <Switch>
      <DownloadContext.Provider value={{ magnet: null }}>
        <Route path="/download/:fileID">
          <Download />
        </Route>
        <Route path="/download/">
          <Download />
        </Route>
        <Route path="/">
          <Share />
        </Route>
      </DownloadContext.Provider>
    </Switch>
  );
}

export default App;
