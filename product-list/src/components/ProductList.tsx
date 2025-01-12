import React from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    value: number;
    available: boolean;
};

type ProductListProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
};

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
    return (
        <div className="mt-3 p-4">
            <h1 className="text-center text-xl font-bold m-3">Lista de Produtos</h1>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">Nome do Produto</th>
                    <th className="border border-gray-200 px-4 py-2">Preço R$</th>
                    <th className="border border-gray-200 px-4 py-2">Ações</th>
                </tr>
                </thead>
                <tbody>
                {products
                    .sort((a, b) => a.value - b.value)
                    .map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-200 px-4 py-2">${product.value.toFixed(2)}</td>
                            <td className="border border-gray-200 px-4 py-2 space-x-2">
                                <div className="text-center">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className=" bg-mid-green hover:bg-dark-green-button text-white py-2 px-4 rounded mx-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white  py-2 px-4 rounded mx-2"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
