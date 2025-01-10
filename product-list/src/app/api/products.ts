import { NextApiRequest, NextApiResponse } from 'next';

type Product = {
    id: number;
    name: string;
    description: string;
    value: number;
    available: boolean;
};

let products: Product[] = [];

/**
 * Validates the product object
 * @param product - The product to validate
 * @returns An object with `isValid` and `message`
 */
function validateProduct(product: Partial<Product>): { isValid: boolean; message: string } {
    if (!product.name || typeof product.name !== 'string') {
        return { isValid: false, message: 'Name is required and must be a string.' };
    }
    if (!product.description || typeof product.description !== 'string') {
        return { isValid: false, message: 'Description is required and must be a string.' };
    }
    if (product.value === undefined || typeof product.value !== 'number' || product.value < 0) {
        return { isValid: false, message: 'Value is required, must be a number, and cannot be negative.' };
    }
    if (product.available === undefined || typeof product.available !== 'boolean') {
        return { isValid: false, message: 'Available is required and must be a boolean.' };
    }
    return { isValid: true, message: '' };
}

/**
 * Fetch all products, sorted by value
 */
export function fetchProducts(): Product[] {
    return products.sort((a, b) => a.value - b.value);
}

/**
 * Add a new product
 * @param product - The product to add
 */
export function addProduct(product: Partial<Product>): Product | { message: string } {
    const { isValid, message } = validateProduct(product);
    if (!isValid) {
        return { message };
    }

    const newProduct: Product = {
        ...product,
        id: products.length ? products[products.length - 1].id + 1 : 1,
    } as Product;
    products.push(newProduct);
    return newProduct;
}

/**
 * Update an existing product
 * @param updatedProduct - The product data to update
 */
export function updateProduct(updatedProduct: Partial<Product>): Product | { message: string } {
    const { isValid, message } = validateProduct(updatedProduct);
    if (!isValid || !updatedProduct.id) {
        return { message: isValid ? 'Product ID is required.' : message };
    }

    let productFound = false;
    products = products.map((product) => {
        if (product.id === updatedProduct.id) {
            productFound = true;
            return { ...product, ...updatedProduct };
        }
        return product;
    });

    if (!productFound) {
        return { message: 'Product not found' };
    }

    return updatedProduct as Product;
}

/**
 * Delete a product by ID
 * @param id - The ID of the product to delete
 */
export function deleteProduct(id: number): { message: string } {
    const initialLength = products.length;
    products = products.filter((product) => product.id !== id);

    if (products.length === initialLength) {
        return { message: 'Product not found' };
    }

    return { message: 'Product deleted successfully' };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            res.status(200).json(fetchProducts());
            break;
        }
        case 'POST': {
            const product = addProduct(req.body);
            if ('message' in product) {
                res.status(400).json(product);
            } else {
                res.status(201).json(product);
            }
            break;
        }
        case 'PUT': {
            const updatedProduct = updateProduct(req.body);
            if ('message' in updatedProduct) {
                res.status(400).json(updatedProduct);
            } else {
                res.status(200).json(updatedProduct);
            }
            break;
        }
        case 'DELETE': {
            const id = parseInt(req.query.id as string, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }
            const result = deleteProduct(id);
            res.status(result.message === 'Product deleted successfully' ? 200 : 404).json(result);
            break;
        }
        default: {
            res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}