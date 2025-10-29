import { Dashboard } from './pages/Dashboard';
import './App.less';

function App() {
  return (
    <div className="App">
      <header>
        <div className='logoContainer'>
          <img src='./public/black-orange-white-logo-transparent.png' alt='Jeremy McCulley Freelance Logo'/>
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
      <footer>
        <small>Data sourced from the GitHub Search API.</small>
      </footer>
    </div>
  );
}

export default App;