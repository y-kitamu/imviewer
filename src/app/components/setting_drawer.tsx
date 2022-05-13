const React = require("react");
import { useEffect, useState } from "react";
import {
  Checkbox,
  Divider,
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
import { JsonSchema } from "../../io/types/io";
import { DEFAULT_SHADERS } from "../../io/constants";
import { getSamplerNames } from "../../gl/gl";
import { SettingDrawerProps } from "../types/props";
import { CanvasWindow } from "../types/window";
import {
  createImageWidget,
  createWidget,
  deleteWidget,
  getFocusedImageWidget,
  isWidgetDrawing,
} from "../cruds/widget";
import { WindowOperationButtons } from "./window_operation_buttons";

export const SettingDrawer = (props: SettingDrawerProps) => {
  console.log("Render SettingDrawer");
  const { isOpen, setIsOpen, gl, images, shaderStem, jsons, canvasWindow } =
    props;
  const [focusedRow, setFocusedRow] = useState<number>(
    canvasWindow.onFocus.row
  );
  const [focusedCol, setFocusedCol] = useState<number>(
    canvasWindow.onFocus.col
  );

  const handleChange = (
    event: SelectChangeEvent,
    setter: (val: number) => void
  ) => {
    const val = Number(event.target.value);
    if (val != undefined) {
      setter(val);
    }
  };

  const { nrows, ncols } = canvasWindow;
  const rows = Array.from({ length: nrows }, (_, i) => (
    <MenuItem key={i} value={i}>
      {i}
    </MenuItem>
  ));
  const cols = Array.from({ length: ncols }, (_, i) => (
    <MenuItem key={i} value={i}>
      {i}
    </MenuItem>
  ));

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
      <WindowOperationButtons gl={gl} canvasWindow={canvasWindow} />
      <Divider />
      <FormControl>
        <InputLabel id="canvas-row-select-label">Row</InputLabel>
        <Select
          labelId="canvas-row-select-label"
          id="demo-simple-select"
          value={String(focusedRow)}
          label="Row"
          onChange={(event) => handleChange(event, setFocusedRow)}
        >
          {rows}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="canvas-col-select-label">Col</InputLabel>
        <Select
          labelId="canvas-col-select-label"
          id="demo-simple-select"
          value={String(focusedCol)}
          label="Col"
          onChange={(event) => handleChange(event, setFocusedCol)}
        >
          {cols}
        </Select>
      </FormControl>
      <Divider />
      <ImageSelectors gl={gl} images={images} canvasWindow={canvasWindow} />
      <WidgetSelectors
        gl={gl}
        jsons={jsons}
        images={images}
        canvasWindow={canvasWindow}
      />
    </Drawer>
  );
};

const ImageSelectors = (props: {
  gl: WebGL2RenderingContext;
  images: { [key: string]: HTMLImageElement };
  canvasWindow: CanvasWindow;
}) => {
  const { gl, canvasWindow, images } = props;
  const textures = getFocusedImageWidget(canvasWindow)?.textures;

  const getSamplerKeys = () => {
    if (textures != undefined) {
      return Object.keys(textures);
    }
    return getSamplerNames(DEFAULT_SHADERS.image);
  };

  const selectors = getSamplerKeys().map((key) => {
    const [value, setValue] = useState<string>(
      textures ? textures[key] || "" : ""
    );

    const handleChange = (event: SelectChangeEvent) => {
      const fileBasename = event.target.value as string;
      if (fileBasename == "") {
        setValue("");
        deleteWidget(gl, canvasWindow);
      } else {
        createImageWidget(
          gl,
          canvasWindow,
          images[fileBasename],
          fileBasename,
          key
        );
      }
      setValue(fileBasename);
    };

    const items = Object.keys(images).map((bname) => (
      <MenuItem key={bname} value={bname}>
        {bname}
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
  images: { [key: string]: HTMLImageElement };
  canvasWindow: CanvasWindow;
}) => {
  console.log("Render WidgetSelectors");
  const { gl, jsons, images, canvasWindow } = props;

  const labels = Object.keys(jsons)
    .map((key) => {
      return jsons[key].map((schema) => {
        const [checked, setChecked] = useState(
          isWidgetDrawing(canvasWindow, schema)
        );

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(event.target.checked);
          if (event.target.checked) {
            createWidget(gl, canvasWindow, schema);
          } else {
            deleteWidget(gl, canvasWindow, schema);
          }
        };

        return (
          <FormControlLabel
            key={schema.schemaId!}
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label={schema.schemaId!}
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
