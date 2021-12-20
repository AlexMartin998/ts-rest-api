import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../config';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

interface GoogleTokenPayload {
  name: string;
  email: string;
  img?: string;
  picture?: string;
}

export async function googleVerify(token: string): Promise<GoogleTokenPayload> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload() as GoogleTokenPayload;
  return {
    name,
    img: picture,
    email,
  };
}
// verify().catch(console.error);
