const React = require("react");
import { Box, Slider } from "@mui/material";
import { useState } from "react";
import { SCALE_SLIDER_FACTOR } from "../constants";
import { ScaleSliderProps } from "../types/props";

export const ScaleSlider = (props: ScaleSliderProps) => {
  // const {} = props;
  // const defaultValue = mvpMat?.elements[0] ? mvpMat?.elements[0] : 1;
  // const [value, setValue] = useState<number>(
  //   defaultValue * SCALE_SLIDER_FACTOR
  // );
  // if (mvpMat == null) {
  //   return <></>;
  // }
  // const handleChange = (event: Event, newValue: number | number[]) => {
  //   const val = newValue as number;
  //   setValue(val);
  //   mvpMat.elements[0] = val / SCALE_SLIDER_FACTOR;
  //   mvpMat.elements[5] = val / SCALE_SLIDER_FACTOR;
  // };
  // return (
  //   <Box
  //     sx={{
  //       width: "40%",
  //       position: "absolute",
  //       bottom: "10%",
  //       left: "30%",
  //     }}
  //   >
  //     <Slider value={value} onChange={handleChange}></Slider>
  //   </Box>
  // );
};
