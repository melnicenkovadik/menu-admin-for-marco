import useTranslation from '../../hooks/useTranslation';
import { ActiveLink } from '../ActiveLink';
import { useRouter } from 'next/router';

type Props = {
  className?: string;
};

export default function Navigation({ className }: Props) {
  const { t, locale } = useTranslation();
  const navClass = className || 'navigation';
  const router = useRouter();
  const isPrivateRoute = router.pathname !== '/';

  return (
    <nav className={navClass}>
      {
        isPrivateRoute ? (
          <ul>
            <li>
              <ActiveLink href={`/`} activeClassName='active'>
                <span>{t('home')}</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink
                href={`/${locale}/admin`}
                activeClassName='active'
              >
                <span>
                  {t('admin')}
                </span>
              </ActiveLink>
            </li>
          </ul>
        ) : null
      }

    </nav>
  );
}
