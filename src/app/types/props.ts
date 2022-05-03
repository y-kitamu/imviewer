import * as React from "react";
import { CanvasWindow, ImageProperty, ShaderProperty, Widget } from "./window";

export type ImageCanvasProps = {
  refCanvas: React.MutableRefObject<HTMLCanvasElement | null>;
  canvasWindow: CanvasWindow;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  gl: WebGL2RenderingContext | null | undefined;
  images: ImageProperty[];
  widgets: Widget[];
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

export type ScaleSliderProps = {};

export type SettingDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  gl: WebGL2RenderingContext | null | undefined;
  images: ImageProperty[];
  shaderStem: ShaderProperty[];
  widgets: Widget[];
  canvasWindow: CanvasWindow;
};

export type WindowOperationButtonsProps = {
  canvasWindow: CanvasWindow;
};
