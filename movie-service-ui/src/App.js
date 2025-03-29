import { ToastContainer } from "react-toastify";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./Login/AuthProvider";

function App() {
   return (
      <AuthProvider>
         <ToastContainer
                style={{ zIndex: '10000' }}
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
         <div className="App">
            <header className="App-header">
               <AppRoutes />
            </header>
         </div>
      </AuthProvider>
   );
}

export default App;
