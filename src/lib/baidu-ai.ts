interface BaiduTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface BaiduDishResponse {
  result?: {
    name?: string;
    probability?: number | string;
  }[];
  error_code?: number;
  error_msg?: string;
}

let cachedToken: {
  value: string;
  expiresAt: number;
} | null = null;

const MIN_DISH_PROBABILITY = 0.2;

function getCredentials() {
  const apiKey = process.env.BAIDU_API_KEY;
  const secretKey = process.env.BAIDU_SECRET_KEY;
  if (!apiKey || !secretKey) {
    throw new Error("缺少百度 AI 环境变量");
  }
  return { apiKey, secretKey };
}

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.value;
  }

  const { apiKey, secretKey } = getCredentials();
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: apiKey,
    client_secret: secretKey,
  });

  const res = await fetch("https://aip.baidubce.com/oauth/2.0/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) throw new Error(`百度 AI token 获取失败: ${res.status}`);

  const data = (await res.json()) as BaiduTokenResponse;
  if (!data.access_token) {
    throw new Error(
      `百度 AI token 响应异常: ${data.error ?? "unknown"} ${
        data.error_description ?? ""
      }`,
    );
  }

  const expiresIn = data.expires_in ?? 0;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 0) * 1000,
  };

  return data.access_token;
}

export async function recognizeFood(
  imageBase64: string,
): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();
    const params = new URLSearchParams({
      image: imageBase64,
    });

    const res = await fetch(
      `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${encodeURIComponent(
        accessToken,
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as BaiduDishResponse;
    if (data.error_code) {
      console.warn("Baidu dish API returned error", {
        errorCode: data.error_code,
        errorMessage: data.error_msg,
      });
      return null;
    }

    const top = data.result?.[0];
    const name = top?.name?.trim();
    const probability = Number(top?.probability ?? 0);

    if (!name || probability < MIN_DISH_PROBABILITY) {
      console.info("Baidu dish API returned low-confidence result", {
        name,
        probability,
      });
      return null;
    }

    console.info("Baidu dish API accepted result", {
      name,
      probability,
    });
    return name;
  } catch (error) {
    console.error("Baidu food recognition failed", error);
    return null;
  }
}
