// App.jsx — Entry point of the application

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Dashboard />
    </main>
  );
}

export default App;