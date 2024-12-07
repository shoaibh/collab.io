import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React, { PropsWithChildren } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

type WorkspaceSectionProps = PropsWithChildren<{
  label: string;
  hint: string;
  onNew?: () => void;
  isMobile?: boolean;
}>;

export const WorkspaceSection = ({ label, hint, onNew, children, isMobile }: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div id={isMobile ? "" : label.toLowerCase().split(" ").join("-")} className="flex flex-col mt-2 px-2">
      <div id={isMobile ? "" : `add-${label.toLowerCase().split(" ").join("-")}`} className="flex items-center group">
        <Button variant="transparent" className="p-0.5 text-sm text-[#B39A86] shrink-0 size-6" onClick={toggle}>
          <FaCaretDown className={cn("size-4 transition-transform", !on && "-rotate-90")} />
        </Button>
        <Button variant="transparent" size="sm" className="text-[#2b2015] group px-1.5 text-sm h-[28px] justify-start overflow-hidden">
          <span>{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              variant="transparent"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
              onClick={onNew}
            >
              <PlusIcon className="size-5 text-black" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
