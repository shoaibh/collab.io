import React from "react";
import Image from "next/image";

export const LogoLoader = ({ width = 100, height = 100 }: { width?: number; height?: number }) => {
  return <Image src="/collab-logo.png" width={width} height={height} alt="logo" className="animate-zoom" />;
};
