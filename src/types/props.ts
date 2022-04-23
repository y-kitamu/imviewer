export type ImageCanvasProps = {
  image: HTMLImageElement | null;
};

export type MenuDrawerProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  setCurrentImage: (val: HTMLImageElement) => void;
};

export type OpenMenuButtonProps = {
  setIsOpen: (val: boolean) => void;
};

export type LoadFileButtonProps = {
  text: string;
  accept: string;
  onChange?: (elem: HTMLInputElement | null) => void;
};
