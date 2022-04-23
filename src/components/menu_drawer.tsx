const React = require("react");
import { Drawer, List, ListItem } from "@mui/material";
import { MenuDrawerProps } from "../types/props";
import { LoadFileButton } from "./load_file_button";

export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen, setCurrentImage } = props;
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "key down" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  const loadJson = async (file: File) => {
    const json_text = await file.text();
    console.log(json_text);
    const json = JSON.parse(json_text);
  };

  const loadImage = async (file: File) => {
    console.log("Load image");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          setCurrentImage(image);
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
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
      {menuList}
    </Drawer>
  );
};
