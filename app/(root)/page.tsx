import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals"/>
    </>
  );
}
