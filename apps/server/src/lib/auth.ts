import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
	admin,
	customSession,
	// magicLink,
	twoFactor,
	username,
} from "better-auth/plugins";
import prisma from "../../prisma";

import { hashPassword, verifyPassword } from "../lib/argon2";
import { ac, roles } from "../lib/permissions";
import { normalizeName, VALID_DOMAINS } from "../utils";

const options = {
	account: {
		accountLinking: {
			enabled: false,
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	database: prismaAdapter(prisma, {
		provider: "mongodb",
	}),
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

					if (ADMIN_EMAILS.includes(user.email)) {
						return { data: { ...user, role: "INSTITUTION" } };
					}

					return { data: user };
				},
			},
		},
	},
	emailAndPassword: {
		autoSignIn: false,
		enabled: true,
		minPasswordLength: 6,
		password: {
			hash: hashPassword,
			verify: verifyPassword,
		},
		requireEmailVerification: false,
		//  sendResetPassword: async ({ user, url }) => {
		//    await sendEmailAction({
		//      to: user.email,
		//      subject: "Reset your password",
		//      meta: {
		//        description: "Please click the link below to reset your password.",
		//        link: String(url),
		//      },
		//    });
		//  },
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		expiresIn: 60 * 60,
		sendOnSignUp: true,
		//  sendVerificationEmail: async ({ user, url }) => {
		//    const link = new URL(url);
		//    link.searchParams.set("callbackURL", "/verify");

		//    await sendEmailAction({
		//      to: user.email,
		//      subject: "Verify your email address",
		//      meta: {
		//        description:
		//          "Please verify your email address to complete the registration process.",
		//        link: String(link),
		//      },
		//    });
		//  },
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				const email = String(ctx.body.email);
				const domain = email.split("@")[1].toLowerCase();

				if (!VALID_DOMAINS().includes(domain)) {
					throw new APIError("BAD_REQUEST", {
						message: "Invalid domain. Please use a valid email.",
					});
				}
				const name = normalizeName(ctx.body.name);

				return {
					context: { ...ctx, body: { ...ctx.body, name } },
				};
			}

			if (ctx.path === "/sign-in/magic-link") {
				const name = normalizeName(ctx.body.name);

				return {
					context: { ...ctx, body: { ...ctx.body, name } },
				};
			}

			if (ctx.path === "/update-user") {
				const name = normalizeName(ctx.body.name);

				return {
					context: { ...ctx, body: { ...ctx.body, name } },
				};
			}
		}),
	},
	plugins: [
		nextCookies(),
		username(),
		admin({
			ac,
			adminRoles: ["INSTITUTION", "PROFESSOR", "ORGANIZATION"],
			defaultRole: "STUDENT",
			roles,
		}),
		twoFactor(),
		//  magicLink({
		//    sendMagicLink: async ({ email, url }) => {
		//      await sendEmailAction({
		//        to: email,
		//        subject: "Magic Link Login",
		//        meta: {
		//          description: "Please click the link below to log in.",
		//          link: String(url),
		//        },
		//      });
		//    },
		//  }),
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
		expiresIn: 30 * 24 * 60 * 60,
		updateAge: 60 * 60 * 24,
	},
	socialProviders: {
		google: {
			clientId: String(process.env.GOOGLE_CLIENT_ID),
			clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
		},
	},
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	user: {
		additionalFields: {
			instituteId: {
				input: true,
				type: "string",
			},
			institution: {
				input: true,
				type: "string",
			},
			role: {
				input: true,
				type: ["STUDENT", "PROFESSOR", "INSTITUTION", "ORGANIZATION"],
			},
		},
	},
} satisfies BetterAuthOptions;

export const auth: any = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		customSession(async ({ user, session }) => {
			return {
				session: {
					expiresAt: session.expiresAt,
					token: session.token,
					userAgent: session.userAgent,
				},
				user: {
					banExpires: user.banExpires,
					banned: user.banned,
					banReason: user.banReason,
					createdAt: user.createdAt,
					displayUsername: user.displayUsername,
					email: user.email,
					emailVerified: user.emailVerified,
					id: user.id,
					image: user.image,
					name: user.name,
					role: user.role,
					twoFactorEnabled: user.twoFactorEnabled,
					updatedAt: user.updatedAt,
					username: user.username,
				},
			};
		}, options),
	],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
