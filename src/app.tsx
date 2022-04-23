import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MenuDrawer } from "./components/menu_drawer";
import { ImageCanvas } from "./components/image_canvas";
import { OpenMenuButton } from "./components/open_menu_button";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [currentImage, setCurrentImage] =
    React.useState<HTMLImageElement | null>(null);

  return (
    <>
      <ImageCanvas image={currentImage} />
      <OpenMenuButton setIsOpen={setIsMenuOpen} />
      <MenuDrawer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        setCurrentImage={setCurrentImage}
      />
    </>
  );
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
