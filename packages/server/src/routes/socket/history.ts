import isValidObjectId from "@filego/database/mongoose/isValidObjectId";
import User from "@filego/database/mongoose/models/user";
import Group from "@filego/database/mongoose/models/group";
import Message from "@filego/database/mongoose/models/message";
import assert from "assert";
import { createOrUpdateHistory } from "@filego/database/mongoose/models/history";

export async function updateHistory(
  ctx: Context<{ linkmanId: string; messageId: string }>
) {
  const { linkmanId, messageId } = ctx.data;
  const self = ctx.socket.user.toString();
  if (!isValidObjectId(messageId)) {
    return { msg: `not update with invalid messageId:${messageId}` };
  }

  const [user, linkman, message] = await Promise.all([
    User.findOne({ _id: self }),
    isValidObjectId(linkmanId)
      ? Group.findOne({ _id: linkmanId })
      : User.findOne({ _id: linkmanId.replace(self, "") }),
    Message.findOne({ _id: messageId }),
  ]);
  assert(user, "用户不存在");
  assert(linkman, "联系人不存在");
  assert(message, "消息不存在");

  await createOrUpdateHistory(self, linkmanId, messageId);

  return { msg: "ok" };
}
