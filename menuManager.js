/** --- Menu Visibility Manager ----------------------------------------------- *
 * mpc_menuManager 1.0.3
 * @copyright 2025 Mootly Obviate -- See /LICENSE.md
 * @license   MIT
 * @version   1.0.3
 * ---------------------------------------------------------------------------- *
 *  Automates accordion menus and hiding menus under icons for mobile devices.
 *  For usability reasons, menus should start open then by script.
 *  So, if script doesn't fire, all menu items still accessible.
 * -----
 *  Tasks:
 *  - Flag the current page.
 *  - Close all accordion menus specified as closed on load.
 *  - Set click listener for submenu headers.
 *  - Set focus listeners for submenu sections.
 *  - Set click listener for mobile menu icons.
 *  - Set click listener for mobile menus.
 * -----
 * ### Constructor Arguments
 *
 * name       | default   | description
 * ----       | ----      | -----------
 * pOpen      | 'open'    | Class to flag header as open.
 * pClosed    | 'closed'  | Class to flag header as closed.
 * pHidden    | 'hidden'  | Class to hide menu.
 * pVisible   | 'show'    | Class to show menu.
 * pActive    | 'active'  | Class to flag current page in menu.
 * pKeepIndex | false     | Whether to keep default filenames when comparing
 *            |           | filenames to links to matche active page.
 *
 * ### init_menu Method Arguments
 *
 * name            | default             | description
 * ----            | -------             | -----------
 * pAllContainers  | '.nav-subcontainer' | Class for container with submenu.
 * pBody           | '.nav-sublist'      | Class for submenu.
 * pHeader         | '.nav-subheader'    | Class for header for submenu.
 * pInitContainers | pAllContainers      | CSS selector for elements to start
 *                 |                     | collapsed.
 *
 * If you don't specify which containers should start collapsed, code defaults
 * to collapsing the elements specifeid by `pAllContainers`.
 *
 * ### init_mobile Method Arguments
 *
 * name       | default  | description
 * ---------- | -------- | ---------------------------------------------------
 * pBody      | null     | ID of the element to collapse.
 * pTrigger   | mull     | ID of the toggle button for the collapsing element.
 * pContainer | mull     | ID of the container of the two above, if needed.
 *
 * --- Revision History ------------------------------------------------------- *
 * 2025-05-14 | Corrected open state icon on load.
 * 2025-04-23 | Added exit when no submenus to process.
 * 2025-03-10 | Changed Load to DOMContentLoaded handler to avoid edge cases.
 *            | Note: This might create different edge cases for this script.
 * 2025-02-27 | New TypeScript-compliant version.
 * ---------------------------------------------------------------------------- */
