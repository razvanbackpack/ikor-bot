import IChatReply from "../interface/IChatReply";


export default class IkorUtil {
  static makeChatReply(type: "MESSAGE" | "EMBED" | "REACT", data: any): IChatReply {
    switch (type) {
      case "MESSAGE":
        return { content: data };
      case "EMBED":
        return { embeds: [{type: "Text", ...data}]};
      case "REACT":
        return { react: data };
    }
  };
}
