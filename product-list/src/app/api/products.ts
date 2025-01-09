import { NextApiRequest, NextApiResponse } from 'next';

let products = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(products.sort((a, b) => a.value - b.value));
    } else if (req.method === 'POST') {
        const product = req.body;
        products.push(product);
        res.status(201).json({ message: 'Product added successfully' });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        products = products.filter(product => product.id !== id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } else if (req.method === 'PUT') {
        const updatedProduct = req.body;
        products = products.map(product => product.id === updatedProduct.id ? updatedProduct : product);
        res.status(200).json({ message: 'Product updated successfully' });
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}