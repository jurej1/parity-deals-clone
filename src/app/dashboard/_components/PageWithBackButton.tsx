import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { CaretLeftIcon } from "@radix-ui/react-icons";
export default function PageWithBackButton({
  backButtonHref,
  pageTitle,
  children,
}: {
  backButtonHref: string;
  pageTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid [grid-template-columns:auto_1fr] gap-x-4 gap-y-8 items-center">
      <Button asChild size="icon" className="rounded-full" variant="outline">
        <Link href={backButtonHref}>
          <CaretLeftIcon className="size-8" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
}

// [grid-template-columns:auto_1fr] (left column as small as possuble, right column as large as possible)
