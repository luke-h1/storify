/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useTabs } from '../../context/TabsContext';

interface Props {
  titles: string[];
}

const TabMenu = ({ titles }: Props) => {
  const { currentIndex, setCurrentIndex } = useTabs();
  return (
    <nav className="mb-4">
      <ul className="flex justify-around gap-2">
        {titles.map((title, i) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li
            className={`w-full text-center py-2 rounded hover:shadow-lg bg-gray-100 cursor-pointer capitalize transition duration-500 ease-in-out ${
              currentIndex === i ? 'bg-blue-500 text-white font-semibold' : ''
            }`}
            key={title}
            onClick={() => setCurrentIndex(i)}
          >
            {title}
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default TabMenu;
