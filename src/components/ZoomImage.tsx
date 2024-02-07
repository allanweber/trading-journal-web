import { ReactNode } from "react";
import ImageZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

type Props = {
  children: ReactNode;
};

export const ZoomImage = ({ children }: Props) => {
  if (!children) return null;

  return <ImageZoom zoomMargin={40}>{children}</ImageZoom>;
};
