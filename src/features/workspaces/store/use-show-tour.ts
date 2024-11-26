import { atom, useAtom } from "jotai";

const tourStarted = atom<boolean>(false);

export const useShowTour = () => {
  return useAtom(tourStarted);
};
