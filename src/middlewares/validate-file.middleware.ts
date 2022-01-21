import { NextFunction, Request, Response, RequestHandler } from 'express';

export const validateFile: RequestHandler = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file)
    return res
      .status(400)
      .json({ msg: 'No file has been selected. - validateFile()' });

  // console.log('req.files >>>', req.files); // express-fileupload

  return next();
};

export const validateFileExts = (allowedExts: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { file } = req.files as { file: any };
    const fileExtension: string = file.name.split('.').at(-1);

    if (!allowedExts.includes(fileExtension))
      return res
        .status(400)
        .json({ msg: `File not allowed: '.${fileExtension}' isn't allowed!` });

    return next();
  };
};
