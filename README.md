URL Shortener Microservice
=========================

Project

------------

User Stories

I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

When I visit that shortened URL, it will redirect me to my original link.

Sample Usage:

https://urlshortener-mzbanez.glitch.me/new/https://www.google.com
 
-------------------

Sample Output:

{"original_url":"https://www.google.com", "short_url":"http://urlshortener-mzbanez.glitch.me/07"}