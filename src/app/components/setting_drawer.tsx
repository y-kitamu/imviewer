const React = require("react");
import { useEffect, useState } from "react";
import { Matrix4 } from "three";
import {
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { SettingDrawerProps } from "../types/props";
import {
  CanvasWindow,
  ImageProperty,
  ImageWidget,
  SubWindow,
} from "../types/window";
import { createDrawable, getSamplerNames, removeDrawable } from "../../gl/gl";
import { DEFAULT_SHADERS } from "../constants";
import { getImageUniforms, getImageVertices } from "../canvas_window";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, shaderStem, widgets, canvasWindow } =
    props;

  if (gl == undefined || gl == null) {
    console.log("WebGL context is null");
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
    let textures =
      canvasWindow.subWindows[focusedRow][focusedCol]?.image.textures;
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
    const subWindow = canvasWindow.subWindows[focusedRow][focusedCol];
    return (
      <ImageSelector
        key={key}
        gl={gl}
        texKey={key}
        images={images}
        subWindow={subWindow}
      />
    );
  });

  return (
    <>
      {" "}
      <Typography>Image</Typography>
      {selectors}
    </>
  );
};

const ImageSelector = (props: {
  gl: WebGL2RenderingContext;
  texKey: string;
  images: ImageProperty[];
  subWindow: SubWindow;
}) => {
  const { gl, texKey, images, subWindow } = props;
  const [value, setValue] = useState<string>(
    subWindow.image.textures[texKey] || ""
  );

  const handleChange = (event: SelectChangeEvent) => {
    // update react state
    const val = event.target.value as string;
    setValue(val);
    // update WebGL state
    const imageProperty = images.find((img) => img.fileBasename == val);
    if (imageProperty == undefined) {
      console.error(`Failed to get image property : ${val}`);
      return;
    }
    const image = subWindow.image;
    image.textures[texKey] = val;
    image.vertices = getImageVertices(imageProperty);
    image.uniforms = getImageUniforms(imageProperty, subWindow.mvpMat);
    removeDrawable(gl, image.id);
    createDrawable(gl, image, image.textures);
  };

  const items = images.map((image) => (
    <MenuItem key={image.fileBasename} value={image.fileBasename}>
      {image.fileBasename}
    </MenuItem>
  ));

  return (
    <>
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
    </>
  );
};
