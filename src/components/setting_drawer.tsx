import { Drawer } from "@mui/material";
import { ImageContext } from "../types/gl";
import { SettingDrawerProps } from "../types/props";

export const SettingDrawer = (props: SettingDrawerProps) => {
  const { isOpen, setIsOpen, images } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={(_) => {
        setIsOpen(false);
      }}
    >
      <ImageSelector images={images} />
    </Drawer>
  );
};

const ImageSelector = (props: {
  images: ImageContext[];
  setCurrentImage: (val: ImageContext) => void;
}) => {
  const { images } = props;
  if (images.length == 0) {
    return <></>;
  }

  const imageList = images.map((image) => {});

  return <>{imageList}</>;
};
