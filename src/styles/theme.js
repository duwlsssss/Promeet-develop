import mediaQuery from './mediaQuery';

export const theme = {
  color: {
    main: '#40B59F',
    point1: '#164B4C',
    point2: '#497E64',
    disabled: '#949494',
    white: '#ffffff',
    text: {
      blue: '#002055',
      black: '#555555',
      grey: '#848A94',
    },
  },
  ...mediaQuery,
};
