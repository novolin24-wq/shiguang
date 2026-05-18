import { getAppAsync } from "./cloudbase";

const INVITE_TTL = 24 * 60 * 60 * 1000;

interface RelationDoc {
  _id?: string;
  userA?: string;
  userB?: string;
  inviteCode?: string;
  status?: "pending" | "accepted" | "active" | "expired";
  expiresAt?: number;
}

async function db() {
  const app = await getAppAsync();
  return app.database();
}

function createInviteCode() {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

async function findActivePartner(userId: string) {
  const d = await db();
  const res = await d
    .collection("relations")
    .where({ userA: userId, status: "active" })
    .limit(1)
    .get();
  return res.data[0] as RelationDoc | undefined;
}

async function ensureNoPartner(userId: string) {
  const existing = await findActivePartner(userId);
  if (existing?.userB) throw new Error("已经绑定过伙伴了");
}

export async function generateInviteCode(userId: string): Promise<string> {
  await ensureNoPartner(userId);

  const d = await db();
  const now = Date.now();

  for (let i = 0; i < 5; i += 1) {
    const inviteCode = createInviteCode();
    const existing = await d
      .collection("relations")
      .where({ inviteCode, status: "pending" })
      .limit(1)
      .get();

    if (existing.data.length > 0) continue;

    await d.collection("relations").add({
      userA: userId,
      inviteCode,
      status: "pending",
      createdAt: now,
      expiresAt: now + INVITE_TTL,
    });
    return inviteCode;
  }

  throw new Error("邀请码生成失败，请稍后再试");
}

export async function acceptInvite(code: string, userId: string): Promise<void> {
  const inviteCode = code.trim();
  if (!/^\d{6}$/.test(inviteCode)) throw new Error("邀请码应为 6 位数字");

  const d = await db();
  const now = Date.now();
  const inviteRes = await d
    .collection("relations")
    .where({ inviteCode, status: "pending" })
    .limit(1)
    .get();
  const invite = inviteRes.data[0] as RelationDoc | undefined;

  if (!invite?._id || !invite.userA) throw new Error("邀请码不存在或已失效");
  if (invite.expiresAt && invite.expiresAt < now) {
    await d.collection("relations").doc(invite._id).update({
      status: "expired",
      expiredAt: now,
    });
    throw new Error("邀请码已过期");
  }
  if (invite.userA === userId) throw new Error("不能绑定自己");

  await ensureNoPartner(userId);
  await ensureNoPartner(invite.userA);

  await d.collection("relations").doc(invite._id).update({
    status: "accepted",
    userB: userId,
    acceptedAt: now,
  });
  await d.collection("relations").add({
    userA: invite.userA,
    userB: userId,
    status: "active",
    sourceInviteCode: inviteCode,
    createdAt: now,
  });
  await d.collection("relations").add({
    userA: userId,
    userB: invite.userA,
    status: "active",
    sourceInviteCode: inviteCode,
    createdAt: now,
  });
}

export async function getPartner(
  userId: string,
): Promise<{ uid: string; phone: string } | null> {
  const relation = await findActivePartner(userId);
  if (!relation?.userB) return null;

  const d = await db();
  const userRes = await d
    .collection("users")
    .where({ uid: relation.userB })
    .limit(1)
    .get();
  const partner = userRes.data[0] as
    | {
        uid?: string;
        phone?: string;
      }
    | undefined;

  return {
    uid: relation.userB,
    phone: partner?.phone ?? "",
  };
}
