const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { MenuDrawerProps } from "../types/props";
import { LoadFileButton } from "./load_file_button";

/**
 *
 */
export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, widgets, refCanvasWindow } = props;

  const setJson = async (file: File) => {
    const json = await loadJson(file);
  };

  const setImage = async (file: File) => {
    const image = await loadImage(file);
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
