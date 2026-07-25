import { ProductForm } from "@/components/products/product-form";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">
          Add a new product for your WhatsApp shop.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}