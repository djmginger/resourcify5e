# Resourcify5e
Resourcify5e is a full stack website that utilizes the MERN stack in order to provide both an intuitive UI, and a Mongo Database connected to a server that provides users the ability to create their own 5th Edition Dungeons and Dragons character, and easily track their resources.

## Front End 
The front end of the website is built with a combination of React.js, HTML, CSS, and React-Bootstrap. The multi-page functionality is achieved by using React Router to handle navigation and url changes. The structure of this website can be broken down into Pages and Components, where each Page is comprised of multiple Components, and represents a unique URL that a user is able to visit.

This front end is fully responsive, and supports the full variety of devices ranging from phones up to full size desktops.

A majority of the Pages that make up this website are protected, meaning a user is unable to view them without first logging in. This is achieved by utilizing React Context, and a matching Provider component that checks the status of the user login, and redirects back to the Login page when it determines a user is not properly logged in.

## Back End
The back end of this website uses Node.js, Express.js, MongoDB, and the Mongoose library. Once started, the server will automatically attempt connection to the remote Mongo Database.

The server consists of Router-level middleware, each of which has it's own controller that handles the server side functionality for each corresponding front-end page. The requests to this back end are made via the axios library.

Upon a successful login, the server generates a JSON Web Token, and stores it within a cookie. This cookie is then used whenever a user attempts to perform a function that alters the Mongo Database in any way: if the JSON Web Token cannot be properly verified, then the request to the server does not complete.

## Image Gallery
The following images show examples of what each page looks like, populated with example data.
<hr>
<p float="left" align="middle">
<img align="top" title="Login page" src="https://github.com/djmginger/resourcify5e/assets/68353048/7ea82785-1192-4c37-ad1d-0cc1ae6e7273" width="400"/>
<img align="top" title="Character List page. Redirected here after a successful login" src="https://github.com/djmginger/resourcify5e/assets/68353048/a79c684b-2ebf-4fb8-b1cd-7590af693c73" width="400"/>
</p>
<p float="left" align="middle">
<img align="top" title="Form to add a new character" src="https://github.com/djmginger/resourcify5e/assets/68353048/aee75d28-8fef-4b00-bbf3-b8829c19e41d" width="400"/>
<img align="top" title="Character Display page. Redirected here after selecting a character from the list" src="https://github.com/djmginger/resourcify5e/assets/68353048/2625dba5-b6fd-4714-a06d-34352c415bd6" width="400"/>
</p>
<p float="left" align="middle">
<img align="top" title="Navbar menu shown for mobile devices" src="https://github.com/djmginger/resourcify5e/assets/68353048/f2a3f16d-f130-4a7e-a434-4e9c0cf912bd" width="400"/>
<img align="top" title="Profile page" src="https://github.com/djmginger/resourcify5e/assets/68353048/1adf8a0e-6887-4e2a-95fb-044f9c4fe510" width="400"/>
</p>
<hr>
