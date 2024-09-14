### Master Gaming

Master Gaming is a gaming news site. There are posts and videos there. Posts include tags to make it easier to search by interest. \
Link on netlify - https://master-gaming.netlify.app/ 

Due to some issues, I return to aiven database (maybe I will change due to small space, but it will be np) and make serverless on vercel. \
You can login and write comment. To make post you need to have permission. \
I don't have to much to update, just make some more buttons. \

### Before start project, install Node.js ^v21.6.x and npm ^v8.16.x.

Go inside 2 folders: Master_Gaming_backend and Master_Gaming_frontend to use "npm i"

### `npm start` inside Master_Gaming_frontend

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build` (if you need)

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

Used to push on site, like netlify.

### `npm start` or `npm run dev` inside Master_Gaming_backend

Use it to connect database and site.

Before start create .env file in backend with port and db connection data:
SERVER_PORT = 5000
POOL = connention URL with password and else