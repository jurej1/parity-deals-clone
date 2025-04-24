"use client";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productCustomizationSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Banner } from "../../../../components/Banner";

export function ProductCustomizationForm({
  customization,
  canCustomizeBanner,
  canRemoveBranding,
}: {
  customization: {
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
    classPrefix: string | null;
  };
  canCustomizeBanner: boolean;
  canRemoveBranding: boolean;
}) {
  const form = useForm<z.infer<typeof productCustomizationSchema>>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof productCustomizationSchema>) {
    console.log(values);
  }

  const formValues = form.watch();

  return (
    <>
      <Banner
        canRemoveBranding={canRemoveBranding}
        message={formValues.locationMessage}
        mappings={{
          coupon: "50%",
          discount: "HALF-OFF",
          country: "INDIA",
        }}
        customization={formValues}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      PPP Discount Message
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={!canCustomizeBanner}
                        {...field}
                        className="min-h-20 resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      {"Data Parameters: {country}, {coupon}, {discount}"}
                    </FormDescription>
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <Input disabled={!canCustomizeBanner} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text color
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Font size
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSticky"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sticky?</FormLabel>
                    <FormControl>
                      <Switch
                        className="block"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerContainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner container
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      HTML container selector where you want to place the
                      banner. Ex: #container, .container, body
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSS Prefix</FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      An optional prefix added to all CSS classes to avoid
                      conflicts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {canCustomizeBanner && (
            <div className="self-end">
              <Button disabled={form.formState.isSubmitting}>Save</Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
