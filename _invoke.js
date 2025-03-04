/* ---------------------------------------------------------------------------- */
/*! --- Implementation Examples Scripts --------------------------------------- *
 * Copyright (c) 2025 Mootly Obviate -- See /LICENSE.md
 * ---------------------------------------------------------------------------- */
                    // Menu Manager variables                                   *
                    // Constructor variables are optional if using defaults.    *
                    // Onload initialization call variables are not optional.   *
const mman_open     = 'open';
const mman_closed   = 'closed';
const mman_hidden   = 'hidden';
const mman_visible  = 'show';
const mman_active   = 'active';
const mman_keepIdx  = false;
                    // init_menu                                                *
const mman_AllTargs = '.nav-subcontainer';
const mman_targBody = '.nav-sublist';
const mman_targHead = '.nav-subheader';
const mman_2Init    = '.nav-subcontainer:not(.start-open)';
                    // init_mobile                                              *
const mman_tBodyID  = '#main-menu';
const mman_tHeadID  = '#main-menu-toggle';
const mman_addMobi  = true;
const mman_container= null;
                    // All scripts in the mp namespace to avoid collisions.     *
let mp = {
  menuManager: new mpc_menuManager(mman_open, mman_closed, mman_hidden, mman_visible, mman_active, mman_keepIdx),
// ...
};
                    // The script has two functions to                          *
                    // - set up accordion menus                                 *
                    // - set up mobile menu toggles                             *
mp.menuManager.init_menu(mman_AllTargs, mman_targBody, mman_targHead, mman_2Init);
mp.menuManager.init_mobile(mman_tBodyID, mman_tHeadID, mman_addMobi, mman_container);
/* ---------------------------------------------------------------------------- */
