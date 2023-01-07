import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { Outlet } from "react-router-dom";
import requestAgent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestAgent.Catalog.listProducts()
      .then(products => setProducts(products))
      .catch(error => console.log(error.response))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingComponent message="loading products..." />
  return (
    <>
      <ProductList products={products} />
    </>
  )
}