import { Link as NextLink } from 'next/link';
import { ROUTES, RouteKeys } from '@/routes/routes';

interface LinkProps {
  to: RouteKeys;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  params,
  children,
  className,
}) => {
  const path = typeof ROUTES[to] === 'function'
    ? ROUTES[to](params?.id || '')
    : ROUTES[to];

  return (
    <NextLink href={path} className={className}>
      {children}
    </NextLink>
  );
};
