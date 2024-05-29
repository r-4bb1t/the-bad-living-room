import { Button } from "@r-4bb1t/rabbit-ui";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Button ghost className="font-bold">
        의상한거실
      </Button>
    </Link>
  );
}
