import app from './app';
import { PORT } from './config';

console.clear();

export const server = app.listen(PORT, () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    PORT,
    app.get('env')
  );
  console.log('  Press CTRL+C to stop\n');
});
