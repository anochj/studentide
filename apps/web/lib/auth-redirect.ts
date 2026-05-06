export const AUTH_REDIRECT_PARAM = "redirect";
export const DEFAULT_AUTH_REDIRECT_PATH = "/project-definitions";

const blockedRedirectPaths = new Set(["/login", "/signup"]);

export function getSafeAuthRedirectPath(
	value: string | string[] | null | undefined,
	fallback = DEFAULT_AUTH_REDIRECT_PATH,
) {
	const redirectPath = Array.isArray(value) ? value[0] : value;

	if (
		!redirectPath ||
		!redirectPath.startsWith("/") ||
		redirectPath.startsWith("//")
	) {
		return fallback;
	}

	try {
		const url = new URL(redirectPath, "http://studentide.local");

		if (url.origin !== "http://studentide.local") {
			return fallback;
		}

		if (blockedRedirectPaths.has(url.pathname)) {
			return fallback;
		}

		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return fallback;
	}
}

export function getAuthPageHref(
	pathname: "/login" | "/signup",
	redirectPath: string | null | undefined,
) {
	const safeRedirectPath = getSafeAuthRedirectPath(redirectPath, "");

	if (!safeRedirectPath) {
		return pathname;
	}

	const params = new URLSearchParams({
		[AUTH_REDIRECT_PARAM]: safeRedirectPath,
	});

	return `${pathname}?${params}`;
}
