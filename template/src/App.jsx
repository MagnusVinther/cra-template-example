import './App.scss';

// Router
import { BrowserRouter } from 'react-router-dom';

// Komponenter
import { Header } from './components/partials/Header';
import { Main } from './components/partials/Main';
import { Footer } from './components/partials/Footer';
import { AppRouter } from './components/App/Router/Router';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Main>
          <AppRouter />
        </Main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;