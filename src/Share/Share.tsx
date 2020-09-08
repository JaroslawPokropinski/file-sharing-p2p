import React, { useState } from 'react';
import Modal from 'react-modal';

import addFile from './add_file.png';
import ModalContent from '../ModalContent/ModalContent';

function Share() {
  const [isOverlayHidden, hideOverlay] = useState(true);
  const [isModalShown, showModal] = useState(null as React.DragEvent<HTMLDivElement> | null);
  const [file, setFile] = useState(null as File | null);

  const onDragStartEnd = (ev: React.DragEvent<HTMLDivElement>, start: boolean) => {
    ev.preventDefault();
    hideOverlay(!start);
  };

  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    hideOverlay(true);
    showModal(ev);

    let files: File[] | FileList;
    if (ev.dataTransfer.items) {
      files = [];
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          const f: File | null = ev.dataTransfer.items[i].getAsFile();
          if (f) {
            files.push(f);
          }
        }
      }
    } else {
      files = ev.dataTransfer.files;
    }
    if (files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div className="share-root">
      <div className={`overlay ${isOverlayHidden ? 'hide-overlay' : 'show-overlay'}`} />
      <Modal
        isOpen={isModalShown != null && file != null}
        contentLabel="File modal"
        className="modal"
        overlayClassName="modal-overlay"
        closeTimeoutMS={200}
      >
        <ModalContent file={file as File} onClose={() => showModal(null)} />
      </Modal>
      {!isModalShown ? (
        <div
          className="file-drop-area"
          onDrop={onDrop}
          onDragOver={(ev) => onDragStartEnd(ev, true)}
          onDragLeave={(ev) => onDragStartEnd(ev, false)}
        >
          <img src={addFile} alt="Add file" draggable={false} />
        </div>
      ) : null}
    </div>
  );
}

export default Share;
