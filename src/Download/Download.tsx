import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import WebTorrent from 'webtorrent';
import save from './saveToDrive';
import humanFileSize from './humanBytes';
import downloadImg from './download_file.png';
import { DownloadContext } from '../App/App';

function Download() {
  const params = useParams<{ fileID?: string }>();
  const context = useContext(DownloadContext);
  const [speed, setSpeed] = useState(0);
  const [downloadState, setDownloadState] = useState('waiting' as 'waiting' | 'downloading' | 'downloaded');
  const history = useHistory();

  useEffect(() => {
    if (params.fileID != null) {
      context.magnet = params.fileID;
      history.replace('/download/');
    }
  }, [params, context, history]);

  useEffect(() => {
    if (context.magnet == null && params.fileID == null) {
      history.replace('/');
    }
  }, [params, context, history]);

  useEffect(() => {
    if (context.magnet == null || params.fileID != null) {
      return;
    }

    const fileID = context.magnet;
    setDownloadState('downloading');
    const client = new WebTorrent();
    const magnet = Buffer.from(fileID, 'base64').toString('utf-8');
    console.log('Look for: ', magnet);
    client.add(magnet, (torrent) => {
      // Got torrent metadata!
      console.log('Client is downloading:', torrent.infoHash);

      torrent.on('download', () => {
        setSpeed(torrent.downloadSpeed);
      });

      torrent.on('done', () => {
        if (downloadState !== 'downloading') return;

        setDownloadState('downloaded');
        console.log('Downloading finished');
        torrent.files.forEach((file) => {
          console.log(file.name);
          file.getBuffer((err, buf) => {
            if (err == null && buf != null) {
              save(file.name, buf);
            }
          });
        });
      });
    });
  }, [context.magnet, params, downloadState]);

  const renderState = (state: typeof downloadState) => {
    switch (state) {
      case 'waiting':
        return (
          <>
            <div>Waiting for server...</div>
          </>
        );

      case 'downloading':
        return (
          <>
            <div>You are downloading.</div>
            <div>{humanFileSize(speed)}/s</div>
          </>
        );
      case 'downloaded':
        return (
          <>
            <div>Downloading finished.</div>
          </>
        );
    }
  };
  return (
    <div className="download-root">
      <div className="download-border">
        <div className="download-body">
          <img src={downloadImg} alt="Download file" draggable={false} />
          {renderState(downloadState)}
        </div>
      </div>
    </div>
  );
}

export default Download;