class mpc_menuManager {
  // ******************************************************** *
  // Constructor                                              *
  // - Init classes we will be using                          *
  // - Check to exclude index/default files from pathing      *
  // These are set here to enforce consistent coding.         *
  // -------------------------------------------------------- *
  constructor(pOpen = 'open', pClosed = 'closed', pHidden = 'hidden', pVisible = 'show', pActive = 'active', pKeepIndex = false) {
    // Set some listeners up front.                             *
    // Add click toggle to avoid conflict with focus events.    *
    this.mouseTrigger = false;
    this.openClass = pOpen;
    this.closedClass = pClosed;
    this.hiddenClass = pHidden;
    this.visibleClass = pVisible;
    this.hiddenMobi = 'mobile-' + pHidden;
    this.visibleMobi = 'mobile-' + pVisible;
    this.activeClass = pActive;
    this.keepTheIndex = pKeepIndex;
    window.addEventListener('mousedown', () => { this.mouseTrigger = true; });
    window.addEventListener('mouseup', () => { this.mouseTrigger = false; });
  }
  // ******************************************************** *
  // State Change method handles the flip flip                *
  // Accept: open, close, toggle                              *
  // Assume element definitions were set up in init methods.  *
  // -------------------------------------------------------- *
  state_change(pState = null, pType = null, pElement = null, pTrigger = null, pBody = null) {
    let elContainer = pElement;
    let elHeader = pTrigger;
    let elBody = pBody;
    let oldState = '';
    let newState = '';
    let hiddenState = '';
    let visibleState = '';
    if (!pTrigger) {
      elHeader = elContainer.querySelector(this.opTrigger);
      elBody = elContainer.querySelector(this.opBody);
    }
    if (pType == 'mobile') {
      hiddenState = this.hiddenMobi;
      visibleState = this.visibleMobi;
    }
    else {
      hiddenState = this.hiddenClass;
      visibleState = this.visibleClass;
    }
    if (pState == 'toggle') {
      elContainer?.classList.toggle(this.openClass);
      elContainer?.classList.toggle(this.closedClass);
      elHeader?.classList.toggle(this.openClass);
      elHeader?.classList.toggle(this.closedClass);
      elBody?.classList.toggle(visibleState);
      elBody?.classList.toggle(hiddenState);
    }
    else if (pState) {
      if (pState == 'open') {
        oldState = this.closedClass;
        newState = this.openClass;
        elBody?.classList.add(visibleState);
        elBody?.classList.remove(hiddenState);
      }
      else {
        oldState = this.openClass;
        newState = this.closedClass;
        elBody?.classList.remove(visibleState);
        elBody?.classList.add(hiddenState);
      }
      elContainer?.classList.add(newState);
      elContainer?.classList.remove(oldState);
      elHeader?.classList.add(newState);
      elHeader?.classList.remove(oldState);
    }
  }
  // ******************************************************** *
  // Initialize Menu method                                   *
  // Set listeners for accordion menu sections.               *
  // Accepts CSS selectors for:                               *
  // - Class for container of the submenu                     *
  // - Class for accordion body                               *
  // - Class for accordion header                             *
  // - Selector for containers to close to start              *
  //   e.g., .container-class:not(.exclusion-class)           *
  // -------------------------------------------------------- *
  init_menu(pAllContainers = '.nav-subcontainer', pBody = '.nav-sublist', pHeader = '.nav-subheader', pInitContainers = null) {
    this.opBlock = pAllContainers;
    this.opTrigger = pHeader;
    this.opBody = pBody;
    this.op2Init = pInitContainers ?? pAllContainers;
    window.addEventListener('DOMContentLoaded', () => {
      this.menuElems2Close = document.querySelectorAll(this.op2Init);
      this.menuElemsAll = document.querySelectorAll(this.opBlock);
      // Flag current page in side menu                           *
      // Strip default index cases                                *
      const defName = '/((index)|(default))\.\w{2,4}/g';
      let tParseLoc = ((this.keepTheIndex) || (location.pathname.search(defName) == -1))
        ? location.pathname
        : location.pathname.slice(0, location.pathname.search(defName));
      // if no menu, exit to prevent console clutter              *
      if (this.menuElemsAll.length < 1)
        return;
      let tCurrMenu = this.menuElemsAll[0] ? this.menuElemsAll[0].closest('nav') : null;
      let tTargLink = tCurrMenu.querySelector('[href="' + tParseLoc + '"]');
      if (tTargLink) {
        tTargLink.parentElement.classList.add(this.activeClass);
      }
      // close menu sections on page load                         *
      this.menuElems2Close?.forEach((el) => {
        if (!(el.querySelector('.active'))) {
          el.classList.remove(this.openClass);
          el.classList.add(this.closedClass);
          el.querySelector(pBody).classList.add(this.hiddenClass);
        }
        else {
          el.classList.add(this.openClass);
          el.classList.remove(this.closedClass);
        }
      });
      // make sure menu headers can be tabbed to                  *
      // set click listener and focus listeners                   *
      this.menuElemsAll?.forEach((el) => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', (ev) => {
          let elObj = ev.target.parentNode;
          this.state_change('toggle', 'submenu', elObj);
        });
        el.addEventListener('focusin', (ev) => {
          if (!this.mouseTrigger) {
            let elObj = (!(ev.target.matches(pAllContainers)))
              ? ev.target.closest(pAllContainers)
              : ev.target;
            this.state_change('open', 'submenu', elObj);
          }
        });
        el.addEventListener('focusout', (ev) => {
          let elObj = ev.target;
          if (!(this.mouseTrigger) && !(el.querySelector('.active'))) {
            let elObj = (!(ev.target.matches(pAllContainers)))
              ? ev.target.closest(pAllContainers)
              : ev.target;
            this.state_change('close', 'submenu', elObj);
          }
        });
      });
    });
  }
  // ******************************************************** *
  // Initialize Mobile Menu Triggers method                   *
  // Set listeners for mobile menu triggers.                  *
  // Can be used for any icon + collapser.                    *
  // Each must be set individually using this method.         *
  // Accepts CSS selectors (assume IDs) for:                  *
  // - Element to hide/unhide                                 *
  // - Trigger icon or element.                               *
  // -------------------------------------------------------- *
  init_mobile(pBody = null, pTrigger = null, pAddMobile = true, pContainer = null) {
    window.addEventListener('DOMContentLoaded', () => {
      let useMobile = pAddMobile ? 'mobile' : 'menu';
      let elTrigger = pTrigger ? document.querySelector(pTrigger) : null;
      let elBody = pBody ? document.querySelector(pBody) : null;
      let elContainer = pContainer ? document.querySelector(pContainer) : null;
      elTrigger?.addEventListener('click', () => {
        this.state_change('toggle', 'mobile', elContainer, elTrigger, elBody);
      });
      elBody?.addEventListener('focusin', () => {
        if (!this.mouseTrigger) {
          this.state_change('open', useMobile, elContainer, elTrigger, elBody);
        }
      });
      elBody?.addEventListener('focusout', () => {
        if (!this.mouseTrigger) {
          this.state_change('close', useMobile, elContainer, elTrigger, elBody);
        }
      });
    });
  }
}
/*! --- Copyright (c) 2025 Mootly Obviate -- See /LICENSE.md ------------------ */
