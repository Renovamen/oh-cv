import { useStyleStore } from "~/store";
import { CHROME_PRINT_BOTTOM, PAPER, getPreviewW } from "./constants";

const { styles } = useStyleStore();

const pageMarginCss = () => {
  const bottom = Math.max(styles.marginV - 10, CHROME_PRINT_BOTTOM);
  return `.preview-page { padding: ${styles.marginV}px ${styles.marginH}px ${bottom}px }`;
};

const themeColorCss = () => {
  return (
    `.preview a:not(.preview-header-link) { color: ${styles.themeColor} }` +
    `.preview h1, .preview h2, .preview h3 { color: ${styles.themeColor} }` +
    `.preview h2 { border-bottom-color: ${styles.themeColor} }`
  );
};

const lineHeightCss = () => {
  const lineHeight = styles.lineHeight / 100;
  return (
    `.preview p, .preview li { line-height: ${lineHeight.toFixed(2)} }` +
    `.preview h2, .preview h3 { line-height: ${(lineHeight * 1.154).toFixed(
      2
    )} }` +
    `.preview dl { line-height: ${(lineHeight * 1.038).toFixed(2)} }`
  );
};

const paragraphSpaceCss = () => {
  return `.preview h2 { margin-top: ${styles.paragraphSpace}px }`;
};

const fontFamilyCss = () => {
  const fontEN = styles.fontEN.fontFamily || styles.fontEN.name;
  const fontCN = styles.fontCN.fontFamily || styles.fontCN.name;
  return `.preview { font-family: ${fontEN}, ${fontCN} }`;
};

const fontSizeCss = () => {
  return `.preview { font-size: ${styles.fontSize}px }`;
};

const paperCss = () => {
  return (
    `.preview-page { width: ${PAPER[styles.paper].w}mm }` +
    `.preview { width: ${getPreviewW(styles.paper)}px }` +
    `@media print { @page { size: ${styles.paper}; } }`
  );
};

// Copied from https://github.com/vitejs/vite/blob/main/packages/vite/src/client/client.ts
const supportsConstructedSheet = (() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})();

let styleSheet = undefined as CSSStyleSheet | HTMLStyleElement | undefined;

// Borrowed from https://github.com/vitejs/vite/blob/main/packages/vite/src/client/client.ts
export const updateStyles = () => {
  const content =
    pageMarginCss() +
    fontFamilyCss() +
    fontSizeCss() +
    themeColorCss() +
    paragraphSpaceCss() +
    lineHeightCss() +
    paperCss();

  if (supportsConstructedSheet) {
    // Use constructed sheet if supported
    if (styleSheet && !(styleSheet instanceof CSSStyleSheet)) {
      styleSheet = undefined;
    }

    if (!styleSheet) {
      styleSheet = new CSSStyleSheet();
      // @ts-expect-error: using experimental API
      styleSheet.replaceSync(content);
      // @ts-expect-error: using experimental API
      document.adoptedStyleSheets = [
        // @ts-expect-error: using experimental API
        ...document.adoptedStyleSheets,
        styleSheet
      ];
    } else {
      // @ts-expect-error: using experimental API
      styleSheet.replaceSync(content);
    }
  } else {
    // Use <style> element on browsers that don't support constructed sheet
    if (styleSheet && !(styleSheet instanceof HTMLStyleElement)) {
      styleSheet = undefined;
    }

    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.setAttribute("type", "text/css");
      styleSheet.innerHTML = content;
      document.head.appendChild(styleSheet);
    } else {
      styleSheet.innerHTML = content;
    }
  }
};