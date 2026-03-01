import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
};

type Props = {
  product: Product;
  addToCart: (product: Product) => void;
};

export function ProductCard({ product, addToCart }: Props) {
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
  };

  const trimmedTitle = product.title.split(' ').slice(0, 3).join(' ');

  return (
    <Card className='group hover:shadow-xl transition'>
      <CardContent className='p-5 space-y-4'>
        <div className='h-48 flex items-center justify-center'>
          <img
            src={product.image}
            alt={product.title}
            className='h-full object-contain'
          />
        </div>

        <div className='space-y-1'>
          <h3 className='font-semibold text-lg'>{trimmedTitle}</h3>
          <p className='text-muted-foreground text-sm'>
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className='flex justify-between items-center'>
          <Button size='sm' onClick={handleAdd} disabled={added}>
            {added ? 'Added' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
