import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ImageProperty, ShaderProperty } from "../io/types/io";
import { MenuDrawer } from "./components/menu_drawer";
import { ImageCanvas } from "./components/image_canvas";
import { OpenDrawerButton } from "./components/open_menu_button";
import { SettingDrawer } from "./components/setting_drawer";
import { CanvasWindow } from "./types/window";
import { DEFAULT_SHADER_PROPERTIES } from "./constants";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(false);
  const refCanvas = React.useRef<HTMLCanvasElement>(null);
  const refImages = React.useRef<ImageProperty[]>([]);
  const refShaderStems = React.useRef<ShaderProperty[]>(
    DEFAULT_SHADER_PROPERTIES
  );
  const refWidgets = React.useRef<Widget[]>([]);
  const refCanvasWindow = React.useRef<CanvasWindow>({
    onFocus: { row: 0, col: 0 },
    nrows: 1,
    ncols: 1,
    rowSizes: [1.0],
    colSizes: [1.0],
    images: [],
    widgets: [],
  });

  return (
    <>
      <OpenDrawerButton setIsOpen={setIsMenuOpen} />
      <OpenDrawerButton
        setIsOpen={setIsSettingOpen}
        left={window.innerWidth - 100}
        top={0}
      />
      <ImageCanvas
        refCanvas={refCanvas}
        canvasWindow={refCanvasWindow.current}
      />
      <MenuDrawer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        gl={refCanvas.current?.getContext("webgl2")}
        images={refImages.current}
        widgets={refWidgets.current}
      />
      <SettingDrawer
        isOpen={isSettingOpen}
        setIsOpen={setIsSettingOpen}
        gl={refCanvas.current?.getContext("webgl2")}
        images={refImages.current}
        shaderStem={refShaderStems.current}
        widgets={refWidgets.current}
        canvasWindow={refCanvasWindow.current}
      />
      {
        // <ScaleSlider />
      }
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
