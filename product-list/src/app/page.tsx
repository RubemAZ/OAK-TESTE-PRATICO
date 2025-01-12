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
    price: string;
    available: boolean;
};

const MySwal = withReactContent(Swal);

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await fetchProducts();
            // @ts-ignore
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Erro ao carregar os produtos:", error);
            await MySwal.fire("Erro", "Não foi possível carregar os produtos.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAddProduct = async () => {
        const { value: formValues } = await MySwal.fire({
            title: "Adicionar Produto",
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Nome do Produto">
                <input id="swal-input2" class="swal2-input" placeholder="Descrição">
                <input id="swal-input3" type="number" class="swal2-input" placeholder="Preço R$">
                <p>Disponível para venda:</p>
                <select id="swal-input4" class="swal2-input">
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = (document.getElementById("swal-input1") as HTMLInputElement).value;
                const description = (document.getElementById("swal-input2") as HTMLInputElement).value;
                const price = (document.getElementById("swal-input3") as HTMLInputElement).value;
                const available = (document.getElementById("swal-input4") as HTMLSelectElement).value === "true";

                if (!name || !description || !price) {
                    Swal.showValidationMessage("Preencha todos os campos corretamente.");
                    return null;
                }

                return { name, description, price, available };
            },
        });

        if (formValues) {
            try {
                const newProduct = await addProduct(formValues);
                setProducts((prev) => [...prev, newProduct]);
                await MySwal.fire("Sucesso", "Produto adicionado com sucesso.", "success");
            } catch (error) {
                console.error("Erro ao adicionar o produto:", error);
                await MySwal.fire("Erro", "Não foi possível adicionar o produto.", "error");
            }
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((product) => product.id !== id));
            await MySwal.fire("Sucesso", "Produto excluído com sucesso.", "success");
        } catch (error) {
            console.error("Erro ao excluir o produto:", error);
            await MySwal.fire("Erro", "Não foi possível excluir o produto.", "error");
        }
    };

    const handleEditProduct = async (product: Product) => {
        const { value: formValues } = await MySwal.fire({
            title: "Editar Produto",
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Nome do Produto" value="${product.name}">
                <input id="swal-input2" class="swal2-input" placeholder="Descrição" value="${product.description}">
                <input id="swal-input3" type="number" class="swal2-input" placeholder="Preço R$" value="${product.price}">
                <p>Disponível para venda:</p>
                <select id="swal-input4" class="swal2-input">
                    <option value="true" ${product.available ? "selected" : ""}>Sim</option>
                    <option value="false" ${!product.available ? "selected" : ""}>Não</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = (document.getElementById("swal-input1") as HTMLInputElement).value
                const description = (document.getElementById("swal-input2") as HTMLInputElement).value
                const price = (document.getElementById("swal-input3") as HTMLInputElement).value
                const available = (document.getElementById("swal-input4") as HTMLSelectElement).value === "true"

                if (!name || !description || !price) {
                    Swal.showValidationMessage("Preencha todos os campos corretamente.");
                    return null;
                }

                return { id: product.id, name, description, price, available }
            }
        })

        if (formValues) {
            try {
                const updatedProduct = await updateProduct(formValues)
                setProducts((prev) => prev.map((p) => (p.id === product.id ? updatedProduct : p)))
                await MySwal.fire("Sucesso", "Produto atualizado com sucesso.", "success")
            } catch (error) {
                console.error("Erro ao atualizar o produto:", error)
                await MySwal.fire("Erro", "Não foi possível atualizar o produto.", "error")
            }
        }
    };

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <main className="shadow mt-16 p-3 mx-6">
            <Navbar onAddProduct={handleAddProduct} />
            <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />
        </main>
    );
};

export default Home