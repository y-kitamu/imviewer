const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { registerImage } from "../io/image";
import { loadJson } from "../io/json";
import { MenuDrawerProps } from "../types/props";
import { LoadFileButton } from "./load_file_button";

/**
 *
 */
export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, widgets } = props;

  const setJson = async (file: File) => {
    const widget = await loadJson(file);
    widgets.push(widget);
  };

  const setImage = async (file: File) => {
    if (gl == undefined || gl == null) {
      console.error("Failed to get WebGL2Context");
      return;
    }
    const newImage = await registerImage(gl, file);
    if (newImage != undefined) {
      images.push(newImage);
    }
  };

  const onFileSelected = (
    elem: HTMLInputElement | null,
    callback: (f: File) => Promise<void>
  ) => {
    (async () => {
      if (elem == null || elem.files == null) {
        return;
      }
      const promise = [];
      for (let i = 0; i < elem.files.length; i++) {
        const file = elem.files[i];
        promise.push(callback(file));
      }
      Promise.all(promise);
      setIsOpen(false);
    })();
  };

  const menuList = (
    <List>
      <ListItem key="loadJson">
        <LoadFileButton
          text="Load JSON"
          accept=".json"
          onChange={(elem: HTMLInputElement | null) =>
            onFileSelected(elem, setJson)
          }
        />
      </ListItem>
      <ListItem key="loadImage">
        <LoadFileButton
          text="Load Image"
          accept="image/*"
          onChange={(elem: HTMLInputElement | null) =>
            onFileSelected(elem, setImage)
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
