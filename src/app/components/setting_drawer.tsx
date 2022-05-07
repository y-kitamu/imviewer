const React = require("react");
import { useEffect, useState } from "react";
import {
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ImageProperty } from "../../io/types/io";
import { DEFAULT_SHADERS } from "../../io/constants";
import { convertImagePropertyToWidget } from "../../io/io";
import { createDrawable, getSamplerNames, removeDrawable } from "../../gl/gl";
import { SettingDrawerProps } from "../types/props";
import { CanvasWindow } from "../types/window";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, shaderStem, jsons, canvasWindow } =
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
      <ImageSelectors
        gl={gl}
        imageProperties={images}
        canvasWindow={canvasWindow}
      />
    </Drawer>
  );
};

const ImageSelectors = (props: {
  gl: WebGL2RenderingContext;
  imageProperties: ImageProperty[];
  canvasWindow: CanvasWindow;
}) => {
  const { gl, imageProperties, canvasWindow } = props;
  const [focusedRow, setFocusedRow] = useState<number>(
    canvasWindow.onFocus.row
  );
  const [focusedCol, setFocusedCol] = useState<number>(
    canvasWindow.onFocus.col
  );
  const [focusedImageWidget, setFocusedImageWidget] = useState(
    canvasWindow.images.find(
      (img) => img.col.includes(focusedCol) && img.row.includes(focusedRow)
    )
  );

  const getSamplerKeys = () => {
    let textures = focusedImageWidget?.textures;
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
    const [value, setValue] = useState<string>(
      focusedImageWidget?.textures[key]?.fileBasename || ""
    );

    const handleChange = (event: SelectChangeEvent) => {
      // update react state
      const val = event.target.value as string;
      setValue(val);
      // update WebGL state
      const imageProperty = imageProperties.find(
        (img) => img.fileBasename == val
      );
      if (imageProperty == undefined) {
        console.error(`Failed to get image property : ${val}`);
        return;
      }
      let newWidget = convertImagePropertyToWidget(
        imageProperty,
        focusedRow,
        focusedCol,
        focusedImageWidget?.scale,
        focusedImageWidget?.mvpMats
      );
      if (focusedImageWidget?.textures) {
        newWidget.textures = focusedImageWidget.textures;
      } else {
        newWidget.textures = { key: imageProperty };
      }
      const textures: { [key: string]: string | undefined } = {};
      for (const key in newWidget.textures) {
        textures[key] = newWidget.textures[key].fileBasename;
      }
      removeDrawable(gl, newWidget.id);
      createDrawable(gl, newWidget, textures);
      if (focusedImageWidget) {
        const idx = canvasWindow.images.findIndex(
          (img) => img.id == focusedImageWidget.id
        );
        canvasWindow.images[idx] = newWidget;
      } else {
        canvasWindow.images.push(newWidget);
      }
      setFocusedImageWidget(newWidget);
    };

    const items = imageProperties.map((image) => (
      <MenuItem key={image.fileBasename} value={image.fileBasename}>
        {image.fileBasename}
      </MenuItem>
    ));

    return (
      <>
        <FormControl>
          <InputLabel id={`image-select-label-${key}`}>{key}</InputLabel>
          <Select
            labelId={`image-select-label-${key}`}
            id="simple-select"
            value={value}
            label={key}
            onChange={handleChange}
          >
            {items}
          </Select>
        </FormControl>
      </>
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
