import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";

export default function ProductsPage() {
  type Product = {
    id: number;
    name: string;
    sku: string;
    uom: string;
    description?: string | null;
    initial_stock?: number;
    reorder_point?: number;
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error: any) {
        const status = (error?.response?.status as number | undefined);
        if (status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to fetch products:", error);
        }
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error: any) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    try {
      if (selectedProduct) {
        const response = await updateProduct(selectedProduct.id, data);
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id ? response.data : product
          )
        );
      } else {
        const response = await createProduct(data);
        setProducts([...products, response.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="mt-1 text-sm text-secondary-300">Create, manage, and track product inventory.</p>
        </div>
        <Button variant="primary" onClick={handleAddProduct}>Add product</Button>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Product Inventory</h3>
          <p className="mt-1 text-xs text-secondary-400">Manage all product SKUs and quantities across warehouses.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">UOM</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm text-secondary-100"><span className="font-medium">{product.name}</span></td>
                  <td className="px-6 py-4 text-sm font-mono text-secondary-300">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{product.uom}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{product.description ?? "-"}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEditProduct(product)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? "Edit Product" : "Add Product"}
      >
        <ProductForm product={selectedProduct} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
