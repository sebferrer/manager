import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';

import Account from './Account';
import Brand from './Brand';
import Hamburger from './HamburgerMenu';
import style from './navbar.module.scss';
import Search from './Search';
import { fetchUniverses, getBrandURL, Universe } from './service';
import Universes from './Universes';

import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import { useShell } from '@/context';
import { useHeader } from '@/context/header';

type Props = {
  environment: Environment;
};

function Navbar({ environment }: Props): JSX.Element {
  const shell = useShell();
  const environmentPlugin = shell.getPlugin('environment');
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );

  const [universes, setUniverses] = useState<Universe[]>([]);
  const [searchURL] = useState<string>();
  const [currentUniverse, setCurrentUniverse] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { setIsNotificationsSidebarVisible } = useHeader();

  useEffect(() => {
    let mounted = true;
    environmentPlugin.onUniverseChange(() => {
      setCurrentUniverse(environment.getUniverse());
    });

    fetchUniverses().then((u) => mounted && setUniverses(u));
    return () => {
      mounted = false;
    };
  }, []);

  const brandClickHandler = () =>
    shell.getPlugin('tracking').trackClick({
      name: `navbar::entry::logo`,
      type: 'action',
    });

  const universeClickHandler = ({ universe }: Partial<Environment>) =>
    shell.getPlugin('tracking').trackClick({
      name: `navbar::entry::${universe}`,
      type: 'action',
    });

  return (
    <>
      <div
        className={`${modalStyle.popoverClickAway} ${
          isDropdownOpen ? '' : modalStyle.hidden
        }`}
      ></div>
      <div className={`oui-navbar ${style.navbar}`}>
        <Hamburger universe={currentUniverse} universes={universes} />
        <Brand targetURL={getBrandURL(universes)} onClick={brandClickHandler} />
        <Universes
          universe={currentUniverse}
          universes={universes}
          onClick={universeClickHandler}
        />
        <div
          className={`oui-navbar-list oui-navbar-list_aside oui-navbar-list_end ${style.aside}`}
        >
          {searchURL && (
            <div className="oui-navbar-list__item">
              <Search targetURL={searchURL} />
            </div>
          )}
          <div className="oui-navbar-list__item">
            <NavReshuffleSwitchBack
              onChange={(show: boolean) => {
                setIsDropdownOpen(show);
                setIsNotificationsSidebarVisible(false);
              }}
            />
          </div>
          <div className="oui-navbar-list__item">
            <LanguageMenu
              setUserLocale={setUserLocale}
              userLocale={userLocale}
              onChange={(show: boolean) => {
                setIsDropdownOpen(show);
                setIsNotificationsSidebarVisible(false);
              }}
            ></LanguageMenu>
          </div>
          <div className="oui-navbar-list__item">
            <Notifications />
          </div>
          <Account user={environment.getUser()} />
        </div>
      </div>
    </>
  );
}

export default Navbar;
