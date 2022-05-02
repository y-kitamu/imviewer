import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MenuDrawer } from "./components/menu_drawer";
import { ImageCanvas } from "./components/image_canvas";
import { OpenDrawerButton } from "./components/open_menu_button";
import { ScaleSlider } from "./components/scale_slider";
import { SettingDrawer } from "./components/setting_drawer";
import { CanvasWindow } from "./types/window";
import { DEFAULT_SHADER_STEMS } from "../gl/constants";
import { Parts } from "./types/json";

const defaultCanvasWindow: CanvasWindow = {
  onFocus: { row: 1, col: 1 },
  nrows: 1,
  ncols: 1,
  rowSizes: [1.0],
  colSizes: [1.0],
  widgets: [[[]]],
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(false);
  const refGL = React.useRef<WebGL2RenderingContext>();
  const refParts = React.useRef<Parts>({});
  const refShaderStems = React.useRef<string[]>(DEFAULT_SHADER_STEMS);
  const refCanvasWindow = React.useRef<CanvasWindow>(defaultCanvasWindow);

  return (
    <>
      <OpenDrawerButton setIsOpen={setIsMenuOpen} />
      <OpenDrawerButton
        setIsOpen={setIsSettingOpen}
        left={window.innerWidth - 100}
        top={0}
      />
      <ImageCanvas refCanvasWindow={refCanvasWindow} />
      <MenuDrawer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        refCanvasWindow={refCanvasWindow}
      />
      <SettingDrawer
        isOpen={isSettingOpen}
        setIsOpen={setIsSettingOpen}
        refCanvasWindow={refCanvasWindow}
      />
      <ScaleSlider />
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
