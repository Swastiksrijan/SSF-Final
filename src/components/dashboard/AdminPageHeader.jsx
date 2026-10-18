import HeaderBanner from "./HeaderBanner";

/* Shared premium header for the Admin Panel.
 *
 * It reuses the exact visual identity already used by the User Portal — the
 * same gradient plate and diagonal ribbons come from HeaderBanner, so there is
 * one source of truth for the design. What this adds is the admin-specific
 * layout: the real page title, a breadcrumb row and the page's existing action
 * buttons on the right. It is purely presentational and holds no state, so
 * swapping it in cannot affect data, routes or permissions.
 */
export default function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumb = [],
  icon,
  action,
  secondaryAction,
  strip,
  children,
}) {
  return (
    <div className="space-y-3">
      {strip}
      <HeaderBanner
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        titleAs="h2"
        leading={
          icon ? (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white ring-2 ring-white/30 backdrop-blur-sm">
              {icon}
            </div>
          ) : null
        }
        badges={
          breadcrumb.length ? (
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
              {breadcrumb.map((crumb, index) => (
                <span key={`${crumb}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 && <span className="text-white/40">/</span>}
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                      index === breadcrumb.length - 1
                        ? "bg-white/20 text-white ring-white/25"
                        : "bg-white/10 text-white/80 ring-white/15"
                    }`}
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          ) : null
        }
        action={action}
        secondaryAction={secondaryAction}
      >
        {children}
      </HeaderBanner>
    </div>
  );
}
