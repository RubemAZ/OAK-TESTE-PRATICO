"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Navbar } from "@/components/Navbar";
import { ProductList } from "@/components/ProductList";
import {
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct,
} from "./api/products";

type Product = {
    id: number;
    name: string;
    description: string;
    value: number;
    available: boolean;
};

const MySwal = withReactContent(Swal);

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await fetchProducts(); // Certifique-se de que esta função é assíncrona
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAddProduct = async () => {
        const { value: formValues } = await MySwal.fire({
            title: "Add Product",
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Description">' +
                '<input id="swal-input3" type="number" class="swal2-input" placeholder="Value">' +
                '<select id="swal-input4" class="swal2-input"><option value="true">Yes</option><option value="false">No</option></select>',
            focusConfirm: false,
            preConfirm: () => {
                const name = (document.getElementById("swal-input1") as HTMLInputElement)
                    .value;
                const description = (document.getElementById(
                    "swal-input2"
                ) as HTMLInputElement).value;
                const value = parseFloat(
                    (document.getElementById("swal-input3") as HTMLInputElement).value
                );
                const available =
                    (document.getElementById("swal-input4") as HTMLSelectElement).value ===
                    "true";

                if (!name || !description || isNaN(value)) {
                    Swal.showValidationMessage("Please fill out all fields correctly.");
                    return null;
                }

                return { name, description, value, available };
            },
        });

        if (formValues) {
            try {
                const newProduct = await addProduct(formValues); // Aguarde a resposta da API
                setProducts((prev) => [...prev, newProduct]);
            } catch (error) {
                console.error("Error adding product:", error);
            }
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id); // Aguarde a resposta da API
            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleEditProduct = async (product: Product) => {
        const { value: formValues } = await MySwal.fire({
            title: "Edit Product",
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${product.name}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Description" value="${product.description}">` +
                `<input id="swal-input3" type="number" class="swal2-input" placeholder="Value" value="${product.value}">` +
                `<select id="swal-input4" class="swal2-input">` +
                `<option value="true" ${product.available ? "selected" : ""}>Yes</option>` +
                `<option value="false" ${!product.available ? "selected" : ""}>No</option>` +
                "</select>",
            focusConfirm: false,
            preConfirm: () => {
                const name = (document.getElementById("swal-input1") as HTMLInputElement)
                    .value;
                const description = (document.getElementById(
                    "swal-input2"
                ) as HTMLInputElement).value;
                const value = parseFloat(
                    (document.getElementById("swal-input3") as HTMLInputElement).value
                );
                const available =
                    (document.getElementById("swal-input4") as HTMLSelectElement).value ===
                    "true";

                if (!name || !description || isNaN(value)) {
                    Swal.showValidationMessage("Please fill out all fields correctly.");
                    return null;
                }

                return { id: product.id, name, description, value, available };
            },
        });

        if (formValues) {
            try {
                const updatedProduct = await updateProduct(formValues); // Aguarde a resposta da API
                setProducts((prev) =>
                    prev.map((p) => (p.id === product.id ? updatedProduct : p))
                );
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar onAddProduct={handleAddProduct} onRefresh={loadProducts} />
            <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
};

export default Home;
