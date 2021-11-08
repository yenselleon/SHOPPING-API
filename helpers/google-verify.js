const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_ID_KEY);

const googleVerify = async (idToken = '')=>  {

  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_ID_KEY,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const {email:correo,name, picture:img} = ticket.getPayload();
  
  return {
      correo,
      name,
      img
  };
}


module.exports = {
    googleVerify,
}