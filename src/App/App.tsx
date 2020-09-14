import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Share from '../Share/Share';
import Download from '../Download/Download';
import DownloadRedirect from '../Download/DownloadRedirect';

export const DownloadContext = React.createContext<{ magnet: string | null }>({ magnet: null });

function App() {
  return (
    <Switch>
      <DownloadContext.Provider value={{ magnet: null }}>
        <Route path="/download/:fileID" exact>
          <DownloadRedirect />
        </Route>
        <Route path="/download/" exact>
          <Download />
        </Route>
        <Route path="/" exact>
          <Share />
        </Route>
      </DownloadContext.Provider>
    </Switch>
  );
}

export default App;
