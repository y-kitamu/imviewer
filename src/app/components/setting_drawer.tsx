const React = require("react");
import { useEffect, useState } from "react";
import {
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ImageProperty, JsonSchema } from "../../io/types/io";
import { DEFAULT_SHADERS } from "../../io/constants";
import { createDrawable, getSamplerNames, removeDrawable } from "../../gl/gl";
import { SettingDrawerProps } from "../types/props";
import { CanvasWindow } from "../types/window";
import {
  createImageWidget,
  createWidget,
  deleteImageWidget,
  deleteWidget,
  getFocusedImageWidget,
  isWidgetDrawing,
} from "../crud";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, shaderStem, jsons, canvasWindow } =
    props;
  const [focusedRow, setFocusedRow] = useState<number>(
    canvasWindow.onFocus.row
  );
  const [focusedCol, setFocusedCol] = useState<number>(
    canvasWindow.onFocus.col
  );

  useEffect(() => {
    canvasWindow.onFocus = { row: focusedRow, col: focusedCol };
  }, [focusedRow, focusedCol]);

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
      <WidgetSelectors
        gl={gl}
        jsons={jsons}
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
  const { gl, canvasWindow, imageProperties } = props;
  let imageWidget = getFocusedImageWidget(canvasWindow);

  const getSamplerKeys = () => {
    let textures = imageWidget?.textures;
    if (textures != undefined) {
      return Object.keys(textures);
    }
    return getSamplerNames(DEFAULT_SHADERS.image);
  };

  const selectors = getSamplerKeys().map((key) => {
    const [value, setValue] = useState<string>(
      imageWidget?.textures[key]?.fileBasename || ""
    );

    const handleChange = (event: SelectChangeEvent) => {
      const fileBasename = event.target.value as string;
      if (fileBasename == "") {
        setValue("");
        deleteImageWidget(gl, canvasWindow);
      } else {
        createImageWidget(gl, canvasWindow, imageProperties, fileBasename, key);
      }
      setValue(fileBasename);
    };

    const items = imageProperties.map((image) => (
      <MenuItem key={image.fileBasename} value={image.fileBasename}>
        {image.fileBasename}
      </MenuItem>
    ));

    return (
      <div key={key}>
        <FormControl>
          <InputLabel id={`image-select-label-${key}`}>{key}</InputLabel>
          <Select
            labelId={`image-select-label-${key}`}
            id="simple-select"
            value={value}
            label={key}
            onChange={handleChange}
          >
            <MenuItem key={"None"} value={""}>
              {"None"}
            </MenuItem>
            {items}
          </Select>
        </FormControl>
      </div>
    );
  });

  return (
    <>
      <Typography>Image</Typography>
      {selectors}
    </>
  );
};

const WidgetSelectors = (props: {
  gl: WebGL2RenderingContext;
  jsons: { [key: string]: JsonSchema[] };
  imageProperties: ImageProperty[];
  canvasWindow: CanvasWindow;
}) => {
  const { gl, jsons, imageProperties, canvasWindow } = props;

  const labels = Object.keys(jsons)
    .map((key) => {
      return jsons[key].map((schema, idx) => {
        const [checked, setChecked] = useState(
          isWidgetDrawing(canvasWindow, schema)
        );

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(event.target.checked);
          if (event.target.checked) {
            createWidget(gl, canvasWindow, imageProperties, schema);
          } else {
            deleteWidget(gl, canvasWindow, schema);
          }
        };

        return (
          <FormControlLabel
            key={`${key}_${idx}`}
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label={`${key}_${idx}`}
          />
        );
      });
    })
    .flat();

  return (
    <>
      <Typography>Widgets</Typography>
      <FormGroup>{labels}</FormGroup>
    </>
  );
};
