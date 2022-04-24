import { ImageContext } from "./gl";
import { Matrix4 } from "three";

export type ImageCanvasProps = {
  image: ImageContext | null;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  setCurrentImage: (val: ImageContext) => void;
};

export type OpenMenuButtonProps = {
  setIsOpen: (val: boolean) => void;
};

export type LoadFileButtonProps = {
  text: string;
  accept: string;
  onChange?: (elem: HTMLInputElement | null) => void;
};

export type ScaleSliderProps = {
  mvpMat: Matrix4 | null;
};
