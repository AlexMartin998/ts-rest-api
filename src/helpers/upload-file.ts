import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadFile = (files: any, directory: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // console.log(files);

    const { file } = files;
    const fileExtension: string = file?.name.split('.').at(-1);

    // Upload file
    const fileName: string = uuidv4() + '.' + fileExtension;
    const uploadPath: string = path.join(
      __dirname,
      './../uploads',
      directory,
      fileName
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file.mv(uploadPath, (err: any) => {
      if (err) reject(err);
      resolve(fileName);
    });
  });
};
