import { getAppAsync } from "./cloudbase";

export interface CloudBaseUser {
  uid: string;
  phone?: string;
  isAnonymous?: boolean;
}

interface VerificationInfo {
  verification_id: string;
  is_user: boolean;
}

const VERIFICATION_PREFIX = "shiguang:sms-verification:";

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+86 ")) return trimmed;
  if (trimmed.startsWith("+86")) return `+86 ${trimmed.slice(3).trim()}`;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 11) return `+86 ${digits}`;
  if (digits.length === 13 && digits.startsWith("86")) {
    return `+86 ${digits.slice(2)}`;
  }
  return trimmed;
}

function verificationKey(phone: string) {
  return `${VERIFICATION_PREFIX}${normalizePhone(phone)}`;
}

function getUid(rawUser: unknown) {
  const user = rawUser as {
    uid?: string;
    id?: string;
    customUserId?: string;
    user_metadata?: { uid?: string };
  } | null;
  return (
    user?.uid ??
    user?.id ??
    user?.user_metadata?.uid ??
    user?.customUserId ??
    null
  );
}

function getPhone(rawUser: unknown) {
  const user = rawUser as {
    phone?: string;
    phoneNumber?: string;
  } | null;
  return user?.phone ?? user?.phoneNumber;
}

function toCloudBaseUser(rawUser: unknown, phone?: string): CloudBaseUser {
  const uid = getUid(rawUser);
  if (!uid) throw new Error("登录成功，但没有拿到用户 ID");
  return {
    uid,
    phone: phone ?? getPhone(rawUser),
    isAnonymous: Boolean((rawUser as { is_anonymous?: boolean })?.is_anonymous),
  };
}

async function db() {
  const app = await getAppAsync();
  return app.database();
}

async function saveUserProfile(user: CloudBaseUser) {
  const d = await db();
  const now = Date.now();
  const existing = await d.collection("users").where({ uid: user.uid }).limit(1).get();
  const data = {
    uid: user.uid,
    phone: user.phone ?? "",
    updatedAt: now,
  };

  if (existing.data[0]?._id) {
    await d.collection("users").doc(existing.data[0]._id).update(data);
    return;
  }

  await d.collection("users").add({
    ...data,
    createdAt: now,
  });
}

export async function sendSmsCode(phone: string): Promise<void> {
  const app = await getAppAsync();
  const auth = app.auth({ persistence: "local" });
  const phoneNumber = normalizePhone(phone);
  const verificationInfo = (await auth.getVerification({
    phone_number: phoneNumber,
    target: "ANY",
  })) as {
    verification_id?: string;
    is_user?: boolean;
  };

  if (!verificationInfo.verification_id) {
    throw new Error("验证码发送失败，请稍后再试");
  }

  window.localStorage.setItem(
    verificationKey(phoneNumber),
    JSON.stringify({
      verification_id: verificationInfo.verification_id,
      is_user: Boolean(verificationInfo.is_user),
    } satisfies VerificationInfo),
  );
}

export async function signInWithSms(
  phone: string,
  code: string,
): Promise<CloudBaseUser> {
  const app = await getAppAsync();
  const auth = app.auth({ persistence: "local" });
  const phoneNumber = normalizePhone(phone);
  const saved = window.localStorage.getItem(verificationKey(phoneNumber));
  if (!saved) throw new Error("请先获取短信验证码");

  const verificationInfo = JSON.parse(saved) as VerificationInfo;
  const loginState = await auth.signInWithSms({
    verificationInfo,
    verificationCode: code.trim(),
    phoneNum: phoneNumber,
  });

  window.localStorage.removeItem(verificationKey(phoneNumber));

  const user = toCloudBaseUser(loginState.user, phoneNumber);
  await saveUserProfile(user);
  return user;
}

export async function getCurrentUser(): Promise<CloudBaseUser | null> {
  const app = await getAppAsync();
  const auth = app.auth({ persistence: "local" });
  const rawUser = await auth.getCurrentUser();
  if (!rawUser) return null;

  const user = toCloudBaseUser(rawUser);
  if (!user.phone) {
    const d = await db();
    const profile = await d
      .collection("users")
      .where({ uid: user.uid })
      .limit(1)
      .get();
    user.phone = profile.data[0]?.phone as string | undefined;
  }
  return user;
}

export async function signOut(): Promise<void> {
  const app = await getAppAsync();
  await app.auth({ persistence: "local" }).signOut();
}
