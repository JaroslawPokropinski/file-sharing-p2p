import React, { useState, useEffect } from 'react';
import Peer from 'simple-peer';
import axios from '../config/axios';
import Filereader from './Filereader';
import QRCode from 'qrcode.react';
import server from '../config/server';

function ModalContent(props: { file: File; onClose: () => void }) {
  const [activeDownloads, setActiveDownloads] = useState(0);
  const [uuid, setUUID] = useState(null as null | string);

  const onUUID = (uuid: string, file: File): Peer.Instance => {
    setUUID(uuid);
    let peer: Peer.Instance | null = new Peer({ initiator: true });
    peer.on('signal', (data) => {
      // send 'data' on server
      const strData = JSON.stringify(data);
      axios.post('/signal', { uuid, signal: Buffer.from(strData).toString('base64') });
    });

    peer.on('connect', () => {
      console.log('connected');
      peer?.send(file.name);
      const reader = new Filereader(file);
      peer?.on('data', () => {
        if (reader.isFinished()) {
          peer?.destroy();
        } else {
          reader.getNextChunk((chunk) => {
            peer?.send(chunk);
          });
        }
      });
    });
    peer.on('close', () => {
      setActiveDownloads((activeDownloads) => activeDownloads - 1);
    });

    peer.on('error', (err) => {
      console.error(err.message);
      peer = null;
    });

    return peer;
  };

  useEffect(() => {
    let peer: Peer.Instance | null = null;
    const socket = new WebSocket(server.wsUrl);
    socket.onopen = () => {
      const data = JSON.stringify({ event: 'share' });
      socket.send(data);
    };
    socket.onmessage = function (ev) {
      console.log(ev);
      const data = JSON.parse(ev.data);
      if (data.event === 'id') {
        peer = onUUID(data.data, props.file);
      }
      if (data.event === 'signal') {
        if (peer === null) {
          console.error('Peer is null!');
          return;
        }
        peer.signal(data.data);
      }
    };
  }, [props.file]);

  const getUrl = () => {
    return `${window.location.origin}/#/download/${uuid}`;
  };

  return (
    <div className="modal-root">
      <div className="modal-body">
        <div>You are sharing file. Do not close this modal.</div>
        <div>
          <QRCode className="qrcode" renderAs="svg" value={getUrl()} />
        </div>
        <div>File name: {props.file.name}</div>
        {/* <div>Active downloads: {activeDownloads}</div> */}
        <div>Share url: {getUrl()}</div>
        <button className="button" onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ModalContent;
