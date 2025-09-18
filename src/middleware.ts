import { NextResponse, NextRequest } from "next/server";

export const config = {
	matcher: ["/dashboard/:path*"],
};

const REFRESH_THRESHOLD_SECONDS = 30;

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const accessToken = req.cookies.get("accessToken")?.value;
	const refreshToken = req.cookies.get("refreshToken")?.value;

	if (!refreshToken) {
		return logoutRedirect(url);
	}

	if (accessToken && !isExpiring(accessToken, REFRESH_THRESHOLD_SECONDS)) {
		return NextResponse.next();
	}

	try {
		const res = await fetch(new URL("/api/auth/refresh", req.url), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) {
			return logoutRedirect(url);
		}

		const json = await res.json();
		const data = json?.data ?? json?.result ?? json;

		if (!data?.accessToken || !data?.refreshToken) {
			return logoutRedirect(url);
		}

		const next = NextResponse.next();
		const maxAge = Number(data?.expiresIn ?? 60 * 60 * 24 * 7);

		next.cookies.set("accessToken", data.accessToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge,
		});
		next.cookies.set("refreshToken", data.refreshToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge,
		});

		return next;
	} catch (e) {
		return logoutRedirect(url);
	}
}

function logoutRedirect(url: URL) {
	const res = NextResponse.redirect(new URL("/login", url.origin));
	res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
	res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
	return res;
}

/**
 * Decodifica el JWT (sin verificar firma) y ve si expira en <= threshold.
 */
function isExpiring(token: string, thresholdSeconds = 0) {
	try {
		const [, payload] = token.split(".");
		const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
		const exp: number | undefined = json?.exp;
		if (!exp) return true;
		const now = Math.floor(Date.now() / 1000);
		return exp - now <= thresholdSeconds;
	} catch {
		return true;
	}
}
