/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "QuickReactFrequents",
    description: "Make quick react use top frecency emojis instead of favourites",
    authors: [Devs.Ven],

    patches: [{
        find: "this.favoriteEmojisWithoutFetchingLatest.concat",
        replacement: {
            match: "this.favoriteEmojisWithoutFetchingLatest.concat",
            replace: "[].concat"
        }
    }]
});