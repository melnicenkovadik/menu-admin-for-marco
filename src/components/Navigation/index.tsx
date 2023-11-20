import useTranslation from '../../hooks/useTranslation';
import { ActiveLink } from '../ActiveLink';

type Props = {
  className?: string;
};

export default function Navigation({ className }: Props) {
  const { t, locale } = useTranslation();
  const navClass = className || 'navigation';

  return (
    <nav className={navClass}>
      <ul>
        <li>
          <ActiveLink href={`/`} activeClassName="active">
            <span>{t('home')}</span>
          </ActiveLink>
        </li>
        <li>
          <ActiveLink
            href={`/${locale}/about`}
            activeClassName="active"
          >
            <span>{t('about')}</span>
          </ActiveLink>
        </li>
        <li>
          <ActiveLink
              href={`/${locale}/admin`}
              activeClassName="active"
          >
            <span>Admin Panel</span>
          </ActiveLink>
        </li>
      </ul>
    </nav>
  );
}
