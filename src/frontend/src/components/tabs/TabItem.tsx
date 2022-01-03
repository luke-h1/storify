import { useTabs } from '../../context/TabsContext';

interface Props {
  index: number;
  children: React.ReactNode;
}

const TabItem = ({ index, children }: Props) => {
  const { currentIndex } = useTabs();

  return currentIndex === index ? children : null;
};
export default TabItem;
