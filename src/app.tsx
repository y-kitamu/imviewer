import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ImageContext, Shader } from "./types/gl";
import { MenuDrawer } from "./components/menu_drawer";
import { ImageCanvas } from "./components/image_canvas";
import { OpenDrawerButton } from "./components/open_menu_button";
import { ScaleSlider } from "./components/scale_slider";
import { SimpleImageShader } from "./gl/simple_image_shader";
import { SettingDrawer } from "./components/setting_drawer";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(false);
  const [imageDatas, setImageDatas] = React.useState<ImageContext[]>([]);
  const [currentShader, setCurrentShader] =
    React.useState<Shader>(SimpleImageShader);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isMouseDown = React.useRef<boolean>(false);

  const handleWheel = (e: React.WheelEvent) => {
    imageDatas.map((data) => {
      if (!data.isDrawing) {
        return;
      }
      const { mvpMat } = data;
      let scale = 1.0;
      switch (e.deltaMode) {
        case 0x00:
          scale = 0.003;
          break;
        case 0x01:
          scale = 0.01;
          break;
        case 0x02:
          scale = 0.1;
          break;
        default:
          console.log(`Invalid deltaMode value : ${e.deltaMode}`);
      }
      const delta = Math.max(1.0 - scale * e.deltaY, 0.0);
      mvpMat.elements[0] *= delta;
      mvpMat.elements[5] *= delta;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    isMouseDown.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) {
      return;
    }
    imageDatas.map((data) => {
      if (!data.isDrawing) {
        return;
      }
      const { mvpMat } = data;
      const dx = (e.movementX / window.innerWidth) * 2.0;
      const dy = (e.movementY / window.innerHeight) * 2.0;
      mvpMat.elements[12] += dx;
      mvpMat.elements[13] -= dy;
    });
  };

  return (
    <div
      ref={rootRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <OpenDrawerButton setIsOpen={setIsMenuOpen} />
      <OpenDrawerButton
        setIsOpen={setIsSettingOpen}
        left={window.innerWidth - 100}
        top={0}
      />
      <ImageCanvas images={imageDatas} currentShader={currentShader} />
      <MenuDrawer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        imageDatas={imageDatas}
        setImageDatas={setImageDatas}
      />
      <SettingDrawer
        isOpen={isSettingOpen}
        setIsOpen={setIsSettingOpen}
        imageDatas={imageDatas}
        setImageDatas={setImageDatas}
        currentShader={currentShader}
        setCurrentShader={setCurrentShader}
      />
      <ScaleSlider mvpMat={imageDatas.find((data) => data.isDrawing)?.mvpMat} />
    </div>
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
