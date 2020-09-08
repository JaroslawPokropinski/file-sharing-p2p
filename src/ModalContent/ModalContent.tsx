import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import WebTorrent from 'webtorrent';

function ModalContent(props: { file: File; onClose: () => void }) {
  const [uploadState, setUploadState] = useState<'loading' | 'uploading' | 'error'>('loading');
  const [uuid, setUUID] = useState(null as null | string);

  useEffect(() => {
    const client = new WebTorrent();
    console.log(props.file);

    client.on('error', (error) => {
      setUploadState('error');
      console.error(error);
    });

    client.seed(props.file, (torrent) => {
      setUploadState('uploading');
      const codedMagnet = Buffer.from(torrent.magnetURI).toString('base64');
      console.log('Client is seeding:', torrent.magnetURI);
      setUUID(codedMagnet);
    });
  }, [props.file, setUUID]);

  const getUrl = () => {
    return `${window.location.href}download/${uuid}`;
  };

  return (
    <div className="modal-root">
      <div className="modal-body">
        <div>You are sharing file. Do not close this modal.</div>
        <div>
          <QRCode className="qrcode" renderAs="svg" value={getUrl()} />
        </div>
        {uploadState === 'uploading' ? (
          <div>
            <div>File name: {props.file.name}</div>
            {/* <div>Active downloads: {activeDownloads}</div> */}
            <div className="share-text">Share url: {getUrl()}</div>
          </div>
        ) : null}
        <button className="button" onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ModalContent;
