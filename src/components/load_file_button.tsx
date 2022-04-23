const React = require("react");
import { Button } from "@mui/material";
import { useRef } from "react";
import { LoadFileButtonProps } from "../types/props";

export const LoadFileButton = (props: LoadFileButtonProps) => {
  const { text, accept, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const callback = () => {
    if (onChange != null) {
      return onChange(inputRef?.current);
    }
  };

  return (
    <>
      <input
        hidden
        multiple
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={callback}
      />
      <Button onClick={() => inputRef.current && inputRef.current.click()}>
        {text}
      </Button>
    </>
  );
};
