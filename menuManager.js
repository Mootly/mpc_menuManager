/** --- Jump to Top Link Generator -------------------------------------------- *
 * mpc_menuManager 1.0.0
 * @copyright 2025 Mootly Obviate -- See /LICENSE.md
 * @license   MIT
 * @version   1.0.0
 * ---------------------------------------------------------------------------- *
 *  Automates accordion menus and hiding menus under icons for mobile devices.
 *  For usability reasons, menus should start open then by script.
 *  So, if script doesn't fire, all menu items still accessible.
 * -----
 *  Tasks:
 *  - Close all accordion menus specified as close.
 *  - Set click listeter for submenu headers.
 *  - Set focus listeners for submenu sections.
 *  - Set click listener for mobile menu icons.
 * -----
 *  User set flags - Most of these are best declared at the template level
 *  Flag            | Default           |
 *  top_container   | 'page-body'       | The element to delimit the search.
 *  top_addTags     | 'h2'              | Comma separate list of elements to
 *                  |                   | receive top links.
 *  top_topID       | 'top'             | Default top id.
 *  top_skipFirst   | true              | Skip top link on first heading.
 *  top_exclude     | 'dl, #toc-links,  | Comma separated list of parent
 *                  | .skip-toplink'    | containers to exclude.
 *  top_auto        | true              | Automatically add tags or
 *                  |                   | wait for manual execution.
 * --- Revision History ------------------------------------------------------- *
 * 2025-02-27 | New TypeScript-compliant version.
 * ---------------------------------------------------------------------------- */
class mpc_menuManager {
  constructor(pOpen = 'open', pClosed = 'closed', pHidden = 'hidden') {
    // Set some listeners up front.                             *
    // Add click toggle to avoid conflict with focus events.    *
    this.mouseTrigger = false;
    this.openClass = pOpen;
    this.closedClass = pClosed;
    this.hiddenClass = pHidden;
    window.addEventListener('mousedown', () => { this.mouseTrigger = true; });
    window.addEventListener('mouseup', () => { this.mouseTrigger = false; });
  }
  state_change(pState = null, pElement = null) {
    let elHeader = (pElement.querySelector(this.opTrigger));
    let elBody = (pElement.querySelector(this.opBody));
    let oldState = '';
    let newState = '';
    if (pState == 'toggle') {
      pElement.classList.toggle(this.openClass);
      elHeader.classList.toggle(this.closedClass);
      elBody.classList.toggle(this.hiddenClass);
    }
    else if (pState) {
      if (pState == 'open') {
        oldState = this.closedClass;
        newState = this.openClass;
        elBody.classList.remove(this.hiddenClass);
      }
      else {
        oldState = this.openClass;
        newState = this.closedClass;
        elBody.classList.add(this.hiddenClass);
      }
      pElement.classList.add(newState);
      pElement.classList.remove(oldState);
      elHeader.classList.add(newState);
      elHeader.classList.remove(oldState);
    }
  }
  // ******************************************************** *
  // set listeners for accordion menu sections                *
  init_menu(pAllContainers = '.collapse-header', pBody = '.page-nav-sublist', pHeader = '.subheader', pInitContainers = null // .collapse-header:not(.start-open)
  ) {
    this.opBlock = pAllContainers;
    this.opTrigger = pHeader;
    this.opBody = pBody;
    this.op2Init = pInitContainers ?? pAllContainers;
    window.addEventListener('load', () => {
      this.menuElems2Close = document.querySelectorAll(this.op2Init);
      this.menuElemsAll = document.querySelectorAll(this.opBlock);
      // close menu sections on page load                         *
      this.menuElems2Close?.forEach((el) => {
        el.classList.remove(this.openClass);
        el.classList.add(this.closedClass);
        el.querySelector(pBody).classList.add(this.hiddenClass);
      });
      // make sure menu headers can be tabbed to                  *
      // set click listener and focus listeners                   *
      this.menuElemsAll?.forEach((el) => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', (ev) => {
          let elObj = (ev.target.parentNode);
          this.state_change('toggle', elObj);
        });
        el.addEventListener('focusin', (ev) => {
          if (!this.mouseTrigger) {
            let elObj = (!(ev.target.matches(pAllContainers)))
              ? ev.target.closest(pAllContainers)
              : ev.target;
            this.state_change('open', elObj);
          }
        });
        el.addEventListener('focusout', (ev) => {
          let elObj = ev.target;
          if (!this.mouseTrigger) {
            let elObj = (!(ev.target.matches(pAllContainers)))
              ? ev.target.closest(pAllContainers)
              : ev.target;
            this.state_change('close', elObj);
          }
        });
      });
    });
  }
  // ******************************************************** *
  // set listeners for mobile menu triggers.                  *
  init_mobile(pBody = '', pTrigger = '') {
    window.addEventListener('load', () => {
      this.mobiTrigger = document.querySelector(pTrigger);
      this.mobiMenu = document.querySelector(pBody);
    });
  }
}
/*! --- Copyright (c) 2025 Mootly Obviate -- See /LICENSE.md ------------------ */
