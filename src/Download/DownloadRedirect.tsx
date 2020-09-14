import React, { useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DownloadContext } from '../App/App';

function DownloadRedirect() {
  const params = useParams<{ fileID: string }>();
  const history = useHistory();
  const context = useContext(DownloadContext);

  useEffect(() => {
    if (params.fileID != null) {
      context.magnet = params.fileID;
      history.replace('/download/');
    }
  }, [params, context, history]);

  return <div />;
}

export default DownloadRedirect;
