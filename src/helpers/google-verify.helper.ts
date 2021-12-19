import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../config';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function googleVerify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    name: payload?.name,
    img: payload?.picture,
    email: payload?.email,
  };

  // TypeScript no me deja, pero SI funciona normalmente en JS.
  // const { name, picture, email } = ticket.getPayload();
  // return {
  //   name,
  //   img: picture,
  //   email,
  // };
}
// verify().catch(console.error);
