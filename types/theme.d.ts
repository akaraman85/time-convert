import { Theme as BaseTheme } from '../styles/theme';

declare module '@emotion/react' {
  export interface Theme extends BaseTheme {
    colors: {
      primary: string;
      backgroundHover: string;
    };
  }
}
