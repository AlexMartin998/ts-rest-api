import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY_URL } from '../config/index';
import { getModel, uploadFile } from '../helpers';

cloudinary.config(CLOUDINARY_URL);

interface uploadController {
  arrName: string;
  img: string;
  file: string;
  save: () => Promise<string>;
}

export const uploadFileController: RequestHandler = async (req, res) => {
  try {
    // const fileName = await uploadFile(req.files, 'textFiles');
    // const fileName = await uploadFile(req.files, 'pdf');
    const fileName = await uploadFile(req.files, 'images');

    res.status(201).json({ fileName });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const serveImg: RequestHandler<{
  collection: string;
  id: string;
}> = async (req, res) => {
  const { collection, id } = req.params;
  const placeholder: string = path.join(
    __dirname,
    './../assets/nope-not-here.png'
  );

  const model = await getModel(collection, id);

  // Get img path
  if (model.img) {
    const imgPath = path.join(__dirname, './../uploads', collection, model.img);
    if (fs.existsSync(imgPath)) return res.sendFile(imgPath);

    return res.status(200).json({ ImgUrl: model.img });
  }

  res.sendFile(placeholder);
};

export const updateImg: RequestHandler<{
  collection: string;
  id: string;
}> = async (req, res) => {
  const { collection, id } = req.params;

  const model = (await getModel(collection, id)) as uploadController;

  // Delete previous images
  if (model.img) {
    const imgPath = path.join(__dirname, './../uploads', collection, model.img);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  // Upload new image
  try {
    const fileName: string = await uploadFile(req.files, collection);
    model.img = fileName;
    await model.save();

    res.json({
      msg: 'Updated!',
      model,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const updateImgCloudinary: RequestHandler<{
  collection: string;
  id: string;
}> = async (req, res) => {
  const { collection, id } = req.params;

  const model = (await getModel(collection, id)) as uploadController;

  // // Delete previous images
  if (model.img) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arrName: any = model.img.split('/');
    const [public_id] = arrName.at(-1).split('.');
    cloudinary.uploader.destroy(public_id);
  }

  // // Upload img
  const { tempFilePath } = req.files?.file as { tempFilePath: string };

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json({
    msg: 'Updated!',
    model,
  });
};
