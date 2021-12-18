import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../config';

// interface GoogleSignIn extends TokenPayload {
//   name?: string;
//   picture?: string;
//   email?: string;
// }

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function googleVerify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  // const { name, picture, email } = ticket.getPayload();
  const payload = ticket.getPayload();

  console.log(payload);

  // return {
  //   name,
  //   img: picture,
  //   email,
  // };
}
// verify().catch(console.error);
