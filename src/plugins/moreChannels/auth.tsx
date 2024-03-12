/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { Logger } from "@utils/Logger";
import { openModal } from "@utils/modal";
import { findByPropsLazy } from "@webpack";
import { showToast, Toasts, UserStore } from "@webpack/common";

import { DataStoreData, Token } from "./types";

const { OAuth2AuthorizeModal } = findByPropsLazy("OAuth2AuthorizeModal");

const dataStoreKey = "more-channels";

export async function setToken(token: Token) {
    await DataStore.update(dataStoreKey, (data: DataStoreData | undefined) => {
        data = data ?? {};
        data[UserStore.getCurrentUser().id] = token;

        return data;
    });
}

export async function getToken(): Promise<Token> {
    const data: DataStoreData = await DataStore.get(dataStoreKey) ?? {};

    return data[UserStore.getCurrentUser().id];
}

export function authorize() {
    openModal(props =>
        <OAuth2AuthorizeModal
            {...props}
            scopes={["identify"]}
            responseType="code"
            redirectUri="http://localhost:3004/more-channels/authorization"
            permissions={0n}
            clientId="1216448161506398369"
            cancelCompletesFlow={false}
            callback={async (response: { location: RequestInfo | URL; }) => {
                try {
                    const redirect = new URL(response.location as string);

                    redirect.searchParams.append("userId", UserStore.getCurrentUser().id);

                    const res = await fetch(redirect, {
                        headers: {
                            Accept: "application/json"
                        }
                    });

                    if (!res.ok) return showToast("An error occured while authorizing", Toasts.Type.FAILURE);

                    const { token } = await res.json();

                    setToken(token);
                    showToast("Successfully logged in!", Toasts.Type.SUCCESS);
                } catch (e) {
                    new Logger("More Channels").error(e);

                    showToast("An error occured while authorizing", Toasts.Type.FAILURE);
                }
            }}
        />
    );
}
