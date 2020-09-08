const chunkSize = 64 * 1024;

class Filereader {
  file: File;
  fileSize: number;
  offset = 0;

  constructor(file: File) {
    this.file = file;
    this.fileSize = file.size;
  }

  isFinished() {
    return this.offset >= this.fileSize;
  }

  getNextChunk(callback: (chunk: ArrayBuffer) => void) {
    if (!this.isFinished()) {
      this.chunkReaderBlock(this.offset, chunkSize, this.file, callback);
    }
  }

  readEventHandler(evt: ProgressEvent<FileReader>, callback: (chunk: ArrayBuffer) => void) {
    if (evt.target == null) {
      throw new Error('Event target is null');
    }
    if (evt.target.result && evt.target.error == null) {
      callback(evt.target.result as ArrayBuffer); // callback for handling read chunk
    } else {
      console.log('Read error: ' + evt.target.error);
      return;
    }
  }

  chunkReaderBlock(_offset: number, length: number, _file: File, callback: (chunk: ArrayBuffer) => void) {
    const r = new FileReader();
    const blob = _file.slice(_offset, length + _offset);
    this.offset += length;
    r.onload = (ev) => this.readEventHandler(ev, callback);
    r.readAsArrayBuffer(blob);
  }
}

export default Filereader;
