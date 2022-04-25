import { ImageContext, Shader } from "./gl";
import { Matrix4 } from "three";

export type ImageCanvasProps = {
  images: ImageContext[];
  currentShader: Shader;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  imageDatas: ImageContext[];
  setImageDatas: (val: ImageContext[]) => void;
};

export type OpenDrawerButtonProps = {
  setIsOpen: (val: boolean) => void;
  left?: number;
  top?: number;
};

export type LoadFileButtonProps = {
  text: string;
  accept: string;
  onChange?: (elem: HTMLInputElement | null) => void;
};

export type ScaleSliderProps = {
  mvpMat: Matrix4 | null;
};

export type SettingDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  imageDatas: ImageContext[];
  setImageDatas: (val: ImageContext[]) => void;
  currentShader: Shader;
  setCurrentShader: (val: Shader) => void;
};
