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
const mman_AllTars  = '.nav-subcontainer';
const mman_targBody = '.nav-sublist';
const mman_targHead = '.nav-subheader';
const mman_2Init    = '.collapse-header:not(.start-open)';

                    // All scripts in the mp namespace to avoid collisions.     *
let mp = {
  menuManager: new mpc_menuManager(mman_open, mman_closed,mman_hidden),
// ...
};
                    // The script has two functions to set up accordion menus   *
                    // and mobile menu toggles                                  *
mp.menuManager.init_menu(mman_AllTargs, mman_targBody, mman_targHead, mman_2Init);
mp.menuManager.init_mobile(mman_targBody, mman_targHead);

/* ---------------------------------------------------------------------------- */
