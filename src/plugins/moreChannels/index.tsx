/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findModuleId, wreq } from "@webpack";
import { Button, showToast,Toasts } from "@webpack/common";

import { addChannel } from "./api";
import { authorize, getToken } from "./auth";
import { ChannelType, CreateChannelChannel } from "./types";

export default definePlugin({
    name: "More Channels",
    description: "Adds more channel types (client-side).",
    authors: [
        (Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })
    ],
    settings: definePluginSettings(
        {
            authorize: {
                type: OptionType.COMPONENT,
                description: "Authorize your account to use the plugin",
                component: () => (
                    <Button onClick={() => authorize()}>
                        Authorize
                    </Button>
                )
            }
        }
    ),
    patches: [
        {
            find: 'a[a.GUILD_TEXT=0]="GUILD_TEXT",',
            replacement: [
                {
                    match: /a\[a.GUILD_TEXT=0\]="GUILD_TEXT",/,
                    replace: '$&a[a.GUILD_CUSTOM=1000]="GUILD_CUSTOM",'
                }
            ]
        },
        {
            find: "a&&d.push({icon:ee.default,iconSize:24,label:eu.default.Messages.STAGE_VOICE_CHANNEL_TYPE,value:er.ChannelTypes.GUILD_STAGE_VOICE,description:eu.default.Messages.CREATE_STAGE_CHANNEL_DESCRIPTION}),",
            replacement: [
                {
                    match: /a&&d.push\({icon:ee.default,iconSize:24,label:eu.default.Messages.STAGE_VOICE_CHANNEL_TYPE,value:er.ChannelTypes.GUILD_STAGE_VOICE,description:eu.default.Messages.CREATE_STAGE_CHANNEL_DESCRIPTION}\),/,
                    replace: '$&true&&d.push({icon:t?V.default:Y.default,iconSize:24,label:"Custom",value:er.ChannelTypes.GUILD_CUSTOM,description:"Create a dummy channel to test the plugin"}),'
                }
            ]
        },
        {
            find: "case er.ChannelTypes.GUILD_STAGE_VOICE:return ee.default;",
            replacement: [
                {
                    match: /case er.ChannelTypes.GUILD_STAGE_VOICE:return ee.default;/,
                    replace: "$&case er.ChannelTypes.GUILD_CUSTOM:return e?V.default:Y.default;"
                }
            ]
        },
        {
            find: "createChannel(e){",
            replacement: [
                {
                    match: /createChannel\(e\){/,
                    replace: "$&if([$self.ChannelType.GuildCustom].includes(e.type))return $self.createChannel(e);"
                }
            ]
        },
        {
            find: "let e=await _.default.createChannel({",
            replacement: [
                {
                    match: /if\(null==e\|\|201!==e\.status\)return;/,
                    replace: "$self.addChannel(e?.body?.id,C);$&"
                }
            ]
        }
    ],

    ChannelType,

    createChannel: (channel: CreateChannelChannel) => {
        switch (channel.type) {
            case ChannelType.GuildCustom:
                channel = {
                    ...channel,
                    type: ChannelType.GuildText
                };

                return wreq(parseInt(findModuleId("createChannel(e){") ?? ""))?.default?.createChannel(channel);
        }
    },

    addChannel,

    start: async () => {
        const token = await getToken();

        if (!token) showToast("You need to authorize More Channels in plugin settings.", Toasts.Type.FAILURE);
    },

    stop: () => { }
});
