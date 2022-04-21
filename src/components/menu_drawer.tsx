const React = require("react");
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { MenuDrawerProps } from "../types/props";

export const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, setIsOpen } = props;
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  const menuList = (
    <List>
      {["Load json", "Load image"].map((text) => (
        <ListItemButton key={text}>
          <ListItemText primary={text} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
      {menuList}
    </Drawer>
  );
};
