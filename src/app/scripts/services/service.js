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

        this.$get = function ($http) {

            var data = {};

            var service = {
                submit: submit,
                inline: inline,
                on: on
            };

            return service;

            function inline(path, data, element, options) {
            	options = options || {};
            	options.element = element;
            	options.type = 'inline';
				submit(path, data, options);
            }

            function submit(path, data, options) {

                var onInfo = provider.option('onInfo');
                if(onInfo) {
                    onInfo('Preparing file for download...')
                }

                options = options || {};
                data = data || {};

                var options = angular.extend({},provider.options(),options);
                options.target = options.target || 'former-iframe';
                options.type = options.type || 'iframe';

                if(options.events.begin) {
                    options.events.begin(data,options);
                }

                var url = path;
                if(!path.match(/^http/)) {
                	url = provider.option('url') + path;
                }

                var method = options.method ? options.method : 'POST';
                angular.element(document.getElementById('fs-former-container')).remove();

				var form = angular.element("<form>")
								.attr('id','former-form')
                        		.attr('action',url)
                        		.attr('method',method)
                        		.attr('target',options.target);

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

				var container = angular.element('<fs-former-container>')
												.attr('id','fs-former-container')
												.attr('data-type',options.type);

				angular.element(document.body).append(container);

				if(options.element) {
					container.append(options.element);
					container = options.element;
				}

	  			if(options.type=='iframe' || options.type=='inline') {
					var iframe = angular.element('<iframe>')
									.attr('id','former-iframe')
									.attr('name','former-iframe')
									.attr('src','about:blank');

					window.fsFormerLoaded = function(e) {

						try {

							var doc = document.getElementById('former-iframe').contentWindow.document.body;
							var details = angular.element(doc).text();

							if(!details) {
                var onComplete = provider.option('onComplete');
                if(onComplete) {
                  onComplete();
                }

                return;
              }

							try {
								var data = JSON.parse(details);

								if(data.message) {
									details = data.message;
								} else if(data.error) {
									details = data.error;
								}

							} catch(e) {}

						} catch(e) {
							details = e.message;
						}

						var message = ' There was a problem trying to download the file<a href ng-click="more=true" style="color:#ccc"> Details<a><div ng-show="more" style="padding-top:5px;color:#fff">' + details + '</div>';

                        var onError = provider.option('onError');
                        if(onError) {
                            onError(message);
                        }

					}

					iframe.attr('onload','fsFormerLoaded()');

					container
						.append(form)
						.append(iframe);

				} else {
					container.append(form);
				}

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

