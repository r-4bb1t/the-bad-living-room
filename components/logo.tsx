import { Bomb as BombIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Button ghost className="font-bold gap-2">
        <BombIcon size={18} />
        의상한거실
      </Button>
    </Link>
  );
}
