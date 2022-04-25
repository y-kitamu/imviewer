const React = require("react");
import { ChangeEvent, useState } from "react";
import {
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ImageContext } from "../types/gl";
import { SettingDrawerProps } from "../types/props";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const {
    isOpen,
    setIsOpen,
    imageDatas,
    setImageDatas,
    currentShader,
    setCurrentShader,
  } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={(_) => {
        setIsOpen(false);
      }}
    >
      <ImageSelector images={imageDatas} setImageDatas={setImageDatas} />
    </Drawer>
  );
};

const ImageSelector = (props: {
  images: ImageContext[];
  setImageDatas: (val: ImageContext[]) => void;
}) => {
  const { images, setImageDatas } = props;
  const defaultValue = images.find((img) => img.isDrawing)?.filename;
  const [value, setValue] = useState<string | undefined>(defaultValue);

  if (images.length == 0) {
    return <></>;
  }

  const imageList = images.map((image) => (
    <FormControlLabel
      key={image.filename}
      value={image.filename}
      control={<Radio />}
      label={image.filename}
    />
  ));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = (event.target as HTMLInputElement).value;
    setValue(selected);
    const updated = images.map((img) => {
      img.isDrawing = img.filename == selected;
      return img;
    });
    setImageDatas(updated);
  };

  return (
    <FormControl>
      <FormLabel id="image-selector-group-label">Images</FormLabel>
      <RadioGroup
        aria-labelledby="image-selector-group-label"
        name="radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {imageList}
      </RadioGroup>
    </FormControl>
  );
};
