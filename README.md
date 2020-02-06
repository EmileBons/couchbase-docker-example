# 👨‍🏫 couchbase-docker-example
An example of running Couchbase Server and Couchbase Sync Gateway in Docker using docker-compose. This repository is to
be used for explanatory use only. Credentials for the Couchbase Server are being generated and used for configuration,
server configuration is done with bare-minimum values. This example will run with minimal resources and logging in would
be possible for anyone knowing these credentials. Therefore this disclaimer. This example will create a Couchbase server
with two buckets: 'active' and 'archive'. The first bucket will be available in the Sync Gateway.

### Sync function in separate file
While developing, I found it very impractical to have the sync-function in the configuration of the Sync Gateway. The
configuration is in JSON and JavaScript-code does not belong in a JSON-configuration. I could not find a way to tell my
IDE to ignore errors about having JavaScript in JSON and I found it ugly. That's why I added a bash-function for the
Sync Gateway which parses the sync-function from a separate file and puts it in the JSON configuration, to be used by
the Sync Gateway. For the sake of this example I added a sync-function which requires each document to have an attribute
called 'type'.

## Usage
1. Start the server-container and the sync-gateway-container. The sync-gateway-container will during startup wait for
the configuration of the server-container. During the first startup, the initialization of the cluster will be performed
and the bucket will be created.

        docker-compose up
2. Check whether the Couchbase Sync Gateway started properly by accessing the REST API from the web browser.

        http://localhost:4984
3. The response of the Couchbase Sync Gateway should be comparable to the example below.

        {"couchdb":"Welcome","vendor":{"name":"Couchbase Sync Gateway","version":"2.6"},"version":"Couchbase Sync Gateway/2.6.0(127;b4c828d) EE"}
