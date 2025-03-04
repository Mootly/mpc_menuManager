# MoosePlum Menu Manager

This is collection of functions to manage menu operations on pages. It does the following:

- Manages accordion menus for both mouse and focus events.
- Manages menu icon operations for mobile, or for any icon+block relationship.
- Flags the current link in a menu so it can be styled accordingly.

## Dependencies

This was written in TypeScript and exported to ES2020.

## Assets

The files in this set are as follows:

| path                       | description                                        |
| -------------------------- | -------------------------------------------------- |
| LICENSE.md                 | License notice ( [MIT](https://mit-license.org) ). |
| README.md                  | This document.                                     |
| mpc_menuMananer.ts         | The class definition in TypeScript.                |
| mpc_menuManager.js         | The class definition in ES6.                       |
| mpc_menuManager.min.js     | Minified version.                                  |
| mpc_menuManager.min.js.map | Map file.                                          |
| tsconfig.json              | Example TS > ES2020 config setting.                |
| _invoke.js                 | Example implementation code.                       |

## Installation

Download this repo, or just the script, and add it to the script library for your site.

This script has no external dependencies.

### Compiling from the TypeScript

To save to ES2020 in the current folder, assuming you have the correct libraries installed, run the following in this folder:

`tsc -p tsconfig.json`

## Configuration

The script operates on menus that following one of two patterns.

- A nested list structure in line with a typical `<nav>` section in a page.
- A toggle / menu combo as is common in menu design for mobile devices.

It creates listeners on target elements to track actions related thereto.

The HTML should follow one or both of these patterns.

### Assumptions

This script assumes a fair amount.

This script does almost no error checking. In case of errors, the script will usually just do nothing, but not always. It does not correct for typos in templates or other template errors.

For the current page to be flagged in a menu, the menu must be inside a `<nav>` block. The script will look for a link URL that matches the current page URL in the menu. Upon a match, it will assign a class to the parent of that link, normally and `<li>`. The default class is `.active`.

For identifying the current page,, this script assumes default file names fit the following regex pattern: `/((index)|(default))\.\w{2,4}/`. It also only looks for the first match. Having multiple menu items flagged as the current page looks wrong, even if it does occur in a menu multiple times.

Menus are written in a nested list format. There is a `<span>` or other element defining a header as an immediately sibling of each submenu. The containing list item, header and nested list body will have consistent class names assigned to them.

The submenu headers will have a class assigned to them that allows them to toggle icons or other indicators between open and closed states. The defaults are `.open` and `.closed`. The script assigns a tab index of zero to elements it needs to track. Anchor tags should not be used to trigger the script.

The submenu will have a class to toggle the hidden state. The default is `.hidden`.

The script assumes you are using the same classes for open, closed, and hidden for all menu items. Otherwise you will need to instantiate multiple times, one for each class set. If you are using different classes to do the same thing in different locations, you should also refactor your code.

If all menus have the same class names for parent list item, header, and submenu to toggle, the `init_menu()` method only needs to be invoked once for the entire page.

For mobile menus, toggle buttons are associated with toggled blocks. They do not need to be adjancent ot one another, but must have IDs by which listeners can be assigned. There is no default for these IDs, so they must be passed for the method to work.

The `init_mobile()` method can be used to set a listener to hide and show any toggle button and block combo.

### Recommended HTML Code

```html
<nav class="page-nav" id="menu-id" aria-labelledby="page-menu-control">
  <div id="menu-id-toggle" class="mobile-only closed">
    <span role="button" id="menu-id-control" aria-hidden="true">Navigation Description</span>
  </div>
  <div id="menu-id-body" class="mobile-hidden">
    <ul id="menu-id-list">
    <!-- keep non-collapsing links up top -->
      <li class="top-level"><a href="#">Important Link</a></li>
      <li class="top-level"><a href="#">Important Link</a></li>
      <li class="nav-subcontaner" tabindex="0">
        <span class="nav-subheader start-open">Submenu Header</span>
        <ul class="nav-sublist">
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </li>
      <li class="nav-subcontaner" tabindex="0">
        <span class="nav-subheader">Submenu Header</span>
        <ul class="nav-sublist">
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </li>
      ⋮
    </ul>
  </div>
</nav>
```

### Parameters

#### Constructor

| name       | type    | default  | description                                                  |
| ---------- | ------- | -------- | ------------------------------------------------------------ |
| pOpen      | string  | 'open'   | Class to flag header as open.                                |
| pClosed    | string  | 'closed' | Class to flag header as closed.                              |
| pHidden    | string  | 'hidden' | Class to hide menu.                                          |
| pVisible   | string  | 'show'   | Class to show menu.                                          |
| pActive    | string  | 'active' | Class to flag current page in menu.                          |
| pKeepIndex | boolean | false    | Whether to keep default filenames for matching current page. |

#### init_menu

| name            | type   | default             | description                                   |
| --------------- | ------ | ------------------- | --------------------------------------------- |
| pAllContainers  | string | '.nav-subcontainer' | Class for container with submenu.             |
| pBody           | string | '.nav-sublist'      | Class for submenu.                            |
| pHeader         | string | '.nav-subheader'    | Class for header for submenu.                 |
| pInitContainers | string | pAllContainers      | CSS selector for elements to start collapsed. |

If you don't specify which containers should start collapsed, the code defaults to collapsing the elements specifeid by `pAllContainers`.

#### init_mobile

| name       | type    | default | description                                         |
| ---------- | ------- | ------- | --------------------------------------------------- |
| pBody      | string  | null    | ID of the element to collapse.                      |
| pTrigger   | string  | null    | ID of the toggle button for the collapsing element. |
| pAddMobi   | boolean | true    | Add prefix of "mobile-" to mobile menu controls.    |
| pContainer | string  | null    | ID of the container of the above two, if needed.    |

A toggle icon and the block it affects do not have to be adjacent, or even in the same parent block.

The `pAddMobi` parameter allows you to specific whether or not to prefix mobile menu blocks. Setting this to true prefixes the `pVisible` and `pHidden` classes with 'mobile-'. This is to allow some flexibility in how a mobile block is hidden. For example, you might have claases of  "mobile hidden" or "mobile-hidden". The former requires more CSS hoop jumping, specifically some `:not(.mobile)` class to avoid contention, but avoids redundant or overlapping classes. The latter is simpler CSS at the cost of some class redundancy.

If there is a parent block that should have open and closed classes set, it can be specified with `pContainer`. Otherwise it is safe to omit.

### Coding Example

Use the `mp` namespace to help avoid collisions.

```js
const mman_open     = 'open';
const mman_closed   = 'closed';
const mman_hidden   = 'hidden';
const mman_visible  = 'show';
const mman_active   = 'active';
const mman_keepIdx  = false;
const mman_AllTargs = '.nav-subcontainer';
const mman_targBody = '.nav-sublist';
const mman_targHead = '.nav-subheader';
const mman_2Init    = '.nav-subcontainer:not(.start-open)';
const mman_tBodyID  = '#main-menu-toggle';
const mman_tHeadID  = '#main-menu';
const mman_addMobi  = true;
const mman_container= null;

let mp = {
  menuManager: new mpc_menuManager(mman_open, mman_closed, mman_hidden, mman_visible, mman_active, mman_keepIdx),
  ⋮
};
```

Calling the init functions creates listeners. They can be called multiple times if there are multiple targets in the page.

```js
mp.menuManager.init_menu(mman_AllTargs, mman_targBody, mman_targHead, mman_2Init);
mp.menuManager.init_mobile(mman_tBodyID, mman_tHeadID, mman_addMobi, mman_container);
```
