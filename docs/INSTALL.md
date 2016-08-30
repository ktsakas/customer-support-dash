## Installation Instructions

### Configure ElasticSearch
The installation requires a running instance of ElasticSearch with all the Rally data imported, [configured](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-configuration.html) with the following options:

```
# Enable cors if you want to use the frontend from a remote location
http.cors.enabled: true
http.cors.allow-origin: "*"
# Set the host to this in order to expose the ElasticSearch instance publicly
network.host: "0.0.0.0"
# Enable groovy scripts
script.inline: true
script.groovy: true
```

Note, you might want to further restrict the above configuration to avoid security vulnerabilities.

### Install
Requirements NodeJS, ElasticSearch.

Assuming you are already running an instance of ElasticSearch and have pulled in the data from Rally, do the following in order to run the project.

```
git clone https://github.com/ktsakas/customer-support-dash.git
```

```
cd customer-support-dash
```

```
npm install
```

```
node server
```

You will see the message "Listening on port 8080...".

You can now access the app through that port.