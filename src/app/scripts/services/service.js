

(function () {
    'use strict';

    angular.module('fs-angular-former')
    .provider('fsFormer', function () {

        var provider = this;

        this._options = {   url: null,
                            data: {},
                            events: {
                                begin: null
                            }};

        this.options = function(options) {

            if(!arguments.length)
                return this._options;

            this._options = angular.merge({},this._options,options);
        }

        this.option = function(name, value) {

             if(arguments.length==1)
                return this._options[arguments[0]];

            this._options[name] = value;
        }

        this.$get = function (fsAlert,$http,$mdToast,$timeout) {

            var data = {};

            var service = {
                submit: submit,
                on: on
            };

            return service;

            function submit(path, data, options) {

            	var alertTimer = $timeout(function() {
            		$mdToast.hide();
            	},3000);

            	fsAlert.info('Preparing file for download...',{ hideDelay: 0 });

                options = options || {};
                data = data || {};

                var options = angular.extend({},provider.options(),options);

                if(options.events.begin) {
                    options.events.begin(data,options);
                }

                var url = path;
                if(!path.match(/^http/)) {
                	url = provider.option('url') + path;
                }

                var method = options.method ? options.method : 'POST';
                angular.element(document.getElementById('fs-former-iframe')).remove();

				var form = angular.element("<form>")
								.attr('id','former-form')
                        		.attr('action',url)
                        		.attr('method',method)
                        		.attr('target','former-iframe');

                angular.forEach(data,function(value,key) {

                    if(angular.isObject(value)) {
                        value = value.toString();
                    }

                    var i = document.createElement("input");
                    i.setAttribute('type',"hidden");
                    i.setAttribute('name',key);
                    i.setAttribute('value',value);
                    form.append(i);
                });

	  			var body = angular.element("<html>")
	  						.append(angular.element("<body>"));

				var iframe = angular.element('<iframe>')
								.attr('id','former-iframe')
								.attr('name','former-iframe');

				window.fsFormerLoaded = function(e) {

					var doc = document.getElementById('former-iframe').contentWindow.document.body;
					var details = angular.element(doc).text();

					if(!details)
						return;

					try {
						var data = JSON.parse(details);

						if(data.message) {
							details = data.message;
						} else if(data.error) {
							details = data.error;
						}

					} catch(e) {}

					message = ' There was a problem trying to download the file<a href ng-click="more=true" style="color:#ccc"> Details<a><div ng-show="more" style="padding-top:5px;color:#fff">' + details + '</div>';

					$timeout.cancel(alertTimer);
					$mdToast.hide();
					setTimeout(function() {
						fsAlert.error(message,{ mode: 'toast', hideDelay: 10 });
					},1000);
				}

				var formerIframe = options.element;
				if(!formerIframe) {
					formerIframe = angular.element('<fs-former-iframe>')
										.attr('id','fs-former-iframe');

					angular.element(document.body).append(formerIframe);
					iframe.attr('onload','fsFormerLoaded()');
				}

				formerIframe
					.append(form)
					.append(iframe);

                form[0].submit();
            }

            function appendObject(former, key, value){
                angular.forEach(value,function(subValue,subKey) {
                    if (subValue === Object(subValue)){
                        appendObject(former, subKey, subValue);
                    } else {
                        former.append(angular.element("<input>")
                                        .attr('type','hidden')
                                        .attr(name, key + '[' + subKey + ']')
                                        .attr(value, subValue));
                    }
                });
            }

            function on(event, value) {
                var events = provider.option('events');
                events[event] = value;
                var options = provider.option('events', events);
                return this;
            }
        }
    });
})();

