import { atom, useAtom } from "jotai";

const tourStep = atom<number>(0);

export const useTourCurrentStep = () => {
  return useAtom(tourStep);
};
