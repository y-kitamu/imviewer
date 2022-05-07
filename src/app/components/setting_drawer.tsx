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
import {
  convertImagePropertyToWidget,
  convertJsonSchemaToWidget,
} from "../../io/io";
import { createDrawable, getSamplerNames, removeDrawable } from "../../gl/gl";
import { SettingDrawerProps } from "../types/props";
import { Widget } from "../types/widget";
import { CanvasWindow } from "../types/window";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, shaderStem, jsons, canvasWindow } =
    props;
  const [focusedRow, setFocusedRow] = useState<number>(
    canvasWindow.onFocus.row
  );
  const [focusedCol, setFocusedCol] = useState<number>(
    canvasWindow.onFocus.col
  );
  const getFocusedImageWidget = () => {
    return canvasWindow.images.find(
      (img) => img.row.includes(focusedRow) && img.col.includes(focusedCol)
    );
  };
  let focusedImageWidget = getFocusedImageWidget();

  useEffect(() => {
    canvasWindow.onFocus = { row: focusedRow, col: focusedCol };
    focusedImageWidget = getFocusedImageWidget();
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
        imageWidget={focusedImageWidget}
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
  imageWidget?: Widget;
}) => {
  const { gl, canvasWindow, imageProperties, imageWidget } = props;

  const getSamplerKeys = () => {
    let textures = imageWidget?.textures;
    if (textures != undefined) {
      return Object.keys(textures);
    }
    return getSamplerNames(DEFAULT_SHADERS.image);
  };
  const [keys, setKeys] = useState<string[]>(getSamplerKeys());

  const selectors = keys.map((key) => {
    const [value, setValue] = useState<string>(
      imageWidget?.textures[key]?.fileBasename || ""
    );

    const handleChange = (event: SelectChangeEvent) => {
      const val = event.target.value as string;
      setValue(val);
      const imageProperty = imageProperties.find(
        (img) => img.fileBasename == val
      );
      if (imageProperty == undefined) {
        console.error(`Failed to get image property : ${val}`);
        return;
      }
      //
      let newWidget = convertImagePropertyToWidget(
        imageProperty,
        canvasWindow.onFocus.row,
        canvasWindow.onFocus.col,
        imageWidget?.scale,
        imageWidget?.mvpMats
      );
      if (imageWidget == undefined) {
        newWidget.textures = { [key]: imageProperty };
        canvasWindow.images.push(newWidget);
      } else {
        newWidget.textures = imageWidget.textures;
        newWidget.textures[key] = imageProperty;
      }
      Object.assign(imageWidget, newWidget);
      //
      const textures: { [key: string]: string | undefined } = {};
      for (const key in newWidget.textures) {
        textures[key] = newWidget.textures[key].fileBasename;
      }
      removeDrawable(gl, newWidget.id);
      createDrawable(gl, newWidget, textures);
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
            {items}
          </Select>
        </FormControl>
      </div>
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

const WidgetSelectors = (props: {
  gl: WebGL2RenderingContext;
  jsons: { [key: string]: JsonSchema[] };
  imageProperties: ImageProperty[];
  canvasWindow: CanvasWindow;
}) => {
  const { gl, jsons, imageProperties, canvasWindow } = props;
  const imageWidget = canvasWindow.images.find(
    (img) =>
      img.row.includes(canvasWindow.onFocus.row) &&
      img.col.includes(canvasWindow.onFocus.col)
  );

  const { row, col } = canvasWindow.onFocus;
  const labels = Object.keys(jsons)
    .map((key) => {
      return jsons[key].map((schema, idx) => {
        const [checked, setChecked] = useState(false);
        const getImageProperty = (): ImageProperty => {
          if (imageWidget) {
            return {
              fileBasename: "",
              width: imageWidget.scale[0],
              height: imageWidget.scale[0],
            };
          } else if (schema.imageFilename) {
            const prop = imageProperties.find(
              (property) => property.fileBasename == schema.imageFilename
            );
            if (prop) {
              return prop;
            }
          }
          return { fileBasename: "", width: 1.0, height: 1.0 };
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(event.target.checked);
          if (event.target.checked) {
            const iprop = getImageProperty();
            if (iprop == undefined)
              convertJsonSchemaToWidget(schema, iprop, [row], [col]);
          } else {
            canvasWindow.widgets = canvasWindow.widgets.filter((widget) => {
              if (widget.row.includes(row) && widget.row.includes(col)) {
                return !(widget.vertices == schema.datas);
              }
              return true;
            });
          }
        };

        return (
          <FormControlLabel
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
