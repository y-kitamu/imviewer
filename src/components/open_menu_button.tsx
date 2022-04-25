const React = require("react");
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { OpenDrawerButtonProps } from "../types/props";

export const OpenDrawerButton = (props: OpenDrawerButtonProps) => {
  const { setIsOpen, left = -5, top = 0 } = props;
  return (
    <Button
      variant="outlined"
      onClick={() => setIsOpen(true)}
      sx={{ position: "absolute", left, top }}
    >
      <MenuIcon />
    </Button>
  );
};
