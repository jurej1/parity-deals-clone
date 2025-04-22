"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/server/actions/products";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteProductAlertDialogContent({ id }: { id: string }) {
  // allows me to run server code
  const [isDeletePending, startDeleteTransition] = useTransition();
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeletePending}
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProduct(id);
              if (data.mesasge) {
                toast(data.error ? "Error" : "Success", {
                  description: data.message,
                });
              }
            });
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
