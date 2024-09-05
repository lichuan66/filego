export default function getBorderScale(
  borderWidth: number,
  borderHeight: number,
  imageWidth: number,
  imageHeight: number
) {
  let scale = 1;
  if (
    (borderWidth >= imageWidth && borderHeight >= imageHeight) ||
    (borderWidth < imageWidth && borderHeight < imageHeight)
  ) {
    if (borderWidth / imageWidth <= borderHeight / imageHeight) {
      scale = Math.round((borderWidth / imageWidth) * 100000) / 100000;
    } else {
      scale = Math.round((borderHeight / imageHeight) * 100000) / 100000;
    }
  } else if (borderWidth < imageWidth && borderHeight >= imageHeight) {
    scale = Math.floor((borderWidth / imageWidth) * 100000) / 100000;
  } else if (borderWidth >= imageWidth && borderHeight < imageHeight) {
    scale = Math.floor((borderHeight / imageHeight) * 100000) / 100000;
  }
  return scale;
}
