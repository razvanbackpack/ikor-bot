export interface IChatEmbed {
    type: "Text",
    title?: string;
    description?: string;
    colour?: string;
    iconUrl?: string;
    url?: string;
}

export default interface IChatReply {
    channelId?: string;
    content?: string;
    embeds?: IChatEmbed[];
    react?: string;
};
