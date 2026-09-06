import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  type DrawerOpenParams,
  type OverlayInstanceComponentProps,
} from "@fireback/overlay";

/**
 * Web (DOM) implementation of a "drawer"-type overlay's chrome, backed by
 * `react-modern-drawer`. Pass this as
 * `<OverlayProvider OverlayWrapper={OverlayDrawerImp} .../>` in a browser
 * app; a React Native app would supply its own equivalent (e.g. an
 * animated `View` sliding in from an edge) instead.
 */
export const OverlayDrawerImp = ({
  params,
  children,
  visible,
  close,
}: OverlayInstanceComponentProps<unknown, DrawerOpenParams | undefined>) => {
  return (
    <Drawer
      open={visible}
      direction={params?.direction || "right"}
      zIndex={10000}
      onClose={close}
      duration={params?.speed}
      size={params?.size}
    >
      {children}
    </Drawer>
  );
};
