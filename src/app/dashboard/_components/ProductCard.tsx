import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { AddToSiteProductModalContent } from "./AddToSiteProductModalContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteProductAlertDialogContent } from "./DeleteproductAlertDialogContent";

export function ProductCard({
  product,
}: {
  product: {
    name: string;
    url: string;
    description?: string | null;
    id: string;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              {product.name}
            </Link>
          </CardTitle>

          {/* Dialog needs a trigger and content */}
          <Dialog>
            {/* Needs trigger and content */}
            <AlertDialog>
              {/* Dropdown menu needs trigger and content */}
              <DropdownMenu>
                {/* Trigger to open the Dropdownmenu */}
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 p-0">
                    <div className="sr-only">Action Menu</div>
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {/* Trigger for the Dialog */}
                  <DialogTrigger>
                    <DropdownMenuItem>Add To Site</DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DeleteProductAlertDialogContent id={product.id} />
            </AlertDialog>
            <AddToSiteProductModalContent id={product.id} />
          </Dialog>
        </div>
        <CardDescription>{product.url}</CardDescription>
        {product.description && (
          <CardContent>{product.description}</CardContent>
        )}
      </CardHeader>
    </Card>
  );
}
