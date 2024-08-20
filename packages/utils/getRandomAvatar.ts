const AvatarCount = 15;

/** 获取随机头像 */
export default function getRandomAvatar() {
  const number = Math.floor(Math.random() * AvatarCount);
  return `/avatar/${number}.jpg`;
}
