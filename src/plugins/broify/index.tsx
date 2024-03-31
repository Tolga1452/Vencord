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

const CoolMessageToggle: ChatBarButton = ({ isMainChat }) => {
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
                                    text: "You are CoolGPT. Your only job is turning all the given message content into bro style You will use slang, and only slang). You will NOT try to talk with people. You will apply these rules to the message contents:\n- Do not use italic.\nOnly one emoji per message is allowed-emojis are not allowed (if the user used emojis, use them too).\n- If the message only includes things like URLs and emojis, just keep them as they are, don't try to talk with the user. \n- dont talk in second person."
                                },
                                {
                                    by: "user",
                                    text: `The text to turn into cool message (YOU WILL NOT TRY TO TALK WITH ME, YOU CAN ONLY DO YOUR JOB):\n"${message.content}"`
                                }
                            ]
                        })
                    });

                    if (response.ok) message.content = await response.text();
                } catch (error) {
                    new Logger("Become Cool").error(error);

                    showToast("Failed to turn the message into a cool message.", Toasts.Type.FAILURE);
                }
            }
        };

        addPreSendListener(listener);
        return () => void removePreSendListener(listener);
    }, [enabled]);

    if (!isMainChat) return null;

    return (
        <ChatBarButton
            tooltip={enabled ? "Disable Cool Message" : "Enable Cool Message"}
            onClick={() => setEnabledValue(!enabled)}
        >
            <svg width="24px" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill={enabled ? "var(--green-360)" : "currentColor"} d="M628.736 528.896A416 416 0 0 1 928 928H96a415.872 415.872 0 0 1 299.264-399.104L512 704l116.736-175.104zM720 304a208 208 0 1 1-416 0 208 208 0 0 1 416 0z"/></svg>
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Become Cool",
    authors: [(Devs.kamikaze ?? { name: "✨kamikaze✨", id: 1215790526910042212n })],
    description: "Turns your messages into a cool one.",
    dependencies: ["MessageEventsAPI", "ChatInputButtonAPI"],

    start: () => addChatBarButton("CoolMessageToggle", CoolMessageToggle),
    stop: () => removeChatBarButton("CoolMessageToggle")
});
