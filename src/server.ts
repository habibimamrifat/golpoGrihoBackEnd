import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { BannerServeces } from './app/banner/banner.servicces';

const port = config.PORT;

async function main() {
  try {
    await mongoose.connect(config.DataBase_Url as string);
    await BannerServeces.createBanner();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log('server error', err);
  }
}
main();
