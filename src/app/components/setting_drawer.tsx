const React = require("react");
import { useEffect, useState } from "react";
import {
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { SettingDrawerProps } from "../types/props";
import { CanvasWindow, ImageProperty, ImageWidget } from "../types/window";
import { createDrawable, getSamplerNames, removeDrawable } from "../../gl/gl";
import { DEFAULT_SHADERS } from "../constants";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, shaderStem, widgets, canvasWindow } =
    props;

  if (gl == undefined || gl == null) {
    return <></>;
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={(_) => {
        setIsOpen(false);
      }}
    >
      <ImageSelectors gl={gl} images={images} canvasWindow={canvasWindow} />
    </Drawer>
  );
};

const ImageSelectors = (props: {
  gl: WebGL2RenderingContext;
  images: ImageProperty[];
  canvasWindow: CanvasWindow;
}) => {
  const { gl, images, canvasWindow } = props;

  const [focusedRow, setFocusedRow] = useState<number>(0);
  const [focusedCol, setFocusedCol] = useState<number>(0);

  const getSamplerKeys = () => {
    let textures = canvasWindow.images[focusedRow][focusedCol]?.textures;
    if (textures != undefined) {
      return Object.keys(textures);
    }
    return getSamplerNames(DEFAULT_SHADERS.image);
  };

  const [keys, setKeys] = useState<string[]>(getSamplerKeys());

  useEffect(() => {
    canvasWindow.onFocus = { row: focusedRow, col: focusedCol };
    setKeys(getSamplerKeys());
  }, [focusedRow, focusedCol]);

  const selectors = keys.map((key) => {
    const image = canvasWindow.images[focusedRow][focusedCol];
    return (
      <ImageSelector
        key={key}
        gl={gl}
        texKey={key}
        image={image}
        images={images}
      />
    );
  });

  return <>{selectors}</>;
};

const ImageSelector = (props: {
  gl: WebGL2RenderingContext;
  texKey: string;
  image: ImageWidget;
  images: ImageProperty[];
}) => {
  const { gl, texKey, image, images } = props;
  const [value, setValue] = useState<string | undefined>(
    image.textures[texKey]
  );

  console.log(`image = ${image}`);
  const handleChange = (event: SelectChangeEvent) => {
    const val = event.target.value as string;
    setValue(val);
    image.textures[texKey] = val;
    removeDrawable(gl, image.id);
    createDrawable(gl, image, image.textures);
  };

  const items = images.map((image) => (
    <MenuItem key={image.fileBasename} value={image.fileBasename}>
      {image.fileBasename}
    </MenuItem>
  ));

  return (
    <FormControl>
      <InputLabel id={`image-select-label-${texKey}`}>{texKey}</InputLabel>
      <Select
        labelId={`image-select-label-${texKey}`}
        id="simple-select"
        value={value}
        label={texKey}
        onChange={handleChange}
      >
        {items}
      </Select>
    </FormControl>
  );
};
