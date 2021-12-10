import Shell from '../../shell/shell';
import Sidebar from './components/sidebar';
import Navbar, { INavbar } from './components/navbar';

export interface ISidebars {
  [name: string]: Sidebar;
}

interface IShellUx {
  registerSidebar: (sidebarName: string) => void;
  isSidebarVisible: (sidebarName: string) => boolean;
  toggleSidebarVisibility: (sidebarName: string) => void;
  showSidebar: (sidebarName: string) => void;
  hideSidebar: (sidebarName: string) => void;
  registerNavbar: () => void;
}

export class ShellUX implements IShellUx {
  private shell: Shell;

  private navbar: INavbar;

  private sidebars: ISidebars = {};

  constructor(shell: Shell) {
    this.shell = shell;
  }

  registerSidebar(sidebarName: string): void {
    this.sidebars[sidebarName] = new Sidebar();
    this.shell.emitEvent('ux:sidebar-register', { sidebarName });
  }

  isSidebarVisible(sidebarName: string): boolean {
    return this.sidebars[sidebarName]?.getVisibility() || false;
  }

  toggleSidebarVisibility(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar?.isToggleAllowed()) {
      registeredSidebar.toggleVisibility();
      if (this.isSidebarVisible(sidebarName)) {
        this.shell.emitEvent('ux:sidebar-show', { sidebarName });
      } else {
        this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
      }
    }
  }

  showSidebar(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar) {
      registeredSidebar.show();
      this.shell.emitEvent('ux:sidebar-show', { sidebarName });
    }
  }

  hideSidebar(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar) {
      registeredSidebar.hide();
      this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
    }
  }

  registerNavbar(): void {
    this.navbar = Navbar();
    this.shell.emitEvent('ux:navbar-register', {});
  }

  getNavbar(): INavbar {
    return this.navbar;
  }
}
