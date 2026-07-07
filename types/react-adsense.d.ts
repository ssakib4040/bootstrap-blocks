declare module "react-adsense" {
  import type { CSSProperties, ComponentType } from "react";

  interface GoogleProps {
    className?: string;
    style?: CSSProperties;
    client: string;
    slot: string;
    layout?: string;
    layoutKey?: string;
    format?: string;
    responsive?: string;
  }

  const AdSense: {
    Google: ComponentType<GoogleProps>;
  };

  export default AdSense;
}
