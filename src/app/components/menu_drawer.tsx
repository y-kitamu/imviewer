const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { loadImage, loadJson } from "../../io/io";
import { MenuDrawerProps } from "../types/props";
import { LoadFileButton } from "./load_file_button";

/**
 *
 */
export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, gl, images, jsons } = props;

  const setJson = async (file: File) => {
    if (file.name in jsons) {
      return;
    }
    jsons[file.name] = await loadJson(file);
  };

  const setImage = async (file: File) => {
    if (gl == undefined || gl == null) {
      console.error("Failed to get WebGL2Context");
      return;
    }
    const newImage = await loadImage(gl, file);
    if (newImage != undefined) {
      Object.assign(images, newImage);
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
