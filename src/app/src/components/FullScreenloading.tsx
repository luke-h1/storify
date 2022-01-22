import Center from './Center';
import Loader from './Loader';
import ScreenWrapper from './ScreenWrapper';

const FullScreenLoading = () => {
  return (
    <ScreenWrapper>
      <Center>
        <Loader size="large" />
      </Center>
    </ScreenWrapper>
  );
};
export default FullScreenLoading;
