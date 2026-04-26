import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HashLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Target like "/#products" or "#products" */
  to: string;
  /** Called after navigation/scroll runs (used by the mobile menu to close itself) */
  onNavigate?: () => void;
}

/**
 * Anchor link that works with React Router. Behavior:
 *  - If already on the target route, smooth-scrolls to the element with the hash id.
 *  - If on a different route, navigates first, then scrolls once the page mounts.
 *
 * Keeping this as its own component means future routes can drop in scroll-to-section
 * links without each one re-implementing the logic.
 */
export const HashLink = forwardRef<HTMLAnchorElement, HashLinkProps>(function HashLink(
  { to, onNavigate, onClick, children, ...rest },
  ref
) {
  const location = useLocation();
  const navigate = useNavigate();

  // Split "/#products" -> pathname="/", hash="#products"
  const hashIndex = to.indexOf('#');
  const pathname = hashIndex === 0 ? location.pathname : to.slice(0, hashIndex) || '/';
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : '';

  const scrollToHash = () => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let modifier-clicks (open in new tab, etc.) work normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();

    if (pathname === location.pathname) {
      scrollToHash();
    } else {
      navigate(`${pathname}${hash}`);
      // Wait for the new route to render, then scroll.
      window.setTimeout(scrollToHash, 50);
    }
    onNavigate?.();
  };

  return (
    <Link ref={ref} to={`${pathname}${hash}`} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
