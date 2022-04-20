import * as React from "react";
import * as ReactDOM from "react-dom/client";

const App = () => {
  return <h1>"Hello from React"</h1>;
};

const container = document.getElementById("root");
if (container != null) {
  const root = ReactDOM.createRoot(container as Element);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
