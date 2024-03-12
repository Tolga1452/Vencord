/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export enum ChannelType {
    GuildText = 0,
    GuildVoice = 2,
    GroupDM = 3,
    GuildCategory = 4,
    GuildAnnouncement = 5,
    GuildStore = 6,
    AnnouncementThread = 10,
    PublicThread = 11,
    PrivateThread = 12,
    GuildStageVoice = 13,
    GuildDirectory = 14,
    GuildForum = 15,
    GuildMedia = 16,
    GuildCustom = 1000,
    Unknown = 10000
}

export type Snowflake = string;

export interface CreateChannelChannel {
    guildId: Snowflake;
    type: ChannelType;
    name: string;
    permissionOverwrites: any[];
    bitrate?: number;
    userLimit?: number;
    parentId?: string;
    skuId?: string;
    branchId?: string;
}

export type Token = string;

export interface DataStoreData {
    [userId: Snowflake]: Token;
}
