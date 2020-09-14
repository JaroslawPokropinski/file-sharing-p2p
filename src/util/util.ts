import { TorrentFile } from 'webtorrent';

export const getTorrentBuffer = (file: TorrentFile): Promise<Buffer | undefined> =>
  new Promise((resolve, reject) =>
    file.getBuffer((err, buf) => {
      if (err != null) reject(err);

      resolve(buf);
    }),
  );
