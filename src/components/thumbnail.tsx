/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type ThumbnailProps = {
  url: string | null | undefined;
};

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img className="object-cover size-full rounded-md" src={url} alt="message image" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img className="object-cover w-full h-full" src={url} alt="message image" />
      </DialogContent>
    </Dialog>
  );
};
