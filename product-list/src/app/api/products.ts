import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    available: boolean;
};

let products: Product[] = [];

const productSchema = z.object({
    id: z.number().optional(),
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    available: z.boolean(),
});

/** Fetch all products, sorted by price */
function fetchProducts(): Product[] {
    return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
}

/** Add a new product */
function addProduct(product: Partial<Product>): Product | { message: string } {
    const validation = productSchema.safeParse(product);
    if (!validation.success) {
        return { message: validation.error.errors[0]?.message || 'Invalid input' };
    }

    const newProduct: Product = {
        ...validation.data,
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };

    products.push(newProduct);
    return newProduct;
}

/** Update an existing product */
function updateProduct(updatedProduct: Partial<Product>): Product | { message: string } {
    const validation = productSchema.safeParse(updatedProduct);
    if (!validation.success || !updatedProduct.id) {
        return { message: validation.success ? 'Product ID is required.' : validation.error.errors[0]?.message };
    }

    const productIndex = products.findIndex((p) => p.id === updatedProduct.id);
    if (productIndex === -1) {
        return { message: 'Product not found' };
    }

    products[productIndex] = { ...products[productIndex], ...validation.data };
    return products[productIndex];
}

/** Delete a product by ID */
function deleteProduct(id: number): { message: string } {
    const initialLength = products.length;
    products = products.filter((product) => product.id !== id);
    return initialLength === products.length
        ? { message: 'Product not found' }
        : { message: 'Product deleted successfully' };
}

/** API Handler */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const allProducts = fetchProducts();
                res.status(200).json(allProducts);
                break;
            }
            case 'POST': {
                const addedProduct = addProduct(req.body);
                if ('message' in addedProduct) {
                    res.status(400).json(addedProduct);
                } else {
                    res.status(201).json(addedProduct);
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
                const deleteResult = deleteProduct(id);
                res.status(deleteResult.message === 'Product deleted successfully' ? 200 : 404).json(deleteResult);
                break;
            }
            default: {
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
            }
        }
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/** Export utility functions for testing or reuse */
export {
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};