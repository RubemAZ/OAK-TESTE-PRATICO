import React from 'react';

type NavbarProps = {
    onAddProduct: () => void;
    onRefresh: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ onAddProduct, onRefresh }) => {
    return (
        <nav className="bg-dark-green text-white mx-3 mt-9 py-4 px-9 flex justify-between items-center">
            <h1 className="text-xl font-bold">Gerenciador de produtos</h1>
            <div className="space-x-4">
                <button
                    onClick={onAddProduct}
                    className="bg-mid-green hover:bg-dark-green-button text-white py-2 px-4 rounded"
                >
                    Adicionar Produto
                </button>
                <button
                    onClick={onRefresh}
                    className="bg-mid-green hover:bg-dark-green-button text-white py-2 px-4 rounded"
                >
                    Atualizar Lista de Produtos
                </button>
            </div>
        </nav>
    );
};