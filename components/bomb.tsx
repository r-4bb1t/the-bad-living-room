import { Bomb as BombIcon } from "lucide-react";

export default function Bomb({ src }: { src?: string }) {
  return (
    <div className="w-24 h-24 relative flex items-center justify-center text-primary">
      <BombIcon size={96} />
      <div className="absolute rounded-full overflow-hidden w-16 h-16 bottom-3 left-3 flex items-center justify-center">
        {src ? (
          <img src={src} className="w-full h-full object-cover rotate-45" />
        ) : (
          <div className="text-3xl font-bold">?</div>
        )}
      </div>
    </div>
  );
}
