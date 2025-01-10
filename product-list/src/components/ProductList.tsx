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
        <div className="mt-16 p-4">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">Name</th>
                    <th className="border border-gray-200 px-4 py-2">Value</th>
                    <th className="border border-gray-200 px-4 py-2">Actions</th>
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
                                <button
                                    onClick={() => onEdit(product)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
