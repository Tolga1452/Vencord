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
import ErrorBoundary from "@components/ErrorBoundary";
import { ErrorCard } from "@components/ErrorCard";
import { Devs } from "@utils/constants";
import { Margins } from "@utils/margins";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Forms, React } from "@webpack/common";

const KbdStyles = findByPropsLazy("key", "removeBuildOverride");

const settings = definePluginSettings({
    enableIsStaff: {
        description: "Enable isStaff",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    staging: {
        description: "Use staging channel",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    apiV10: {
        description: "Use v10 API. This might cause some issues.",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    }
});

let originalChannel;
let originalAPI;

export default definePlugin({
    name: "Experiments",
    description: "Enable Access to Experiments in Discord!",
    authors: [
        Devs.Megu,
        Devs.Ven,
        Devs.Nickyux,
        Devs.BanTheNons,
        Devs.Nuckyz,
        (Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n }),
        (Devs.TRAOX ?? { name: "TraoX", id: 935621080092123156n })
    ],
    settings,

    patches: [
        {
            find: "Object.defineProperties(this,{isDeveloper",
            replacement: {
                match: /(?<={isDeveloper:\{[^}]+?,get:\(\)=>)\i/,
                replace: "true"
            }
        },
        {
            find: 'type:"user",revision',
            replacement: {
                match: /!(\i)&&"CONNECTION_OPEN".+?;/g,
                replace: "$1=!0;"
            }
        },
        {
            find: '"isStaff",',
            predicate: () => settings.store.enableIsStaff,
            replacement: [
                {
                    match: /=>*?(\i)\.hasFlag\((\i\.\i)\.STAFF\)}/,
                    replace: (_, user, flags) => `=>Vencord.Webpack.Common.UserStore.getCurrentUser()?.id===${user}.id||${user}.hasFlag(${flags}.STAFF)}`
                },
                {
                    match: /hasFreePremium\(\){return this.isStaff\(\)\s*?\|\|/,
                    replace: "hasFreePremium(){return ",
                }
            ]
        },
        {
            find: 'H1,title:"Experiments"',
            replacement: {
                match: 'title:"Experiments",children:[',
                replace: "$&$self.WarningCard(),"
            }
        }
    ],

    start: () => {
        originalChannel = window.GLOBAL_ENV.RELEASE_CHANNEL;
        originalAPI = window.GLOBAL_ENV.API_VERSION;  
    
        if (settings.store.staging) window.GLOBAL_ENV.RELEASE_CHANNEL = "staging";
        if (settings.store.apiV10) window.GLOBAL_ENV.API_VERSION = "10";
    },

    stop: () => {
        if (window.GLOBAL_ENV.RELEASE_CHANNEL !== originalChannel) window.GLOBAL_ENV.RELEASE_CHANNEL = originalChannel;
        if (window.GLOBAL_ENV.API_VERSION !== originalAPI) window.GLOBAL_ENV.API_VERSION = originalAPI;
    },

    settingsAboutComponent: () => {
        const isMacOS = navigator.platform.includes("Mac");
        const modKey = isMacOS ? "cmd" : "ctrl";
        const altKey = isMacOS ? "opt" : "alt";
        return (
            <React.Fragment>
                <Forms.FormTitle tag="h3">More Information</Forms.FormTitle>
                <Forms.FormText variant="text-md/normal">
                    You can enable client DevTools{" "}
                    <kbd className={KbdStyles.key}>{modKey}</kbd> +{" "}
                    <kbd className={KbdStyles.key}>{altKey}</kbd> +{" "}
                    <kbd className={KbdStyles.key}>O</kbd>{" "}
                    after enabling <code>isStaff</code> below
                </Forms.FormText>
                <Forms.FormText>
                    and then toggling <code>Enable DevTools</code> in the <code>Developer Options</code> tab in settings.
                </Forms.FormText>
            </React.Fragment>
        );
    },

    WarningCard: ErrorBoundary.wrap(() => (
        <ErrorCard id="vc-experiments-warning-card" className={Margins.bottom16}>
            <Forms.FormTitle tag="h2">Hold on!!</Forms.FormTitle>

            <Forms.FormText>
                Experiments are unreleased Discord features. They might not work, or even break your client or get your account disabled.
            </Forms.FormText>

            <Forms.FormText className={Margins.top8}>
                Only use experiments if you know what you're doing. Vencord is not responsible for any damage caused by enabling experiments.
            </Forms.FormText>
        </ErrorCard>
    ), { noop: true })
});
