declare module 'react-native-markdown-display' {
  import * as React from 'react';
  import { TextStyle, TextProps } from 'react-native';

  export interface MarkdownProps {
    style?: { [key: string]: TextStyle };
    onLinkPress?: (url: string | undefined) => void;
    children?: React.ReactNode;
  }

  export default function Markdown(props: MarkdownProps & TextProps): JSX.Element;
}
