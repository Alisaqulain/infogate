import type { NextApiRequest, NextApiResponse } from "next";

/** Multer middleware is Express-shaped; at runtime Next passes compatible req/res. */
export type NextApiMulterMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: unknown) => void
) => void;

export function runMulterMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: NextApiMulterMiddleware
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });
  });
}
