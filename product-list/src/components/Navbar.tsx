import React from 'react';

type NavbarProps = {
    onAddProduct: () => void;
    onRefresh: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ onAddProduct, onRefresh }) => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold">Product Management</h1>
            <div className="space-x-4">
                <button
                    onClick={onAddProduct}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                    Add Product
                </button>
                <button
                    onClick={onRefresh}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Refresh
                </button>
            </div>
        </nav>
    );
};