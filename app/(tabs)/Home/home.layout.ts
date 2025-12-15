export type LayoutRect = { x: number; y: number; width: number; height: number };

type ScaleFn = (size: number) => number;

export function computeStageLayout(params: {
  headerLayout: LayoutRect | null;
  hubLayout: LayoutRect | null;
  hubOriginLayout: LayoutRect | null;
  leftBtnLayout: LayoutRect | null;
  rightBtnLayout: LayoutRect | null;
  powerLayout: LayoutRect | null;
  insetsTop: number;
  insetsBottom: number;
  width: number;
  height: number;
  dynamicScale: ScaleFn;
  dynamicVerticalScale: ScaleFn;
}): {
  headerBottomY: number;
  bottomNavTopY: number;
  stageHeight: number;
  topRowY: number;
  hubCenterY: number;
  bottomRowY: number;
  scaleFactor: number;
  EPS_SVG: number;
  EPS_PX: number;
  topBundleY: number;
  bottomBundleY: number;
  hubOriginScreenY: number;
  leftBtnCenterScreenY: number;
  rightBtnCenterScreenY: number;
  leftBtnBundleYSvg: number;
  rightBtnBundleYSvg: number;
  leftBtnCenterScreenX: number;
  rightBtnCenterScreenX: number;
  leftBundleX: number;
  rightBundleX: number;
  screenLeftEdgeSVG: number;
  screenRightEdgeSVG: number;
  spineTop: number;
  spineBottom: number;
} {
  const {
    headerLayout,
    hubLayout,
    hubOriginLayout,
    leftBtnLayout,
    rightBtnLayout,
    powerLayout,
    insetsTop,
    insetsBottom,
    width,
    height,
    dynamicScale,
    dynamicVerticalScale,
  } = params;

  const headerBottomY = headerLayout
    ? headerLayout.y + headerLayout.height
    : insetsTop + dynamicVerticalScale(80);

  const bottomNavTopY = height - insetsBottom - dynamicVerticalScale(80);
  const stageHeight = bottomNavTopY - headerBottomY;

  const topRowHeight = dynamicVerticalScale(56);
  const hubHeight = dynamicScale(240);
  const bottomRowHeight = dynamicVerticalScale(56);

  const totalContentHeight = topRowHeight + hubHeight + bottomRowHeight;
  const totalFreeSpace = stageHeight - totalContentHeight;
  const spacing = totalFreeSpace / 3;

  const topRowY = headerBottomY + spacing * 0.5 + topRowHeight / 2;
  const hubCenterYComputed = headerBottomY + spacing * 1.5 + topRowHeight + hubHeight / 2;
  const hubCenterY = hubLayout ? hubLayout.y + hubLayout.height / 2 : hubCenterYComputed;
  const bottomRowY = headerBottomY + spacing * 2.5 + topRowHeight + hubHeight + bottomRowHeight / 2;

  const scaleFactor = dynamicScale(1);
  const EPS_SVG = 1.5;
  const EPS_PX = 1.5;

  const topBundleY = 120 + (topRowY - hubCenterY) / scaleFactor;
  const bottomBundleY = 120 + (bottomRowY - hubCenterY) / scaleFactor;

  const hubOriginScreenY = hubOriginLayout ? hubOriginLayout.y + hubOriginLayout.height / 2 : hubCenterY;
  const leftBtnCenterScreenY = leftBtnLayout ? leftBtnLayout.y + leftBtnLayout.height / 2 : bottomRowY;
  const rightBtnCenterScreenY = rightBtnLayout ? rightBtnLayout.y + rightBtnLayout.height / 2 : bottomRowY;

  const leftBtnBundleYSvg = leftBtnLayout
    ? 120 + (leftBtnCenterScreenY - hubOriginScreenY) / scaleFactor
    : bottomBundleY;
  const rightBtnBundleYSvg = rightBtnLayout
    ? 120 + (rightBtnCenterScreenY - hubOriginScreenY) / scaleFactor
    : bottomBundleY;

  const paddingX = dynamicScale(24);
  const buttonWidth = dynamicScale(100);

  const leftBtnCenterScreenX = leftBtnLayout
    ? leftBtnLayout.x + leftBtnLayout.width / 2
    : paddingX + buttonWidth / 2;
  const rightBtnCenterScreenX = rightBtnLayout
    ? rightBtnLayout.x + rightBtnLayout.width / 2
    : width - paddingX - buttonWidth / 2;

  const leftBtnOffsetX = leftBtnCenterScreenX - width / 2;
  const rightBtnOffsetX = rightBtnCenterScreenX - width / 2;

  let leftBundleX = 120 + leftBtnOffsetX / scaleFactor;
  let rightBundleX = 120 + rightBtnOffsetX / scaleFactor;

  leftBundleX = leftBtnLayout ? leftBundleX + EPS_SVG * Math.sign(leftBtnOffsetX || -1) : leftBundleX;
  rightBundleX = rightBtnLayout ? rightBundleX + EPS_SVG * Math.sign(rightBtnOffsetX || 1) : rightBundleX;

  const screenLeftEdgeSVG = 120 + (0 - width / 2) / scaleFactor;
  const screenRightEdgeSVG = 120 + (width - width / 2) / scaleFactor;

  const headerHeight = headerLayout ? headerLayout.height : dynamicVerticalScale(80);
  const spineTop = headerLayout ? headerLayout.y + headerHeight / 2 : insetsTop + headerHeight / 2;

  const powerCenterY = powerLayout ? powerLayout.y + powerLayout.height / 2 : bottomRowY + dynamicVerticalScale(30);
  const spineBottom = powerLayout ? powerCenterY + EPS_PX : powerCenterY;

  return {
    headerBottomY,
    bottomNavTopY,
    stageHeight,
    topRowY,
    hubCenterY,
    bottomRowY,
    scaleFactor,
    EPS_SVG,
    EPS_PX,
    topBundleY,
    bottomBundleY,
    hubOriginScreenY,
    leftBtnCenterScreenY,
    rightBtnCenterScreenY,
    leftBtnBundleYSvg,
    rightBtnBundleYSvg,
    leftBtnCenterScreenX,
    rightBtnCenterScreenX,
    leftBundleX,
    rightBundleX,
    screenLeftEdgeSVG,
    screenRightEdgeSVG,
    spineTop,
    spineBottom,
  };
}
