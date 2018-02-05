# flow.js
Ajax asynchronic request with CORS support


>	Change url to yours and try buttons click
>	All requests is asynchronic sync is not supported
> Native Javascript no external libriares

### Work on all modern browsers even IE9+
  
> I'am homeless developer and if you like my work you can give lite support [HERE](http://ydk2.tk/en/#donate)  

## Sample 
 
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
