import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  return (
    <>
      <ProductList data={sampleData.products} title="Newest Arrivals" limit={4} />
    </>
  );
}
