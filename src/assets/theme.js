import { DARK_COLOR } from "./colors";

export const Theme = {
  colors: {
    brand: [
      {
        alias: "primary",
        value: "#00B67D"
      },
      {
        alias: "secondary",
        value: "#FF6A00"
      }
    ],
    text: {
      main: "#202020",
      link: "#00B67D",
      alt: "#666666",
      inv: "#FFFFFF"
    },
    fill: {
      main: "#F7F4EF",
      alt: "#DDDAD4",
      inv: "#FFFFFF",
      invAlt: "#D8D8D8",
      debug: "rgba(0,153,255,0.25)"
    },
    status: {
      info: "#0277BD",
      success: "#00B67D",
      failure: "#D50000"
    },
    overlay: {
      dark: "rgba(32,32,32,0.64)",
      medium: "rgba(32,32,32,0.32)",
      light: "rgba(32,32,32,0.08)"
    }
  },
  fontFamilies: {
    main: "Avenir Next,system-ui,sans-serif",
    code: "SFMono-Regular,Consolas,Menlo,monospace"
  },
  fontSizes: {
    base: {
      xs: 12,
      sm: 14,
      md: 16,
      main: 16,
      h3: 24,
      h2: 28,
      h1: 32
    },
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    main: "1rem",
    h3: "1.5rem",
    h2: "1.75rem",
    h1: "2rem"
  },
  fontWeights: {
    normal: 400,
    bold: 700
  },
  lineHeights: [
    {
      alias: "single",
      value: 1
    },
    {
      alias: "heading",
      value: 1.25
    },
    {
      alias: "main",
      value: 1.5
    }
  ],
  sizes: [
    {
      alias: "zero",
      value: 0
    },
    {
      alias: "fill",
      value: "100%"
    },
    {
      alias: "icon",
      value: 24
    },
    {
      alias: "xs",
      value: 16
    },
    {
      alias: "sm",
      value: 32
    },
    {
      alias: "md",
      value: 40
    },
    {
      alias: "lg",
      value: 48
    },
    {
      alias: "xl",
      value: 64
    }
  ],
  borderRadii: [
    {
      alias: "none",
      value: 0
    },
    {
      alias: "fill",
      value: "100%"
    },
    {
      alias: "icon",
      value: 12
    },
    {
      alias: "xs",
      value: 4
    },
    {
      alias: "sm",
      value: 16
    },
    {
      alias: "md",
      value: 20
    },
    {
      alias: "lg",
      value: 24
    }
  ],
  borders: {
    divider: "1px solid",
    button: "2px solid",
    input: "2px solid"
  },
  outlines: {
    main: "3px solid rgba(64,128,255,0.8)"
  },
  outlineOffsets: {
    main: 0,
    outer: 3,
    inner: -3
  },
  boxShadows: [
    {
      alias: "sm",
      value: "0 2px 4px rgba(0,0,0,0.08)"
    },
    {
      alias: "lg",
      value: "0 2px 16px rgba(0,0,0,0.5)"
    }
  ],
  colorStyles: {
    main: {
      background: "fill.main",
      color: "text.main"
    }
  },
  textStyles: {
    heading: {
      fontFamily: "main",
      fontWeight: "bold",
      lineHeight: "heading"
    },
    main: {
      fontFamily: "main",
      fontWeight: "normal",
      lineHeight: "main"
    },
    code: {
      fontFamily: "code"
    },
    caps: {
      fontWeight: "bold",
      textTransform: "uppercase"
    }
  },
  buttonStyles: [
    {
      alias: "primary",
      value: {
        minWidth: "150px",
        alignItems: "center",
        border: "none",
        boxShadow:
          "0 -4px 0 rgba(0,0,0,0.32) inset, 0 2px 4px rgba(0,0,0,0.16)",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "inline-flex",
        fontSmoothing: "antialiased",
        justifyContent: "center",
        lineHeight: "single",
        textStyle: "caps",
        userSelect: "none",
        verticalAlign: "bottom",
        fill: "text.inv",
        color: "text.inv",
        background: "brand.primary",
        ":hover": {
          background: "#08C98D"
        },
        ":active": {
          background: "brand.primary"
        }
      }
    },
    {
      alias: "secondary",
      value: {
        alignItems: "center",
        border: "none",
        boxShadow: "none",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "inline-flex",
        fontSmoothing: "antialiased",
        justifyContent: "center",
        lineHeight: "single",
        textStyle: "caps",
        userSelect: "none",
        verticalAlign: "bottom",
        background: "overlay.light",
        color: "brand.primary",
        fill: "brand.primary",
        ":hover": {
          background: "rgba(0,0,0,0.12)"
        },
        ":active": {
          background: "overlay.light"
        }
      }
    },
    {
      alias: "alternative",
      value: {
        minWidth: "150px",
        alignItems: "center",
        border: "none",
        boxShadow: "none",
        boxSizing: "border-box",
        cursor: "initial",
        display: "inline-flex",
        fontSmoothing: "antialiased",
        justifyContent: "center",
        lineHeight: "single",
        textStyle: "caps",
        userSelect: "none",
        verticalAlign: "bottom",
        background: DARK_COLOR,
        color: DARK_COLOR,
        filter: "brightness(0.95)",
        ":hover": {
          background: DARK_COLOR
        },
        ":active": {
          background: DARK_COLOR
        }
      }
    }
  ],
  globalStyles: {
    "*": {
      outline: "none",
      WebkitTapHighlightColor: "rgba(0,0,0,0)"
    },
    "html,button": {
      color: "text.main",
      fontSize: "base.main",
      textStyle: "main"
    },
    "@media(min-width:360px)": {
      "html,button": {
        fontSize: "18px"
      }
    },
    "@media(min-width:720px)": {
      "html,button": {
        fontSize: "20px"
      }
    },
    "h1,h2,h3,h4,h5,h6,p": {
      margin: 0,
      marginBottom: "1rem"
    },
    "h1,h2,h3,h4,h5,h6": {
      textStyle: "heading"
    },
    h1: {
      fontSize: "h1"
    },
    h2: {
      fontSize: "h2"
    },
    h3: {
      fontSize: "h3"
    },
    "pre,code": {
      textStyle: "code",
      margin: 0
    },
    code: {
      fontSize: "85%",
      borderRadius: "xs",
      background: "overlay.light",
      padding: "0.2em 0.4em"
    },
    "b,strong": {
      fontWeight: "bold"
    },
    blockquote: {
      margin: "1rem 0"
    },
    a: {
      color: "text.link",
      textDecoration: "none"
    },
    "ol,ul": {
      listStyle: "disc inside none",
      padding: 0,
      margin: 0
    },
    "ol ol,ul ul": {
      listStyleType: "disc",
      marginLeft: "1.5rem"
    },
    button: {
      buttonStyle: "primary",
      borderRadius: "lg",
      fontSize: "base.md",
      height: "lg",
      paddingX: "32px"
    }
  },
  components: {
    box: {
      main: {
        background: "fill.main"
      },
      alt: {
        background: "fill.alt"
      },
      modal: {
        background: "fill.main",
        borderRadius: "lg",
        boxShadow: "lg"
      }
    },
    text: {
      main: {
        textStyle: "main"
      },
      code: {
        textStyle: "code"
      },
      caps: {
        textStyle: "caps"
      }
    },
    heading: {
      h1: {
        fontSize: "h1",
        textStyle: "heading"
      },
      h2: {
        fontSize: "h2",
        textStyle: "heading"
      },
      h3: {
        fontSize: "h3",
        textStyle: "heading"
      }
    },
    button: [
      {
        alias: "primary",
        value: {
          buttonStyle: "primary"
        }
      },
      {
        alias: "secondary",
        value: {
          buttonStyle: "secondary"
        }
      },
      {
        alias: "alternative",
        value: {
          buttonStyle: "alternative"
        }
      }
    ]
  }
};
