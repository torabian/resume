/**
 * The single list of demo pages, shared by the sidebar's GITHUB_DEMO menu
 * (Sidebar.tsx), the in-page demo index (DemoScreen.tsx, in src/demo), and
 * the demo route table (DemoRoutes.tsx, in src/demo) - so a demo page only
 * ever needs to be added here to show up in all three at once.
 *
 * `labelKey` indexes into strings-en/fa/pl.yml's `components` map (via
 * `s.components[item.labelKey]`), so every consumer renders a translated
 * label. `demo` itself (the index/menu page) is deliberately not part of
 * this list - it's the page that lists every entry here, not one of them.
 */
export interface DemoMenuItem {
  href: string;
  labelKey: string;
  icon: string;
}

export const demoMenuItems: DemoMenuItem[] = [
  {
    href: "/demo/form-select",
    labelKey: "formSelect",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/jsf",
    labelKey: "formJsf",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-date",
    labelKey: "formDateTime",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/modals",
    labelKey: "overlaysAndModal",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-button",
    labelKey: "formButton",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-child",
    labelKey: "formChild",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-currency",
    labelKey: "formCurrency",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-richtext",
    labelKey: "formRichText",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-switch",
    labelKey: "formSwitch",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-text",
    labelKey: "formText",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-tstring",
    labelKey: "formTString",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/form-uploader",
    labelKey: "formUploader",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/forms",
    labelKey: "forms",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/backup",
    labelKey: "backup",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/abac",
    labelKey: "abac",
    icon: "/ios-theme/icons/settings.svg",
  },
  {
    href: "/demo/storage",
    labelKey: "storage",
    icon: "/ios-theme/icons/settings.svg",
  },
];
