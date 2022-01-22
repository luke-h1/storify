import React, { useRef } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import useKeyboardContentInset from '../hooks/useKeyboardContentInset';

// eslint-disable-next-line react/display-name
const KeyboardAwareScrollView = React.forwardRef<
  ScrollView,
  ScrollViewProps & {
    children: React.ReactNode;
    scrollToEndOnKeyboardOpen?: boolean;
  }
>(({ scrollToEndOnKeyboardOpen, ...props }, ref) => {
  const localRef = useRef<ScrollView>(null);
  return (
    <ScrollView
      ref={r => {
        if (ref) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          ref.current = r;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localRef.current = r;
      }}
      contentInset={useKeyboardContentInset(() => {
        if (scrollToEndOnKeyboardOpen) {
          localRef.current?.scrollToEnd();
        }
      })}
      {...props}
    />
  );
});
export default KeyboardAwareScrollView;
