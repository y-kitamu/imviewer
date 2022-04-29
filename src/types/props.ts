import * as React from "react";
import { WidgetsBase } from "./widgets";
import { CanvasWindow } from "./window";

export type ImageCanvasProps = {
  refCanvasWindow: React.MutableRefObject<CanvasWindow>;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  widgets: React.MutableRefObject<WidgetsBase[]>;
  refCanvasWindow: React.MutableRefObject<CanvasWindow>;
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
  widgets: React.MutableRefObject<WidgetsBase[]>;
  refCanvasWindow: React.MutableRefObject<CanvasWindow>;
};

export type WindowOperationButtonsProps = {
  refCanvasWindow: React.MutableRefObject<CanvasWindow>;
};
