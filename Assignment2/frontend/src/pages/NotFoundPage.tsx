import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    /* --- STYLE (DARK) --- */
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-center p-4">
      <div className="bg-gray-800 p-10 sm:p-16 rounded-xl shadow-lg flex flex-col items-center border border-gray-700">
        <AlertTriangle size={64} className="text-yellow-500" />
        <h1 className="text-8xl font-bold text-white mt-6">404</h1>
        <p className="text-2xl font-semibold text-gray-200 mt-4">Page Not Found</p>
        <p className="text-gray-400 mt-2">Sorry, we couldn't find the page you're looking for.</p>
        <Link 
          to="/" 
          /* --- STYLE (DARK) --- */
          className="mt-10 inline-flex items-center gap-2 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <ArrowLeft size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

