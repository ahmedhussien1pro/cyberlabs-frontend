import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

interface CartPageProps {
  storageKey?: string;
  loginKey?: string;
  loginPath?: string;
  onCheckout?: (items: CartItem[], total: number) => void;
}

export default function CartPageLab({
  storageKey = 'lab_cart',
  loginKey = 'lab_logged_in',
  loginPath = '/temp-lab/login',
  onCheckout,
}: CartPageProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(storageKey);
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const navigate = useNavigate();

  const syncCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem(storageKey, JSON.stringify(updatedCart));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    syncCart(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    syncCart(updatedCart);
  };

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const grandTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem(loginKey) === 'true';

    if (!isLoggedIn) {
      navigate(loginPath);
      return;
    }

    if (cart.length === 0) return;

    if (onCheckout) {
      onCheckout(cart, grandTotal);
      return;
    }

    const currentBalance = Number(
      localStorage.getItem('lab_user_balance') || '0',
    );

    if (currentBalance >= grandTotal) {
      const newBalance = currentBalance - grandTotal;

      localStorage.setItem('lab_user_balance', newBalance.toString());

      alert('Order placed successfully!');

      setCart([]);
      localStorage.removeItem(storageKey);
    } else {
      alert('Your balance is not enough');
    }
  };

  return (
    <div className='min-h-screen bg-muted/40 p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Your Cart{' '}
          <span className='text-destructive text-lg'>
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h2>

        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle>Shopping Details</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            {cart.length === 0 && (
              <p className='text-muted-foreground text-center py-6'>
                Your cart is empty
              </p>
            )}

            {cart.map((item, index) => (
              <div
                key={item.id}
                className='grid grid-cols-5 items-center gap-4'>
                <div className='font-medium'>{item.title}</div>

                <div>${item.price.toFixed(2)}</div>

                <Input
                  type='number'
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(index, Number(e.target.value) || 1)
                  }
                  className='h-9'
                />

                <div className='font-semibold'>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => removeItem(index)}>
                  Delete
                </Button>

                <Separator className='col-span-5 mt-4' />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className='flex justify-between items-center'>
          <h4 className='text-xl font-semibold text-green-600'>
            Grand Total: ${grandTotal.toFixed(2)}
          </h4>

          <Button size='lg' onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
