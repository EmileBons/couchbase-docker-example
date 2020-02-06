#!/usr/bin/env bash
function=$(cat /etc/sync_gateway/sync_functions/active.js | sed -e 's/|/\\|/g' | tr '\n' ' ')
sed 's|"{{ sync_function_active }}"|`'"$function"'`|g' /etc/sync_gateway/template.json > /etc/sync_gateway/config.json
sed -i 's/\\n/\
/g' /etc/sync_gateway/config.json

couchbase_server_url=`cat /etc/sync_gateway/config.json | grep '"server":' | grep -o '"http://.*"' | sed 's/"//g'`

while ! { curl -X GET -u Administrator:password $couchbase_server_url/pools/default/buckets -H "accept: application/json" -s | grep -q '"status":"healthy"'; }; do
  echo "Waiting for the Couchbase server on $couchbase_server_url to become available"
  sleep 10
done

/entrypoint.sh /etc/sync_gateway/config.json
