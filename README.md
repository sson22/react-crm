# University Group Project 
CRM(Customer Relationship Management) platform was made using MERN stack with typescript.

# Key Functionalities 

User Authentication (User Register/Login/Logout functions)
Contact list (Customer/Employee contact list with Add/Edit/Delete functions)
Calendar (Add/Edit/Delete Meeting functions)
Profile (Add/Edit/Delete User details)
Email (Email Employee/Meeting alert email)

## Getting Started

Create a `.env` file and populate it with your MONGO_USER AND MONGO_PASS variables.

`./scripts/deps.sh` or `scripts/deps.bat`

Then `npm run start`.

## Installing Packages

The node_modules in the `root` and `client` folders are for two separate dependencies. Hence the two `npm i` commands.

If wanting to install a package, make sure you're in the appropriate directory (`root` or `client`) such that the package is installed to the correct directory.

## dotenv Config

Remember to input the following into your environment variable:

```
MONGO_USERNAME={INSERT MONGODB USERNAME HERE}
MONGO_PASSWORD={INSERT MONGODB USERNAME HERE}

ATLAS_URI=mongodb+srv://<username>:<password>@crmdatabase.tw55l.mongodb.net/DemoItems?retryWrites=true&w=majority

PASSPORT_KEY={INESRT PASSPORT KEY HERE}

EMAIL_HOST = smtp.gmail.com
EMAIL_USERNAME = {INSERT EMAIL USERNAME HERE}
EMAIL_PASSWORD = {INSERT EMAIL PASSWORD HERE}
EMAIL_SERVICE = gmail
ORIGIN_URL = http://localhost:3000
```

For the client folder, you need a seperate env file

```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_HOST_URL=http://localhost:3001/
```

## Sample User Information

Here are the usernames, emails and passwords for the sample users which will be used for testing purposes. Password won't show on the database as it has been encrypted.

**UPDATE - bcrypt enabled. New users encrypted using bcrypt are shown below**
The new paths for the sign-up and login of users are shown in userRouter.ts.
'/login' for users -> in Postman, go to Body tab, select x-www-form-urlencoded, input email and password in table
'/signup' for new users -> go to Body tab, select x-www-form-urlencoded, input email, password, name in table
'/logout' - logs out a user if one if already logged in. Otherwise just returns the list of all users

```
{
    "_id": "613719cc239bd41fd54a91a1",
    "name": "Yes Yes",
    "email": "yes@yes.com",
    "password": "yes"
},
{
    "_id": "613719a8239bd41fd54a919e",
    "name": "No No",
    "email": "no@no.com",
    "password": "no"
},
{
    "_id": "61371979239bd41fd54a919a",
    "name": "Admin Admin",
    "email": "admin@admin.com",
    "password": "admin"
}
{
    "_id": "6137194d239bd41fd54a9196",
    "name": "Individual",
    "email": "real@email.com",
    "password": "realPassword"
},
{
    "_id": "61371922239bd41fd54a9192",
    "name": "Mahee Hossain",
    "email": "mfhossain@student.unimelb.edu.au",
    "password": "maheePassword1"
},
{
    "_id": "61457315dba44d510c9a5de3",
    "name": "a",
    "email": "a",
    "password": "a"
}
```

## Creating new users

There is no registration of users in this website. The only way for a new user to be created is for the admin {NOTE: admin not yet created} to go to the admin page {NOTE: admin page not yet created} and create a new user using the createUser function.
When new users are created, they are assigned a random string of letters and numbers as a password. This password is not meant to be known by anyone, and instead the user needs to reset their password by enterring their password in the reset password page {NOTE: reset password page not yet created} and enterring their email (the sendPasswordLink function). They will be sent a reset password link which takes them to the new password page (NOTE: new password page not yet created) where they can enter a new password (the resetPassword function), and their password should be set.

## Stock Image Credits

We would like to give credit to the following Unsplash users for their images
Tobias Rademacher - https://unsplash.com/@tobbes_rd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
Benyamin Bohlouli - https://unsplash.com/@benyamin_bohlouli?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
Eugene Golovesov - https://unsplash.com/@eugene_golovesov?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
Aydin Hassan - https://unsplash.com/@aydinhassan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
Zetong Li - https://unsplash.com/@zetong?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
Hans Isaacson - https://unsplash.com/@hans_isaacson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText

## Image addition to users

During user creation, a random stock image (from the Unsplash users above) will be assigned to each user. The admin does not currently have access to changing a user's profile picture - the user is the only person who can change their own profile picture. When changing an image, the previous image is deleted from the database to save space.
