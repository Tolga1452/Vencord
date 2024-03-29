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

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { classNameFactory } from "@api/Styles";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import { classes } from "@utils/misc";
import definePlugin from "@utils/types";
import { Menu, showToast, Toasts } from "@webpack/common";

function HideMessageIcon({ className }: { className?: string; }) {
    return (
        <svg
            viewBox="0 -960 960 960"
            height={24}
            width={24}
            className={classes(classNameFactory("vc-hide-message-")("icon"), className)}
        >
            <path fill="var(--status-danger)" d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
        </svg>
    );
}

function findIndex(group: any[]) {
    const index = group.findIndex((c: { props: { id: string; }; }) => c?.props?.id === "delete");

    if (index === -1) return group.findIndex((c: { props: { id: string; }; }) => c?.props?.id === "report") - 1;
    else return index + 1;
}

function hideMessage(channelId: string, messageId: string, authorId: string) {
    let first = false;

    const element = document.querySelector(`#chat-messages-${channelId}-${messageId}`);

    if (!element) return showToast("Message not found.", Toasts.Type.FAILURE);

    const children = Array.from(element.parentElement?.children ?? []);
    const index = children.indexOf(element);

    if (element.firstElementChild?.firstElementChild?.firstElementChild?.tagName === "IMG") {
        if (children[index + 1].getAttribute("data-author-id") === authorId && children[index + 1].firstElementChild?.firstElementChild?.firstElementChild?.tagName !== "IMG") {
            first = true;

            element.firstElementChild?.firstElementChild?.querySelector(`#message-content-${messageId}`)?.remove();
            element.classList.add("hidden-message");
        }
    } else {
        if (children[index - 1].firstElementChild?.firstElementChild?.firstElementChild?.tagName === "IMG" && children[index - 1].classList.contains("hidden-message") && children[index + 1].getAttribute("data-author-id") !== authorId) {
            children[index - 1].remove();

            new Logger("Hide Message").info(children[index - 2].classList);

            if (children[index - 2].classList.contains("divider__01aed") && children[index + 1].classList.contains("divider__01aed")) children[index - 2].remove();
        }
    }

    if (!first) element.remove();
}

const messageCtxPatch: NavContextMenuPatchCallback = (children, { message }) => {
    const group = findGroupChildrenByChildId("copy-text", children);
    if (!group) return;

    group.splice(findIndex(group), 0, (
        <Menu.MenuItem
            id="vc-hide"
            label="Hide Message"
            icon={HideMessageIcon}
            action={async () => hideMessage(message.channel_id, message.id, message.author.id)}
        />
    ));

    document.getElementById("message-vc-hide")?.classList.add("colorDanger__08c25");
};

export default definePlugin({
    name: "Hide Message",
    description: "Allows you to hide messages. The messages will be back when you switch channels.",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    contextMenus: {
        "message": messageCtxPatch
    },
    start() { },
    stop() { },
});
