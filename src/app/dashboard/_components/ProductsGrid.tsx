import { ProductCard } from "./ProductCard";

export function ProductsGrid({
  products,
}: {
  products: {
    name: string;
    url: string;
    description?: string | null;
    id: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
