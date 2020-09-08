import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';

// import addFile from './add_file.png';
import uploadIcon from './upload.png';
import ModalContent from '../ModalContent/ModalContent';

function fileDialog(): Promise<File[] | null> {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  // input.accept = contentType;
  return new Promise(function (resolve) {
    input.onchange = function () {
      if (input.files == null) return resolve();

      const files = Array.from(input.files);
      return resolve(files);
      // resolve(files[0]);
    };
    input.click();
  });
}

function Share() {
  const [isOverlayHidden, hideOverlay] = useState(true);
  const [isModalShown, showModal] = useState(false);
  const [file, setFile] = useState(null as File | null);

  const onDragStartEnd = (ev: React.DragEvent<HTMLDivElement>, start: boolean) => {
    ev.preventDefault();
    hideOverlay(!start);
  };

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      ev.preventDefault();
      hideOverlay(true);
      showModal(true);

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
    },
    [hideOverlay],
  );

  const promptFile = useCallback(() => {
    fileDialog().then((file) => {
      if (file == null) return;
      hideOverlay(true);
      showModal(true);
      setFile(file[0]);
    });
  }, [setFile]);

  const ShareContent = useCallback(
    ({ isModalShown }: { isModalShown: boolean }) => {
      if (!isModalShown) {
        return (
          <div className="share-content">
            <div
              className="file-drop-area"
              onDrop={onDrop}
              onDragOver={(ev) => onDragStartEnd(ev, true)}
              onDragLeave={(ev) => onDragStartEnd(ev, false)}
              onClick={() => promptFile()}
            >
              <div>Drop a file to upload</div>
              <img src={uploadIcon} alt="Upload file" draggable={false} />
              <div>or click to browse</div>
            </div>
          </div>
        );
      }
      return null;
    },
    [onDrop, promptFile],
  );

  return (
    <div className="share-root">
      <div className={`${isOverlayHidden ? 'hide-overlay' : 'show-overlay'}`} />
      <Modal
        isOpen={isModalShown && file != null}
        contentLabel="File modal"
        className="modal"
        overlayClassName="modal-overlay"
        closeTimeoutMS={200}
      >
        <ModalContent file={file as File} onClose={() => showModal(false)} />
      </Modal>

      <ShareContent isModalShown={isModalShown} />
    </div>
  );
}

export default Share;
