`😺` A stupid cat programmer's crazy Vencord plugins.

`🗨️` Join our [Discord Server](https://discord.gg/PxDj9XeHkB) for more information.

# Frequently Asked Questions

## Is this the original Vencord client modification?
No, this is a fork of Vencord with unofficial plugins. You can find the original repository of Vencord [here](https://github.com/Vendicated/Vencord).


## Is this fork safe?
Yes, this repository is safe. If you don't trust it, feel free to look at the source code.


## Is this fork up-to-date with original Vencord?
Yes, it usually is, but we don't update this fork immediatley after the original Vencord is updated. You'll have to update it manually. We release a new version when there are necessary changes.

---

# Setup

## Requirements
 - Download the latest version of Node.js from [here](https://nodejs.org/en/download/current).
- Download Git from [here](https://git-scm.com/download).
- Open a terminal and run the following commands:

## Installation
You can watch [this](https://drive.google.com/file/d/1zlWv4t14ORqy7QuF_Sup7DLkf7pAgS90/view?usp=sharing) tutorial to make it more easy.


### Install `pnpm`

> [!IMPORTANT]
> This next command may need to be run as admin/root depending on your system, and you may need to close and reopen your terminal for `pnpm` to be in your PATH.


```shell
npm i -g pnpm
```


> [!IMPORTANT]
> Make sure you aren't using an admin/root terminal from here onwards. It **will** mess up your Discord/Vencord instance and you **will** most likely have to reinstall.

### Clone the fork

```shell
git clone https://github.com/Vendicated/Vencord
cd Vencord
```

### Install the dependencies needed

```shell
pnpm install --frozen-lockfile
```

### Build Vencord

```shell
pnpm build
```

### Inject Vencord into your Discord client

> [!TIP]
> If you having any errors while injecting, close the running Discord client and try again.

```shell
pnpm inject
```

---

When you want to update your Discord client to the latest version of this fork, just run `npm run update`.

# Plugins

## Modified

### [ClientTheme](<https://github.com/Tolga1452/Vencord/tree/main/src/plugins/clientTheme>)

- Added dynamic color support.

### [Experiments](<https://github.com/Tolga1452/Vencord/tree/main/src/plugins/experiments>)

- Added a toggle to switch the release channel to staging.

## Added

- **[Become Catgirl](<https://github.com/Tolga1452/Vencord/tree/main/src/plugins/becomeCatgirl>):** Turns your messages into a catgirl message.
- **[Talk In Reverse](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/talkInReverse):** Reverses the message content before sending it.
- **[God Mode](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/godMode):** Get all permissions (client-side).
- **[CopyEmojiAsFormattedString](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/CopyEmojiAsFormattedString)** Adds a button to copy an emoji as a formatted string!
- **[CustomAppIcons](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/CustomAppIcons)** Gives the ability to upload custom (In-)App Icons.
