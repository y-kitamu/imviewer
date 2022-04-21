const React = require("react");
import { Fab } from "@mui/material";
import { OpenMenuButtonProps } from "../types/props";

export const OpenMenuButton = (props: OpenMenuButtonProps) => {
  const { setIsOpen } = props;
  return (
    <Fab variant="extended" onClick={() => setIsOpen(true)}>
      MENU
    </Fab>
  );
};
