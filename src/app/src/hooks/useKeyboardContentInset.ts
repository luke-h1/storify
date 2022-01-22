import { useState, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardContentInset = (onKeyboardOpen?: () => void) => {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const ref = useRef(() => {});
  if (onKeyboardOpen) {
    ref.current = onKeyboardOpen;
  }
  useEffect(() => {
    const kbListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
      ref.current();
    });
    return () => {
      kbListener.remove();
    };
  }, []);
  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      hideListener.remove();
    };
  }, []);
  return { bottom: keyboardHeight };
};
export default useKeyboardContentInset;
