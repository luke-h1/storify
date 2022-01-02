import { Cart, useUpdateCartQuantityMutation } from '../generated/graphql';

interface Props {
  id: number;
  cart: Cart;
}

const CartItem = ({ id, cart }: Props) => {
  const [, updateCartQuantity] = useUpdateCartQuantityMutation();

  return (
    <div className="flex justify-between items-left p-3" key={id}>
      <div className="flex gap-2">
        <img
          className="h-28 rounded transform hover:scale-105 transition"
          src={cart.product.image}
          alt={cart.product.name}
        />
        <div className="flex flex-col justify-between">
          <p className="font-bold text-lg">{cart.product.name}</p>
          <p className="text-gray-900 font-semibold">£{cart.product.price}</p>
          <p className="text-gray-500 mb-5">
            Quantity: <strong>{cart.quantity}</strong>
          </p>
          <div className="flex flex-row align-left ml-2 mb-5">
            <button
              type="button"
              className="rounded-full h-8 w-8  text-2xl border cursor-buttonointer transform hover:scale-125 transition mr-2 ml-2"
              onClick={async () => {
                await updateCartQuantity({
                  id: cart.id,
                  quantity: cart.quantity - 1,
                });
              }}
            >
              -
            </button>

            <button
              type="button"
              className="rounded-full h-8 w-8 text-2xl border cursor-pointer transform hover:scale-125 transition"
            >
              +
            </button>
          </div>
          <button
            className="btn btn-red"
            type="button"
            onClick={() => {
              console.log('hi');
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <p className="text-lg font-semibold">
        Total: £{cart.product.price * cart.quantity}
      </p>
    </div>
  );
};
export default CartItem;
