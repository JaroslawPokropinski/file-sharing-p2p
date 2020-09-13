import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';

// import addFile from './add_file.png';
import uploadIcon from './upload.png';
import ModalContent from '../ModalContent/ModalContent';

function fileDialog(): Promise<FileList | null> {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  return new Promise(function (resolve) {
    input.onchange = function () {
      if (input.files == null) return resolve();

      return resolve(input.files);
    };
    input.click();
  });
}

function Share() {
  const [isOverlayHidden, hideOverlay] = useState(true);
  const [isModalShown, showModal] = useState(false);
  const [files, setFiles] = useState<FileList | File[] | null>(null);

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
      setFiles(files);
    },
    [hideOverlay],
  );

  const promptFile = useCallback(() => {
    fileDialog().then((files) => {
      if (files == null) return;
      hideOverlay(true);
      showModal(true);
      setFiles(files);
    });
  }, [setFiles]);

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
        isOpen={isModalShown && files != null}
        contentLabel="File modal"
        className="modal"
        overlayClassName="modal-overlay"
        closeTimeoutMS={200}
      >
        <ModalContent files={files} onClose={() => showModal(false)} />
      </Modal>

      <ShareContent isModalShown={isModalShown} />
    </div>
  );
}

export default Share;
