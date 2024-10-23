import Group, { GroupDocument } from "@filego/database/mongoose/models/group";
import { createOrUpdateHistory } from "@filego/database/mongoose/models/history";
import Message, {
  MessageDocument,
} from "@filego/database/mongoose/models/message";
import Notification from "@filego/database/mongoose/models/notification";
import User, { UserDocument } from "@filego/database/mongoose/models/user";
import assert, { AssertionError } from "assert";
import isValidObjectId from "@filego/database/mongoose/isValidObjectId";
import History from "@filego/database/mongoose/models/history";

/** 初次获取历史消息数 */
const FirstTimeMessagesCount = 15;

async function pushNotification(
  notificationTokens: string[],
  message: MessageDocument,
  groupName?: string
) {
  const content =
    message.type === "text" ? message.content : `[${message.type}]`;
  const pushMessages = notificationTokens.map((notificationToken) => ({
    to: notificationToken,
    sound: "default",
    title: groupName || (message.from as any).username,
    body: groupName ? `${(message.from as any).username}: ${content}` : content,
    data: { focus: message.to },
  }));
  console.log(pushMessages);
}

export async function sendMessage(ctx: Context<SendMessageData>) {
  const { to, content } = ctx.data;
  let { type } = ctx.data;
  assert(to, "to不能为空");

  let toGroup: GroupDocument | null = null;
  let toUser: UserDocument | null = null;

  if (isValidObjectId(to)) {
    toGroup = await Group.findOne({ _id: to });
    assert(toGroup, "群组不存在");
  } else {
    const userId = to.replace(ctx.socket.user.toString(), "");
    toUser = await User.findOne({ id: userId });
    assert(toUser, "用户不存在");
  }

  let messageContent = content;
  if (type === "text") {
  }

  const user = await User.findOne(
    { _id: ctx.socket.user },
    {
      username: 1,
      avatar: 1,
      tag: 1,
    }
  );
  console.log("user ===>", user, ctx.socket.user);

  if (!user) {
    throw new AssertionError({ message: "用户不存在" });
  }

  const message = await Message.create({
    from: ctx.socket.user,
    to,
    type,
    content: messageContent,
  });

  const messageData = {
    _id: message._id,
    createTime: message.createTime,
    from: user.toObject(),
    to,
    type,
    content: message.content,
  };

  if (toGroup) {
    ctx.socket.emit((toGroup._id as string).toString(), "message", messageData);
    console.log(toGroup._id);

    const notifications = await Notification.find({
      user: {
        $in: toGroup.members,
      },
    });
    const notificationTokens: string[] = [];
    notifications.forEach((notification) => {
      if (notification.user?._id.toString() === ctx.socket.user.toString()) {
        return;
      }
      notificationTokens.push(notification.token);
    });
    if (notificationTokens.length) {
      pushNotification(notificationTokens, message);
    }
  }

  createOrUpdateHistory(ctx.socket.user.toString(), to, message._id as string);

  return messageData;
}

export async function getLinkmansLastMessagesV2(
  ctx: Context<{ linkmans: string[] }>
) {
  const { linkmans } = ctx.data;

  const histories = await History.find({
    user: ctx.socket.user,
    linkman: {
      $in: linkmans,
    },
  });

  const historyMap = histories
    .filter(Boolean)
    .reduce((result: { [linkman: string]: string }, history) => {
      result[history.linkman] = history.message;
      return result;
    }, {});

  const linkmansMessages = await Promise.all(
    linkmans.map(async (linkmanId) => {
      const messages = await Message.find(
        {
          to: linkmanId,
        },
        {
          type: 1,
          content: 1,
          from: 1,
          createTime: 1,
          deleted: 1,
        },
        {
          sort: { createTime: -1 },
          limit: historyMap[linkmanId] ? 100 : FirstTimeMessagesCount,
        }
      ).populate("from", { username: 1, avatar: 1, tag: 1 });
      return messages;
    })
  );

  type ResponseData = {
    [linkmanId: string]: {
      messages: MessageDocument[];
      unread: number;
    };
  };

  const responseData = linkmans.reduce(
    (result: ResponseData, linkmanId, index) => {
      const messages = linkmansMessages[index];
      if (historyMap[linkmanId]) {
        const messageIndex = messages.findIndex(
          ({ _id }) => (_id as string).toString() === historyMap[linkmanId]
        );
        result[linkmanId] = {
          messages: messages.slice(0, 15).reverse(),
          unread: messageIndex === -1 ? 100 : messageIndex,
        };
      } else {
        result[linkmanId] = {
          messages: messages.reverse(),
          unread: 0,
        };
      }
      return result;
    },
    {}
  );

  return responseData;
}
