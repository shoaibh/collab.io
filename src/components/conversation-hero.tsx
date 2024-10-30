import { usePanel } from "@/hooks/use-panel";
import { Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ConversationHero = ({
  memberId,
  name = "Member",
  image,
}: {
  memberId?: Id<"members">;
  name?: string;
  image: string | undefined;
}) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  const { onOpenProfile } = usePanel();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2 cursor-pointer" onClick={() => memberId && onOpenProfile(memberId)}>
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold hover:underline ">{name}</p>
      </div>

      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};
