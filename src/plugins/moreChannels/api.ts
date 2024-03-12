/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import { showToast,Toasts } from "@webpack/common";

import { getToken } from "./auth";
import { ChannelType, Snowflake } from "./types";

export const config = {
    baseUrl: "http://localhost:3004/more-channels"
};

export async function addChannel(channelId: Snowflake, type: ChannelType): Promise<void> {
    if (![ChannelType.GuildCustom].includes(type)) return;

    const response = await fetch(`${config.baseUrl}/channels`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: await getToken()
        },
        body: JSON.stringify({ channelId, type })
    });

    if (!response.ok) {
        new Logger("More Channels").error(response);

        showToast("An error occured while adding the channel to database.", Toasts.Type.FAILURE);
    }
}
