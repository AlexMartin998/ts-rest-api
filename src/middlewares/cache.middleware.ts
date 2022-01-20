import { NextFunction, Request, Response, Send } from 'express';
import mcache from 'memory-cache';

import { CACHE_KEY } from '../config';

interface CacheInterface extends Response {
  sendResponse: Send;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: any;
}

export const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key: string = CACHE_KEY + req.originalUrl || req.url;
    const cacheBody = mcache.get(key);

    if (cacheBody) {
      console.log('CACHEADO');
      return res.send(JSON.parse(cacheBody));
    } else {
      // Lo Cacheamos
      console.log('A CACHEAR');

      // BAD CODE TS
      const resCopy = res as CacheInterface;
      const resCopy2 = res as CacheInterface;

      resCopy.sendResponse = res.send;
      resCopy2.send = (body: string) => {
        mcache.put(key, body, duration * 1000);
        resCopy.sendResponse(body);
      };

      return next();
    }
  };
};
