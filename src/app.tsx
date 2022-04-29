import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MenuDrawer } from "./components/menu_drawer";
import { ImageCanvas } from "./components/image_canvas";
import { OpenDrawerButton } from "./components/open_menu_button";
import { ScaleSlider } from "./components/scale_slider";
import { SettingDrawer } from "./components/setting_drawer";
import { CanvasWindow } from "./types/window";
import { WidgetType, WidgetsBase } from "./types/widgets";
import { Shader } from "./types/shader";
import { SimpleImageShader } from "./gl/simple_image_shader";

const defaultCanvasWindow: CanvasWindow = {
  onFocus: { row: 1, col: 1 },
  nrows: 1,
  ncols: 1,
  rowSizes: [1.0],
  colSizes: [1.0],
  drawables: [[[]]],
};

const defaultShaders: { [widgetType in WidgetType]: Shader } = {
  image: SimpleImageShader,
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(false);
  const refWidgets = React.useRef<WidgetsBase[]>([]);
  const refCanvasWindow = React.useRef<CanvasWindow>(defaultCanvasWindow);
  const refCurrentShaders = React.useRef<{
    [widgetType in WidgetType]: Shader;
  }>();

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
        widgets={refWidgets}
        refCanvasWindow={refCanvasWindow}
      />
      <SettingDrawer
        isOpen={isSettingOpen}
        setIsOpen={setIsSettingOpen}
        widgets={refWidgets}
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
