import { buildSchema } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { CartResolver } from '../resolvers/cart';
import { ImageResolver } from '../resolvers/image';
import { OrderResolver } from '../resolvers/order';
import { OrderDetailsResolver } from '../resolvers/orderDetails';
import { PaymentResolver } from '../resolvers/payment';
import { ProductResolver } from '../resolvers/product';
import { UserResolver } from '../resolvers/user';
import { WishlistResolver } from '../resolvers/wishlist';

const createSchema = async () =>
  buildSchema({
    resolvers: [
      UserResolver,
      ImageResolver,
      ProductResolver,
      OrderResolver,
      OrderDetailsResolver,
      PaymentResolver,
      CartResolver,
      WishlistResolver,
    ],
    validate: false,
    authChecker: isAuth,
  });
export default createSchema;
