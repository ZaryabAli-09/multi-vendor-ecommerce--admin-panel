// importing fonts
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/700.css"; // Bold
import "@fontsource/playfair-display/700.css"; // Bold for headings
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
);
