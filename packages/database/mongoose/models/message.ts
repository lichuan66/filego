import { Schema, Document, model } from "mongoose";
import User from "./user";
import Group from "./group";

const MessageSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now,
    index: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: String,
    index: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "file", "code", "invite"],
    default: "text",
  },
  content: {
    type: String,
    default: "",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export interface MessageDocument extends Document {
  /** 发送人 */
  from: string;
  /** 接受者, 发送给群时为群_id, 发送给个人时为俩人的_id按大小序拼接后值 */
  to: string;
  /** 类型, text: 文本消息, image: 图片消息, code: 代码消息, invite: 邀请加群消息, system: 系统消息 */
  type: string;
  /** 内容, 某些消息类型会存成JSON */
  content: string;
  /** 创建时间 */
  createTime: Date;
  /** Has it been deleted */
  deleted: boolean;
}

/**
 * Message Model
 * 聊天消息
 */
const Message = model<MessageDocument>("Message", MessageSchema);

export default Message;

interface SendMessageData {
  to: string;
  type: string;
  content: string;
}

export async function handleInviteMessage(message: SendMessageData) {
  if (message.type === "invite") {
    const inviteInfo = JSON.parse(message.content);
    if (inviteInfo.inviter && inviteInfo.group) {
      const [user, group] = await Promise.all([
        User.findOne({ _id: inviteInfo.inviter }),
        Group.findOne({ _id: inviteInfo.group }),
      ]);
      if (user && group) {
        message.content = JSON.stringify({
          inviter: inviteInfo.inviter,
          inviterName: user.username,
          group: inviteInfo.group,
          groupName: group.name,
        });
      }
      console.log(message.content, 1234);
    }
  }
}

export async function handleInviteMessages(messages: SendMessageData[]) {
  return Promise.all(
    messages.map(async (message) => {
      if (message.type === "invite") {
        await handleInviteMessage(message);
      }
    })
  );
}
