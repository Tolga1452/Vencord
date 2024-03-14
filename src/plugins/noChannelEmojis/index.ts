/**
 * @license
 *
 * NoChannelEmojis - a Vencord Plugin
 *
 * Written in 2023 by Sofia Lima <me@dzshn.xyz>
 *
 * To the extent possible under law, the author has dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

/* eslint-disable header/header */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Channel } from "discord-types/general";

export default definePlugin({
    name: "NoChannelEmojis",
    authors: [{id: 456226577798135808n, name: "unknown"}],
    description: "Remove emojis from all channel names",
    patches: [{
        find: ".hasChannel=function",
        replacement: {
            match: /(?<=\.getChannel=function\(\i\)\{if\(null!=\i\)return )\i\(\i\)/,
            replace: "$self.unemojify($&)",
        }
    }],

    unemojify(channel?: Channel) {
        if (channel)
            channel.name = channel.name.replace(/-?\p{Emoji_Presentation}-?/ug, "");
        return channel;
    }
});