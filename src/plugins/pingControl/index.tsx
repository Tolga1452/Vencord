/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { Settings, useSettings, definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants"; 
import definePlugin, { OptionType } from "@utils/types";
import { findExportedComponentLazy } from "@webpack";
import { Menu, Popout, useState } from "@webpack/common";
import type { ReactNode } from "react";
import { Icon } from "@components/Icons";

import { addContextMenuPatch, removeContextMenuPatch } from "@api/ContextMenu";

const HeaderBarIcon = findExportedComponentLazy("Icon", "Divider");

function lol() {
    window.open("https://dis.gd/notifications-technical-details", "_blank");
}

function VencordPopout(onClose: () => void) {
    let entries = [] as ReactNode[];
    
    if (entries.length === 0) {
        entries.push(
            <Menu.MenuItem
                id="vc-inbox-item"
                label="Empty :("
                action={lol}
            />
        )
    }

    return (
        <Menu.Menu
            navId="vc-toolbox"
            onClose={onClose}
        >
            {...entries}
        </Menu.Menu>
    );
}

function VencordPopoutIcon(isShown: boolean) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" class="icon__4cb88" width="24" height="24" viewBox="0 0 24 24" fill="none">
<g clip-path="url(#clip0_3_376)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C6.20435 0 5.44129 0.316071 4.87868 0.87868C4.31607 1.44129 4 2.20435 4 3V17C4 17.7956 4.31607 18.5587 4.87868 19.1213C5.44129 19.6839 6.20435 20 7 20H21C21.7956 20 22.5587 19.6839 23.1213 19.1213C23.6839 18.5587 24 17.7956 24 17V3C24 2.20435 23.6839 1.44129 23.1213 0.87868C22.5587 0.316071 21.7956 0 21 0H7ZM6 3.5C6 2.67 6.67 2 7.5 2H20.5C21.33 2 22 2.67 22 3.5V9.5C22 10.33 21.33 11 20.5 11H17.85C17.35 11 17 11.5 17 12C17 12.7956 16.6839 13.5587 16.1213 14.1213C15.5587 14.6839 14.7956 15 14 15C13.2044 15 12.4413 14.6839 11.8787 14.1213C11.3161 13.5587 11 12.7956 11 12C11 11.5 10.65 11 10.15 11H7.5C7.10218 11 6.72064 10.842 6.43934 10.5607C6.15804 10.2794 6 9.89782 6 9.5V3.5Z" fill="currentColor"></path>
<path d="M1 17C1 21.8 5 23 7 23" stroke="currentColor" stroke-width="2"></path>
<path d="M1 4V17" stroke="currentColor" stroke-width="2"></path>
<path d="M7 23L20 23" stroke="currentColor" stroke-width="2"></path>
<circle cx="1" cy="4" r="1" fill="currentColor"></circle>
<g clip-path="url(#clip1_3_376)">
<circle cx="20" cy="23" r="1" transform="rotate(90 20 23)" fill="currentColor"></circle>
</g>
</g>
<defs>
<clipPath id="clip0_3_376">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
<clipPath id="clip1_3_376">
<rect width="2" height="1" fill="white" transform="matrix(0 1 -1 0 21 22)"></rect>
</clipPath>
</defs>
</svg>
    );
}

function VencordPopoutButton() {
    const [show, setShow] = useState(false);

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            renderPopout={() => VencordPopout(() => setShow(false))}
        >
            {(_, { isShown }) => (
                <HeaderBarIcon
                    className="vc-blockedinbox-btn"
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "Blocked Ping Inbox"}
                    icon={() => VencordPopoutIcon(isShown)}
                    selected={isShown}
                    showBadge={false}
                />
            )}
        </Popout>
    );
}

function ToolboxFragmentWrapper({ children }: { children: ReactNode[]; }) {
    children.splice(
        children.length - 1, 0,
        <ErrorBoundary noop={true}>
            <VencordPopoutButton />
        </ErrorBoundary>
    );

    return <>{children}</>;
}

interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

function t(id) {  
    if (settings.store.userList.search(id) !== -1) {
        settings.store.userList = settings.store.userList.replace(`${id}`, "")
    } else {
        settings.store.userList = `${settings.store.userList},${id}`
    }
}

function a(id) {
    if (settings.store.userList.search(id)) {
        return false
    } else {
        return true
    }
}

const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user, guildId }: UserContextProps) => {
    if (!user) return;

    const isBlocked = a(user.id)

    children.push(
        <Menu.MenuItem
            id="vc-block-pings"
            label={isBlocked ? "Unblock Pings" : "Block Pings"}
            action={() => t(user.id)}
        />
    );
};

const settings = definePluginSettings({
    userList: {
        description:
            "List of blocked ping users (separated by commas)",
        type: OptionType.STRING,
        default: ""
    }
});

const currentUserId = findByProps("getCurrentUser", "getUser").getCurrentUser().id;

        findByProps("addInterceptor").addInterceptor((e: { type: string; message: { mentions: any[]; content: string; }; }) => {
            if (e.type === "MESSAGE_CREATE") {
                e.message.mentions.forEach(mention => {
                    if (mention.id === currentUserId && settings.store.userList.search(e.message.author.id) !== -1) {
                        e.message.mentions = [];
                        e.message.content = "󠁰󠁩󠁮󠁧󠀠󠁢󠁬󠁯󠁣󠁫󠁥󠁤<:PingBlocked:1221214625899479081> " + e.message.content;
                    }
                });
            }
        });

export default definePlugin({
    name: "PingControl",
    description: "Allows you to control and block incoming pings",
    authors: [Devs.HumanCat222],
    settings,

    patches: [
        {
            find: "toolbar:function",
            replacement: {
                match: /(?<=toolbar:function.{0,100}\()\i.Fragment,/,
                replace: "$self.ToolboxFragmentWrapper,"
            }
        }
    ],

    contextMenus: {
        "user-context": UserContextMenuPatch
    },

    ToolboxFragmentWrapper: ErrorBoundary.wrap(ToolboxFragmentWrapper, {
        fallback: () => <p style={{ color: "red" }}>Failed to render :(</p>
    }),
});
