# fivem-graffiti (WIP)

A standalone 3D-Graffiti system which gives the ability to tag walls and objects.

## Features

- Supports instances and routing buckets; e.g., graffiti placed in dimension #21 will not be visible in dimension #1.
- Graffiti persists through sessions and server restarts until manually removed.
- Graffiti is stored in your database.
- Administrators have the ability to manage and oversee graffiti via command.

## Installation

##### _If you download the source code via the green `Code` button, you'll need to build the resource. Information on how to do this is provided below. If you prefer not to build it, you can download latest release and drag and drop it into your server. However, any changes made to the built resource will need to be re-built to apply the changes._

### Dependencies

- [oxmysql](https://github.com/overextended/oxmysql)
- [ox_lib](https://github.com/overextended/ox_lib)
- [ox_inventory](https://github.com/overextended/ox_inventory)

### Build

1. Download and install the LTS version of [Node.js](https://nodejs.org/en).
2. Open a command-line terminal (e.g., Terminal, Command Prompt).
3. Enter `node --version` to verify the installation.
4. Run `npm install -g pnpm` to globally install the package manager [pnpm](https://pnpm.io).
5. Download or clone the repository with `git clone https://github.com/jacobbernoulli/fivem-graffiti`.
6. Execute the queries found in `sql/schema.sql` in your database.
7. Install all dependencies with `pnpm i`.
8. Build the resource with `pnpm build`.

Use `pnpm watch` to rebuild whenever a file is modified.

## Usage

### Commands

#### Player

- `/graffiti [text] [font] [size] [hex]` _(alias: `/grf`)_ - Creates a graffiti tag.
- `/cleangraffiti` _(alias: `/cgrf`)_ - Cleans and removes the nearest graffiti tag.

#### Admin

- `/nearbygraffitis [radius]` _(alias: `/ng`)_ - Lists all active nearby graffiti with detailed information.
- `/removegraffiti [id]` _(alias: `/rg`)_ - Removes graffiti from both the database and world.
- `/massremovegraffiti [radius] [include admins 0/1]` _(alias: `/removegraffitis`)_ - Mass removes graffiti from both the database and world. If the second optional parameter is set to `1`, it will also delete graffiti created by admins.
- `/addrestrictedzone [radius]` _(alias: `/arz`)_ - Restricts graffiti from being placed within the specified radius.
- `/removerestrictedzone [zoneId]` _(alias: `/rrz`)_ - Removes a zone from the database.