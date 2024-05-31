import cc from "classcat";
import { Bomb as BombIcon } from "lucide-react";

export default function Bomb({
  src,
  small,
}: {
  src?: string;
  small?: boolean;
}) {
  return (
    <div
      className={cc([
        "relative flex items-center justify-center text-primary",
        small ? "w-12 h-12" : "w-24 h-24",
      ])}
    >
      <BombIcon size={small ? 48 : 96} />
      <div
        className={cc([
          "absolute rounded-full overflow-hidden flex items-center justify-center",
          small ? "w-8 h-8 bottom-1.5 left-1.5" : "w-16 h-16 bottom-3 left-3",
        ])}
      >
        {src ? (
          <img src={src} className="w-full h-full object-cover rotate-45" />
        ) : (
          <div className={cc(["font-bold", small ? "text-xl" : "text-3xl"])}>
            ?
          </div>
        )}
      </div>
    </div>
  );
}
