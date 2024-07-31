### Master Gaming

Master Gaming is a gaming news site. There are posts and videos there. Posts include tags to make it easier to search by interest.
Old site link on netlify - https://master-gaming.netlify.app/ 

Right now you can't login or create a post, but maybe I will do it. *Sad face*
### Before start project, install Node.js ^v21.6.x and npm ^v8.16.x.

Go inside 2 folders: Master_Gaming_backend and Master_Gaming_frontend to use "npm i"

### `npm start` inside Master_Gaming_frontend

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build` inside Master_Gaming_frontend (if you need)

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

Used to push on site, like netlify.

### `npm start` inside Master_Gaming_backend

Use it to connect database and site.

Before start create .env file in backend with port and db connection data (If use aiven db):
SERVER_PORT = 5000
USER = ""
PASSWORD = ""
HOST = ""
DB_PORT = 
DB = ""
CA = ""
(If use railway db):
SERVER_PORT = 5000
POOL = ""