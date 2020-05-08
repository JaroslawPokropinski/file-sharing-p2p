const saveToDrive = (name: string, buffer: Buffer, w = window, d = document) => {
  const url = w.URL.createObjectURL(new Blob([new Uint8Array(buffer, 0, buffer.length)]));
  const tempLink = d.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', name);
  tempLink.click();
};

export default saveToDrive;
