"use client";

import { Provider } from "jotai";
import React, { PropsWithChildren } from "react";

export const JotaiProvider = ({ children }: PropsWithChildren) => {
  return <Provider>{children}</Provider>;
};
