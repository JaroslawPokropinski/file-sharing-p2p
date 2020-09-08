import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WebTorrent from 'webtorrent';
import save from './saveToDrive';
import humanFileSize from './humanBytes';
import downloadImg from './download_file.png';

function Download() {
  const { fileID } = useParams<{ fileID: string }>();
  const [speed, setSpeed] = useState(0);
  const [downloadState, setDownloadState] = useState('waiting' as 'waiting' | 'downloading' | 'downloaded');

  useEffect(() => {
    setDownloadState('downloading');
    const client = new WebTorrent();
    const magnet = Buffer.from(fileID, 'base64').toString('utf-8');
    console.log('Look for: ', magnet);
    client.add(magnet, (torrent) => {
      // Got torrent metadata!
      console.log('Client is downloading:', torrent.infoHash);

      const intervalUpdateTime = 1000;
      const interv = setInterval(() => {
        setSpeed(torrent.downloadSpeed);
      }, intervalUpdateTime);

      torrent.on('done', () => {
        clearInterval(interv);
        setDownloadState('downloaded');
        torrent.files.forEach(function (file) {
          console.log(file.name);
          file.getBuffer((err, buf) => {
            if (err == null && buf != null) {
              save(file.name, buf);
            }
          });
        });
      });
    });
  }, [fileID]);

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
