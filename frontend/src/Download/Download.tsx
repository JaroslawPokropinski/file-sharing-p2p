import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import save from './saveToDrive';
import humanFileSize from './humanBytes';
import downloadImg from './download_file.png';

function Download() {
  const { fileID } = useParams();
  const [fileName, setFileName] = useState('');
  const [speed, setSpeed] = useState(0);
  const [downloadState, setDownloadState] = useState('waiting' as 'waiting' | 'downloading' | 'downloaded');
  // const [speeds, setSpeeds] = useState(new Array<{ bytes: number; time: number }>());

  useEffect(() => {
    axios
      .get<string[]>(`/signal?uuid=${fileID}`)
      .then((axiosResponse) => {
        let name = '';
        const buffers: Uint8Array[] = [];
        let peer: Peer.Instance | null = new Peer();
        axiosResponse.data
          .map((d) => Buffer.from(d, 'base64').toString('utf-8'))
          .map((d) => JSON.parse(d))
          .forEach((s) => {
            peer?.signal(s);
          });

        peer.on('signal', (data) => {
          axios.post(`/signal-client`, { uuid: fileID, signal: data });
        });

        peer.on('connect', () => {
          console.log('connected');
        });

        let interv: NodeJS.Timeout | null = null;

        peer.once('data', (data: Uint8Array) => {
          name = data.toString();
          setFileName(name);
          setDownloadState('downloading');
          peer?.send('\0');
          let dataSizeTillUpdate = 0;
          const intervalUpdateTime = 500;
          interv = setInterval(() => {
            setSpeed((dataSizeTillUpdate * 1000) / intervalUpdateTime);
            dataSizeTillUpdate = 0;
          }, intervalUpdateTime);

          peer?.on('data', (data: Uint8Array) => {
            dataSizeTillUpdate += data.length;
            buffers.push(data);
            peer?.send('\0');
          });
        });

        peer.on('close', () => {
          console.log(name);
          peer?.removeAllListeners();
          if (interv) {
            clearInterval(interv);
            interv = null;
          }
          save(name, Buffer.concat(buffers));
          setDownloadState('downloaded');
        });

        peer.on('error', (err) => {
          peer = null;
          console.error(err);
        });
      })
      .catch((err) => console.error(err));
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
            <div>You are downloading {`'${fileName}'`}.</div>
            <div>{humanFileSize(speed)}/s</div>
          </>
        );
      case 'downloaded':
        return (
          <>
            <div>Downloading {`'${fileName}'`} finished.</div>
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
