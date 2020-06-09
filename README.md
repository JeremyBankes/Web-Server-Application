# Web-Server-Application
A web server application built to serve multiple websites. This allows for different web pages to be served to the client depending on the domain used to make a request to the server. This is useful for serving multiple websites on the same machine, address and port.

To install a new site, create a folder in sites/ directoy with the name of the domain you wish to serve the pages on. For example name the directory 'google.com' to serve web pages with the google.com domain.

The included example code will serve a different webpage to http://localhost:80 and http://127.0.0.1