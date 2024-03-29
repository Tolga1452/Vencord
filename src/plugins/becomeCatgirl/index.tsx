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

import { addChatBarButton, ChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { addPreSendListener, removePreSendListener, SendListener } from "@api/MessageEvents";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { React, showToast, Toasts, useEffect, useState } from "@webpack/common";

let lastState = false;

const CatgirlMessageToggle: ChatBarButton = ({ isMainChat }) => {
    const [enabled, setEnabled] = useState(lastState);

    function setEnabledValue(value: boolean) {
        lastState = value;

        setEnabled(value);
    }

    useEffect(() => {
        const listener: SendListener = async (_, message) => {
            if (enabled && message.content && message.content.length > 0) {
                try {
                    const response = await fetch("https://tolgchu-proxy.glitch.me/aesthetic-ai", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            hint: "character",
                            messages: [
                                {
                                    by: "system",
                                    text: "You are CatgirlGPT. Your only job is turning all the given message content into catgirl style. You will NOT try to talk with people. You will apply these rules to the message contents:\n- Use italic style for some words.\n- Add \"~\" at the end of some words.\n- Make some words longer like \"heelllooo\" but do not do it too much.\n- Include some catgirl effects like \"nyaahh\"\n- Use at most 2 kaomojis, emojis are not allowed (if the user used emojis, use them too).\n- Replace some letters with \"w\" like in this example: \"your fawowite website is hewe\".\n- Duplicate some letters \"h-h-hey\".\n- If the message only includes things like URLs and emojis, just keep them as they are, don't try to talk with the user."
                                },
                                {
                                    by: "user",
                                    text: `The text to turn into catgirl message (YOU WILL NOT TRY TO TALK WITH ME, YOU CAN ONLY DO YOUR JOB):\n"${message.content}"`
                                }
                            ]
                        })
                    });

                    if (response.ok) message.content = await response.text();
                } catch (error) {
                    new Logger("Become Catgirl").error(error);

                    showToast("Failed to turn the message into a catgirl message.", Toasts.Type.FAILURE);
                }
            }
        };

        addPreSendListener(listener);
        return () => void removePreSendListener(listener);
    }, [enabled]);

    if (!isMainChat) return null;

    return (
        <ChatBarButton
            tooltip={enabled ? "Disable Catgirl Message" : "Enable Catgirl Message"}
            onClick={() => setEnabledValue(!enabled)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill={enabled ? "var(--green-360)" : "currentColor"} d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z" /></svg>
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Become Catgirl",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    description: "Turns your messages into catgirl messages.",
    dependencies: ["MessageEventsAPI", "ChatInputButtonAPI"],

    start: () => addChatBarButton("CatgirlMessageToggle", CatgirlMessageToggle),
    stop: () => removeChatBarButton("CatgirlMessageToggle")
});
