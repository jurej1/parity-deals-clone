"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { CopyIcon } from "@radix-ui/react-icons";
import { CopyCheckIcon, CopyXIcon } from "lucide-react";
import { useState } from "react";
type CopyState = "idle" | "copied" | "error";

export function AddToSiteProductModalContent({ id }: { id: string }) {
  // URL that points to a endopoint, which is then going to download some JS for them
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const Icon = getCopyIcon(copyState);

  // Creating Dialog Content & Description what is this going to do
  return (
    // takes as much space as the content
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seein PPP Discounts!
        </DialogDescription>
      </DialogHeader>

      <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState("copied");
                setTimeout(() => setCopyState("idle"), 2000);
              })
              .catch(() => {
                setCopyState("error");
                setTimeout(() => setCopyState("idle"), 2000);
              });
          }}
        >
          {<Icon className="size-4 mr-2" />}
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return CopyIcon;
    case "copied":
      return CopyCheckIcon;
    case "error":
      return CopyXIcon;
  }
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copy Code";
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
  }
}
