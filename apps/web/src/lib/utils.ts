import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict } from "date-fns";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function constructMetadata({
	title = siteConfig.name,
	description = siteConfig.description,
	image = siteConfig.ogImage,
	icons = "/_static/favicon.ico",
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	icons?: string;
	noIndex?: boolean;
} = {}): Metadata {
	return {
		title,
		description,
		keywords: [
			"Next.js",
			"React",
			"Prisma",
			"MongoDB",
			"Tailwind CSS",
			"Better-auth",
			"shadcn ui",
			"Register",
			"Login",
			"atCampus",
		],
		authors: [
			{
				name: "zihadm654",
			},
		],
		creator: "zihadm654",
		openGraph: {
			type: "website",
			locale: "en_US",
			url: siteConfig.url,
			title,
			description,
			siteName: title,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
			creator: "@zihadm654",
		},
		icons,
		metadataBase: new URL(siteConfig.url),
		manifest: `${siteConfig.url}/site.webmanifest`,
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}
export function formatRelativeDate(from: Date) {
	const currentDate = new Date();
	if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
		return formatDistanceToNowStrict(from, { addSuffix: true });
	}
	if (currentDate.getFullYear() === from.getFullYear()) {
		return formatDate(from, "MMM d");
	}
}

export function formatNumber(n: number): string {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n);
}

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

export const generateUsername = (name: string) => {
	const nameParts = name.split(/\s+/);
	const truncatedName = nameParts.slice(0, 5).join(" ");
	const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
	return `${truncatedName.replace(/\s+/g, "").toLowerCase()}${randomNumbers}`;
};
export const VALID_DOMAINS = () => {
	const domains = ["gmail.com", "yahoo.com", "outlook.com"];

	if (process.env.NODE_ENV === "development") {
		domains.push("example.com");
	}

	return domains;
};
export function normalizeName(name: string) {
	return name
		.trim()
		.replace(/\s+/g, " ")
		.replace(/[^a-zA-Z\s'-]/g, "")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
export function formatDate(date: Date, formatString: string): string {
	return format(date, formatString);
}
// export function formatDate(from: Date, input: string | number): string {
//   const date = new Date(input);
//   return date.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// }

export function absoluteUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`;
}

// Utils from precedent.dev
export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
	if (!timestamp) return "never";
	const now = Date.now();
	const seconds = Math.round((now - new Date(timestamp).getTime()) / 1000);

	if (seconds < 5) {
		return "just now";
	}

	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return `${interval} years${timeOnly ? "" : " ago"}`;
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return `${interval} months${timeOnly ? "" : " ago"}`;
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return `${interval} days${timeOnly ? "" : " ago"}`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return `${interval} hours${timeOnly ? "" : " ago"}`;
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return `${interval} minutes${timeOnly ? "" : " ago"}`;
	}
	if (seconds < 60) {
		return `${Math.floor(seconds)} seconds${timeOnly ? "" : " ago"}`;
	}

	return `${Math.floor(seconds)} seconds${timeOnly ? "" : " ago"}`;
};

export async function fetcher<JSON>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const res = await fetch(input, init);

	if (!res.ok) {
		const json = await res.json();
		if (json.error) {
			const error = new Error(json.error) as Error & {
				status: number;
			};
			error.status = res.status;
			throw error;
		}
	}

	return res.json();
}

export function nFormatter(num: number, digits?: number) {
	if (!num) return "0";
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "G" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	const item = lookup
		.slice()
		.reverse()
		.find((item) => num >= item.value);
	return item
		? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
		: "0";
}

export function capitalize(str: string) {
	if (!str || typeof str !== "string") return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length)}...`;
};

// export const getBlurDataURL = async (url: string) => {
//   if (!url) {
//     return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
//   }

//   if (url.startsWith("/_static/")) {
//     url = `${siteConfig.url}${url}`;
//   }

//   try {
//     const response = await fetch(
//       `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`
//     );
//     const buffer = await response.arrayBuffer();
//     const base64 = Buffer.from(buffer).toString("base64");

//     return `data:image/png;base64,${base64}`;
//   } catch (error) {
//     return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
//   }
// };
