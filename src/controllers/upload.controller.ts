import { RequestHandler } from 'express';

import { uploadFile } from '../helpers';

export const uploadFileController: RequestHandler = async (req, res) => {
  try {
    // const fileName = await uploadFile(req.files, 'textFiles');
    const fileName = await uploadFile(req.files, 'pdf');
    // const fileName = await uploadFile(req.files, 'images');

    res.status(201).json({ fileName });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};
