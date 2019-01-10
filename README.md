Testing out react/mobx with a springboot/mongo backend


To run (dev mode):
``` 
    yarn   
    yarn start
```

Backend: run mongo and respective jar (not in repo)  
```
    mongod   
    java -jar {springboardapp}.jar
```
API:   
    getAll: {host}:{port}/customers.json   
    getByLastName: {host}:{port}/customers/{lastName}.json

CustomerViewInCallbacks: version without mobx global state