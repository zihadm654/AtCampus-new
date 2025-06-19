import {
	adminClient,
	customSessionClient,
	inferAdditionalFields,
	// magicLinkClient,
	twoFactorClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "../../../server/src/lib/auth";
import { ac, roles } from "../../../server/src/lib/permissions";

const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	plugins: [
		inferAdditionalFields<typeof auth>(),
		adminClient({ ac, roles }),
		customSessionClient<typeof auth>(),
		// magicLinkClient(),
		usernameClient(),
		twoFactorClient(),
	],
});

export const {
	signIn,
	signUp,
	signOut,
	useSession,
	admin,
	sendVerificationEmail,
	forgetPassword,
	resetPassword,
	updateUser,
} = authClient;
