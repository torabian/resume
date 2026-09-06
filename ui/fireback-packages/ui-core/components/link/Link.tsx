import { RouterLink, useRouter } from "../../hooks/useRouter";

const Link = ({
  children,
  isActive,
  skip,
  activeClassName,
  inActiveClassName,
  ...rest
}: any) => {
  const router = useRouter();

  // Bug fix: this used to prepend "/${locale}" to every href (routes used to
  // be wrapped in a ":locale" segment - see EssentialRouter.tsx/App.tsx's own
  // history for why that's gone), so hrefs are used exactly as given now.
  let href: string = rest?.href || router?.asPath || "";

  if (isActive) {
    rest.className = `${rest.className || ""} ${activeClassName || "active"}`;
  }

  if (!isActive && inActiveClassName) {
    rest.className = `${rest.className || ""} ${inActiveClassName}`;
  }

  return (
    <RouterLink {...rest} href={href}>
      {children}
    </RouterLink>
  );
};

export default Link;
