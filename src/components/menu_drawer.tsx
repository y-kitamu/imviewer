const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { Matrix4 } from "three";

import { getBasename } from "../utility";
import { MenuDrawerProps } from "../types/props";
import { ImageContext } from "../types/gl";
import { LoadFileButton } from "./load_file_button";

/**
 *
 */
export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, imageDatas, setImageDatas } = props;

  const loadJson = async (file: File) => {
    const json_text = await file.text();
    console.log(json_text);
    const json = JSON.parse(json_text);
  };

  const loadImage = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const showing = imageDatas.filter((data) => data.isDrawing);
        if (showing.length == 1) {
          showing[0].isDrawing = false;
        }
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          setImageDatas(
            imageDatas.concat([
              {
                filename: getBasename(file.name),
                image,
                mvpMat: new Matrix4(),
                isDrawing: true,
              },
            ])
          );
        };
      }
    };
  };

  const onFileSelected = (
    elem: HTMLInputElement | null,
    callback: (f: File) => void
  ) => {
    if (elem == null || elem.files == null) {
      return;
    }
    for (let i = 0; i < elem.files.length; i++) {
      const file = elem.files[i];
      callback(file);
    }
    setIsOpen(false);
  };

  const menuList = (
    <List>
      <ListItem key="loadJson">
        <LoadFileButton
          text="Load JSON"
          accept=".json"
          onChange={(elem: HTMLInputElement | null) =>
            onFileSelected(elem, loadJson)
          }
        />
      </ListItem>
      <ListItem key="loadImage">
        <LoadFileButton
          text="Load Image"
          accept="image/*"
          onChange={(elem: HTMLInputElement | null) =>
            onFileSelected(elem, loadImage)
          }
        />
      </ListItem>
    </List>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={(_) => {
        setIsOpen(false);
      }}
    >
      {menuList}
    </Drawer>
  );
};
