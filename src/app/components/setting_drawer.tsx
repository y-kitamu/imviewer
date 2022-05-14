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
import { PartsType } from "../../gl/types/schemas";
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
  const { isOpen, setIsOpen, gl, images, shaderStem, jsons, canvasWindow } =
    props;
  const [onFocus, setOnFocus] = useState<{ row: number; col: number }>(
    canvasWindow.onFocus
  );
  const [nrows, setNRows] = useState<number>(canvasWindow.nrows);
  const [ncols, setNCols] = useState<number>(canvasWindow.ncols);

  const handleChange = (
    event: SelectChangeEvent,
    key: keyof typeof onFocus,
    setter: (val: typeof onFocus) => void
  ) => {
    const val = Number(event.target.value);
    if (val != undefined) {
      canvasWindow.onFocus = { ...onFocus, [key]: val };
      setter(canvasWindow.onFocus);
    }
  };

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
    const { row, col } = canvasWindow.onFocus;
    if (onFocus.row != row || onFocus.col != col) {
      setOnFocus({ row: row, col: col });
    }
  }, [isOpen]);

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
      <WindowOperationButtons
        gl={gl}
        canvasWindow={canvasWindow}
        setNRows={setNRows}
        setNCols={setNCols}
      />
      <Divider />
      <FormControl>
        <InputLabel id="canvas-row-select-label">Row</InputLabel>
        <Select
          labelId="canvas-row-select-label"
          id="demo-simple-select"
          value={String(onFocus.row)}
          label="Row"
          onChange={(event) => handleChange(event, "row", setOnFocus)}
        >
          {rows}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="canvas-col-select-label">Col</InputLabel>
        <Select
          labelId="canvas-col-select-label"
          id="demo-simple-select"
          value={String(onFocus.col)}
          label="Col"
          onChange={(event) => handleChange(event, "col", setOnFocus)}
        >
          {cols}
        </Select>
      </FormControl>
      <Divider />
      <ImageSelectors gl={gl} images={images} canvasWindow={canvasWindow} />
      <PointSelectors
        gl={gl}
        jsons={jsons}
        images={images}
        canvasWindow={canvasWindow}
      />
      <LineSelectors
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
    if (textures == undefined) {
      if (value != "") {
        setValue("");
      }
    } else if (textures[key] != value) {
      setValue(textures[key] || "");
    }
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

const PointSelectors = (props: {
  gl: WebGL2RenderingContext;
  jsons: { [key: string]: JsonSchema[] };
  images: { [key: string]: HTMLImageElement };
  canvasWindow: CanvasWindow;
}) => {
  const { gl, jsons, images, canvasWindow } = props;

  const labels = Object.keys(jsons)
    .map((key) => {
      return jsons[key].map((schema) => {
        if (schema.partsType != "point") {
          return;
        }
        const isDrawing = isWidgetDrawing(canvasWindow, schema);
        const [checked, setChecked] = useState(isDrawing);

        if (isDrawing != checked) {
          setChecked(isDrawing);
        }

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            createWidget(gl, canvasWindow, schema);
          } else {
            deleteWidget(gl, canvasWindow, schema);
          }
          setChecked(event.target.checked);
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
      <Typography>{"Points"}</Typography>
      <FormGroup>{labels}</FormGroup>
    </>
  );
};

const LineSelectors = (props: {
  gl: WebGL2RenderingContext;
  jsons: { [key: string]: JsonSchema[] };
  images: { [key: string]: HTMLImageElement };
  canvasWindow: CanvasWindow;
}) => {
  const { gl, jsons, images, canvasWindow } = props;

  const labels = Object.keys(jsons)
    .map((key) => {
      return jsons[key].map((schema, idx) => {
        if (schema.partsType != "line") {
          return;
        }
        const isDrawing = isWidgetDrawing(canvasWindow, schema);
        const [checked, setChecked] = useState(isDrawing);
        const [row0, setRow0] = useState("");
        const [col0, setCol0] = useState("");
        const [row1, setRow1] = useState("");
        const [col1, setCol1] = useState("");

        if (isDrawing != checked) {
          setChecked(isDrawing);
        }

        const create = () => {
          if (row0 != "" && row1 != "" && col0 != "" && col1 != "") {
            const r0 = Number(row0);
            const r1 = Number(row1);
            const c0 = Number(col0);
            const c1 = Number(col1);
            if (isDrawing) {
              deleteWidget(gl, canvasWindow, schema);
            }
            createWidget(gl, canvasWindow, schema, [r0, r1], [c0, c1]);
            setChecked(true);
          }
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            create();
          } else {
            deleteWidget(gl, canvasWindow, schema);
          }
          setChecked(event.target.checked);
        };

        const handleChangeSelect = (
          event: SelectChangeEvent,
          setter: (val: string) => void
        ) => {
          const val = Number(event.target.value);
          setter(String(val));
        };

        useEffect(() => {
          create();
        }, [row0, col0, row1, col1]);

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

        return (
          <div key={schema.schemaId!}>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label={schema.schemaId!}
            />
            <FormControl>
              <InputLabel id={`select-row0-${idx}`}>Row0</InputLabel>
              <Select
                labelId={`select-row0-${idx}`}
                id="demo-simple-select"
                value={String(row0)}
                label="Row0"
                onChange={(event) => handleChangeSelect(event, setRow0)}
              >
                {rows}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id={`select-col0-${idx}`}>Col0</InputLabel>
              <Select
                labelId={`select-col0-${idx}`}
                id="demo-simple-select"
                value={String(col0)}
                label="Col0"
                onChange={(event) => handleChangeSelect(event, setCol0)}
              >
                {cols}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id={`select-row1-${idx}`}>Row1</InputLabel>
              <Select
                labelId={`select-row1-${idx}`}
                id="demo-simple-select"
                value={String(row1)}
                label="Row0"
                onChange={(event) => handleChangeSelect(event, setRow1)}
              >
                {rows}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id={`select-col1-${idx}`}>Col1</InputLabel>
              <Select
                labelId={`select-col1-${idx}`}
                id="demo-simple-select"
                value={String(col1)}
                label="Col0"
                onChange={(event) => handleChangeSelect(event, setCol1)}
              >
                {cols}
              </Select>
            </FormControl>
          </div>
        );
      });
    })
    .flat();

  return (
    <>
      <Typography>{"Lines"}</Typography>
      <FormGroup>{labels}</FormGroup>
    </>
  );
};
