# Schedule Manager 
A Simple work order schedule management application. It provides basic client service request scheduling and
daily appointment tracking. 

For the application session storage, `Schedule Manager` utilizes  [react-persistent-store-manager](https://www.npmjs.com/package/react-persistent-store-manager), a simple peristent state management library that leverages `localforage` and `pullstate`

## Getting Started

### Docker
To create a docker image of the application using docker compose, do the following:

``` bash
$  docker-compose build
```
After a successful build, from the same terminal run the folowing command to start the developemt server:

``` bash
$  docker-compose up
```
Wait a little while and allow the server to starts. Open a new browser window and past `http://localhost:3001/` in the url bar of the browser. You application should come up with the default email screen. Provide your email and proceed to the scheduler page.

### NPM
While you can run the application by cerating a docker image, you can also run directly via `npm`

To create a developement build, run the following commamnd:

``` npm
npm run build

```

And to start the application, run this command:

``` npm
npm run start

```

## How to Schedule a Work Order

On the schedule page, do the following:

1. Click on the `Schedule` tab to request a schedule.
2. The email is prefilled for you, so there is no need to enter email address.
3. Click on the menu icon on the `select service field` and select desired service.
4. Click on the `submit request` button.  

## How Search Scedule 

When the  schedule page loads, it loads all the request made by current application user within the date range.
If there are no current schedule by user, the calendar will be empty.

To search schedule using either the `service id` or the date range, do the following:

### Search by Service ID 
1. Enter the `service id` in the service ID field
2. Click on the `Search` button. 
   
   If there is an existing schedule with the  `service id`, the service will be listed. Of there are no service meetign the search criteria, the default schedules loaded when page loads is reloaded. 
 
### Search by Service Date Range
1. Select the From Date
2. Select the ToDate.
3. If you enter a  `service id` in the service ID field, it will be use as part of the search
   returning service schedule within date range and having the provided id. `this is optional`
4. Click on the `Search` button.

## Demo Site
Check out the demo site via this [Demo Site](https://service-manager.netlify.app/schedule)

I welcome contributions with love 😄😄🌺🌺🎆🎆
