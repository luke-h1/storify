import { buildSchema } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { CartResolver } from '../resolvers/Cart';
import { ImageResolver } from '../resolvers/Image';
import { OrderResolver } from '../resolvers/Order';
import { OrderDetailsResolver } from '../resolvers/OrderDetails';
import { PaymentResolver } from '../resolvers/Payment';
import { ProductResolver } from '../resolvers/Product';
import { ReviewResolver } from '../resolvers/Review';
import { UserResolver } from '../resolvers/User';

const createSchema = async () =>
  buildSchema({
    resolvers: [
      UserResolver,
      ImageResolver,
      ProductResolver,
      OrderResolver,
      OrderDetailsResolver,
      PaymentResolver,
      ReviewResolver,
      CartResolver,
    ],
    validate: false,
    authChecker: isAuth,
  });
export default createSchema;
