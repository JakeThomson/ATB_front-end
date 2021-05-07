# Algorithmic Trading Backtesting System - User Interface

This application is the frontend code that runs the backtesting platform within the Algorithmic Trading Backtesting System. The other components of the system can be found here:
- [Backtesting Platform](https://github.com/JakeThomson/ATB_back-end)
- [Data Access API](https://github.com/JakeThomson/ATB_data-access-api)

The system was built entirely by me in 10 weeks for my final year project.
To find out more about this and other projects I've worked on, check out my website
[jake-t.codes](https://jake-t.codes)!

## Installation
1. You will need Node.JS installed and working on your system to run this project, download the recommended version 
[here](https://nodejs.org/en/download/).
   
<span style="font-size:14pt;">**NOTE:**</span> To check that node has been installed on your system properly, type `npm -v` into a cmd/terminal window.

2. Clone git repository onto your machine.
```
git clone https://github.com/JakeThomson/ATB_front-end
```

3. Go to project directory in cmd/terminal.
```
cd \path\to\project_directory\
```

4. Install all required libraries to run the UI.
```
npm install
```


## Running the application

To run the UI on your local machine, navigate to the project directory in cmd/terminal and use the command
```
npm run start
```

You will then be able to access the UI through the url https://localhost:3000

<span style="font-size:14pt;">**IMPORTANT:**</span> You will also need to be running the [Data Access API](https://github.com/JakeThomson/ATB_data-access-api) on your local machine in order to see data appear in the locally running UI.