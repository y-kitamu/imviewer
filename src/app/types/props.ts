import * as React from "react";
import { JsonSchema, ShaderProperty } from "../../io/types/io";
import { CanvasWindow } from "./window";

export type ImageCanvasProps = {
  refCanvas: React.MutableRefObject<HTMLCanvasElement | null>;
  canvasWindow: CanvasWindow;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  gl: WebGL2RenderingContext | null | undefined;
  images: { [key: string]: HTMLImageElement }; // key : image file basename, value: image element
  jsons: { [key: string]: JsonSchema[] }; // key: file basename, value : json schemas in the file
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
  images: { [key: string]: HTMLImageElement };
  shaderStem: ShaderProperty[];
  jsons: { [key: string]: JsonSchema[] };
  canvasWindow: CanvasWindow;
};

export type WindowOperationButtonsProps = {
  canvasWindow: CanvasWindow;
};
