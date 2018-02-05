# flow.js
Ajax asynchronic request with CORS support

* All requests is asynchronic sync is not supported
* Native Javascript no external libriares

### Work on all modern browsers even IE9+
  
> I'am homeless developer and if you like my work you can give lite support [HERE](http://ydk2.tk/en/#donate)  

## Sample 

>Change url to yours and try buttons click
 
~~~JS
        function get() {

            var values = {
                method: 'GET',
                url: "http://someuri?test=test_data",
                timeout: 2000
            };
            var _get = new flow(values)
                .ajax().then(function(content, stat, xhr) {
                    console.log(this.timer);
                    console.log(content);
                }).reject(function(e, stat, xhr) {
                    console.log(this.timer);
                    console.log(stat);
                });
        };

        function post() {

            var values = {
                method: 'POST',
                data: {
                    test_data: "test_data"
                },
                url: "http://someuri",
                timeout: 2000
            };
            var _post = new flow(values)
                .ajax().then(function(content, stat, xhr) {
                    console.log(this.timer);
                    console.log(content);
                }).reject(function(e, stat, xhr) {
                    console.log(this.timer);
                    console.log(stat);
                });
        };

        function corsget() {

            var values = {
                method: 'GET',
                url: "http://someuri?test=test_data",
                timeout: 2000
            };
            var _get = new flow(values)
                .cors().then(function(content, stat, xhr) {
                    console.log(this.timer);
                    console.log(content);
                }).reject(function(e, stat, xhr) {
                    console.log(this.timer);
                    console.log(stat);
                });
        };

        function corspost() {

            var values = {
                method: 'POST',
                data: {
                    test_data: "test_data"
                },
                url: "http://someuri",
                timeout: 2000
            };
            var _post = new flow(values)
                .cors().then(function(content, stat, xhr) {
                    console.log(this.timer);
                    console.log(content);
                }).reject(function(e, stat, xhr) {
                    console.log(this.timer);
                    console.log(stat);
                });
        };
~~~

### For working CORS you should add valid headers

Some like that below

> PHP sample

~~~PHP

	function Cors()
	{
		$request_headers = getallheaders();
		$origin = $request_headers['Origin'];
		header("Access-Control-Allow-Origin: $origin");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Max-Age: 1000");
		header("Access-Control-Allow-Headers: Custom, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
		header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
	}

~~~

> C# sample

~~~C#

        public void Cors(ref HttpListenerContext context){
            
            string _origin = context.Request.Headers["Origin"];
            if(_origin == null){
                _origin = "*";
            }
            context.Response.AppendHeader("Access-Control-Allow-Origin", _origin);
            context.Response.AppendHeader("Access-Control-Allow-Credentials", "true");
            context.Response.AppendHeader("Access-Control-Max-Age", "1000");
            context.Response.AppendHeader("Access-Control-Allow-Headers", "Custom, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
            context.Response.AppendHeader("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
        }
		
~~~
