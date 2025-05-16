import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import './styles/fonts.css';
import Test from './components/Test';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Test />
    </ThemeProvider>
  );
}

export default App;
