import 'dotenv/config';
import { refreshAccessToken } from '../utils/ml-auth';

refreshAccessToken()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error al refrescar el token:', err);
    process.exit(1);
  });
