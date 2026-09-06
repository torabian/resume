# @fireback/overlay

A queue-based modal/drawer overlay system for React: `openModal`/`openDrawer`
return a promise-based controller (`resolve`/`reject`/`close`), overlays
stack, Escape closes the top one, and a couple of common confirm dialogs
ship out of the box.

It has no dependency on the rest of fireback and only lists `react` as a
peer dependency, so it can be published and used standalone in any React
project.

## Two entry points

- **`@fireback/overlay`** (core) — the overlay state machine, its types,
  and the `useS` translation-string picker. No DOM, no CSS, no
  `react-dom`. Safe to use as-is on React Native: bring your own
  `BaseModalWrapper`/`OverlayWrapper` built from RN's `Modal`/animated
  `View`.
- **`@fireback/overlay/dom`** — ready-made web (DOM) chrome for both:
  a Bootstrap-style `.modal` (`OverlayBaseModal`) and a sliding drawer built
  on `react-modern-drawer` (`OverlayDrawerImp`), plus a `DomOverlayProvider`
  convenience wrapper and `commonDialogs` (confirm modal/drawer helpers).

This split exists so a React Native app pulling in `@fireback/overlay`
never drags in web-only packages (`react-modern-drawer`, `classnames`) or
DOM assumptions (`window`, `div`/`button`).

## Install

```sh
npm install @fireback/overlay
```

## Web usage

```tsx
import { DomOverlayProvider, commonDialogs } from "@fireback/overlay/dom";
import { useOverlay } from "@fireback/overlay";
// `@fireback/overlay/dom` already imports react-modern-drawer's CSS itself -
// your bundler (Vite, webpack, ...) will pick it up as long as it processes
// CSS imports found inside dependencies, same as any other component
// library that ships its own styles. Nothing to import yourself here.

function App() {
  return (
    <DomOverlayProvider locale={currentLocale} translations={myOverlayStrings}>
      <MyPage />
    </DomOverlayProvider>
  );
}

function MyPage() {
  const { openModal } = useOverlay();
  const { confirmModal } = commonDialogs(myOverlayStrings);

  const onDelete = async () => {
    const result = await confirmModal({
      title: "Delete item",
      description: "Are you sure?",
    }).promise;
    if (result.type === "resolved") {
      // proceed
    }
  };

  return <button onClick={onDelete}>Delete</button>;
}
```

## Translation strings

Nothing is imported from a global i18n catalog. `OverlayProvider` (and
therefore `DomOverlayProvider`) takes a plain `translations` object (see
`OverlayTranslations`: `{ close, confirm, cancel }`) and a `locale` string,
and forwards both down to every overlay/wrapper component. `useS` (this
package's own, dependency-free copy of the same convention used elsewhere
in fireback) picks a per-locale override when one is present:

```ts
const translations = {
  close: "Close",
  confirm: "Confirm",
  cancel: "Cancel",
  $fr: { close: "Fermer", confirm: "Confirmer", cancel: "Annuler" },
};
```

## React Native usage

```tsx
import { OverlayProvider, useOverlay } from "@fireback/overlay";
import { Modal, View, Text, Pressable } from "react-native";

const RNModal = ({ children, visible, close, params }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.backdrop}>
      <View style={styles.box}>
        <Text>{params?.title}</Text>
        {children}
        <Pressable onPress={close}><Text>Close</Text></Pressable>
      </View>
    </View>
  </Modal>
);

const RNDrawer = (/* ... an Animated.View sliding in from an edge ... */) => null;

<OverlayProvider BaseModalWrapper={RNModal} OverlayWrapper={RNDrawer}>
  <App />
</OverlayProvider>;
```

Only import from `@fireback/overlay` (the "." entry) in a React Native app -
never `@fireback/overlay/dom`. `./dom` renders plain `<div>`/`<button>` and
pulls in `react-modern-drawer`, neither of which exist on real native (they
only work under `react-native-web`). Metro/bundlers that understand
conditional `exports` (Metro's `unstable_enablePackageExports`, most modern
RN/Expo setups) will refuse to resolve `./dom` under the `"react-native"`
condition outright (`package.json` maps it to `null` there) rather than
silently pulling in web-only code that would crash at runtime; older
resolvers that ignore `exports` conditions entirely won't get that guard, so
this is a "belt", not a substitute for not importing it.

`react-modern-drawer`/`classnames` are still regular `dependencies` of this
package (npm has no way to scope a dependency to one subpath export), so
they land in `node_modules` either way - harmless, since Metro only bundles
what's actually reachable from your import graph and a React Native app
never imports `./dom`.

## Building / publishing

```sh
npm run build   # tsup -> dist/{index,dom/index}.{mjs,cjs,d.ts}
npm publish
```
