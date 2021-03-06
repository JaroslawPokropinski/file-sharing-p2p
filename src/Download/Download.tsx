import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import WebTorrent from 'webtorrent';
import save from './saveToDrive';
import humanFileSize from './humanBytes';
import downloadImg from './download_file.png';
import { DownloadContext } from '../App/App';
import { delay } from '../util/delay';
import { getTorrentBuffer } from '../util/util';

function Download() {
  const context = useContext(DownloadContext);
  const [speed, setSpeed] = useState(0);
  const [downloadState, setDownloadState] = useState('waiting' as 'waiting' | 'downloading' | 'downloaded');
  const history = useHistory();

  useEffect(() => {
    if (context.magnet == null) {
      history.replace('/');
    }
  }, [context, history]);

  useEffect(() => {
    if (context.magnet == null) {
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

      torrent.on('done', async () => {
        setDownloadState('downloaded');
        console.log('Downloading finished');
        for (let i = 0; i < torrent.files.length; i++) {
          try {
            const file = torrent.files[i];

            console.log(file.name);
            const buf = await getTorrentBuffer(file);
            if (buf == null) continue;

            save(file.name, buf);
            await delay(100);
          } catch (error) {
            console.error(error);
          }
        }
      });
    });
    return () => {
      client.destroy();
    };
  }, [context]);

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
