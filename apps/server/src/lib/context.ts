import type { Context as HonoContext } from "hono";
import { auth } from "./auth";
import { User } from "@/db/models/auth.model";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  let user = null;
  if (session?.user?.id) {
    user = await User.findById(session.user.id).select("city").lean();
  }

  return {
    session: {
      session: {
        ...session?.session,
        city: user?.city
      },
      user: {
        ...session?.user,
        city: user?.city
      }
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
