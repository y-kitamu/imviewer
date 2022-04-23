const React = require("react");
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { OpenMenuButtonProps } from "../types/props";

export const OpenMenuButton = (props: OpenMenuButtonProps) => {
  const { setIsOpen } = props;
  return (
    <Button
      variant="outlined"
      onClick={() => setIsOpen(true)}
      sx={{ position: "absolute", left: -5, top: 0 }}
    >
      <MenuIcon />
    </Button>
  );
};
