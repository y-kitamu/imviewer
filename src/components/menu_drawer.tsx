const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { Matrix4 } from "three";
import { ImageWidget } from "../types/widgets";
import { MenuDrawerProps } from "../types/props";
import { LoadFileButton } from "./load_file_button";
import { hashCode } from "../lib";

const getHash = (baseStr: string) => {
  const seed = `${baseStr}${Date.now()}`;
};

/**
 *
 */
export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, widgets, refCanvasWindow } = props;

  const loadJson = async (file: File) => {
    const json_text = await file.text();
    console.log(json_text);
    const json = JSON.parse(json_text);
  };

  const loadImage = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (!(typeof reader.result === "string")) {
        return;
      }
      const image = new Image();
      image.src = reader.result;
      const imageWidget: ImageWidget = {
        id: hashCode(`${reader.result}${Date.now()}`),
        widgetType: "image",
        shader:
      };
      image.onload = () => {
        widgets.current.push(imageWidget);
      };
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
