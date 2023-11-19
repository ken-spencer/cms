import { SignJWT } from "jose";
import auditLog from "../log/audit";
import verifyJWT from "./verifyJWT";

import loadUser from "./loadUser";

const secret = new TextEncoder().encode(process.env.SECRET);
const alg = "HS256";

export default async function revalidate(cookies) {
  const claims = await verifyJWT();

  if (!claims) {
    return false;
  }

  const secondsRemaining = Math.round((claims.exp - Date.now() / 1000));

  if (secondsRemaining > 1800) {
    return null;
  }

  const user = await loadUser();

  if (!user) {
    return false;
  }
  const session = user.session;

  // additional security check, may want to audit this


  if (session.user._id.toString() !== claims.sub) {
    return false;
  }

  // extend session date to max of 1 hour
  const date = new Date();
  session.expiresAt = date.setMinutes(date.getMinutes() + 60);
  await session.save();

  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(session.expiresAt.getTime() / 1000)
    .sign(secret);

  cookies.set("auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    expires: session.expiresAt.getTime(),
  });

  const publicToken = cookies.get("authPublic");
  cookies.set("authPublic", publicToken, {
    httpOnly: false,
    secure: true,
    sameSite: "Strict",
    expires: session.expiresAt.getTime(),
  });

  auditLog("revalidate", null, {}, session.user);

  return true;
}
