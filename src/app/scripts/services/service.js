(function () {
    'use strict';

    angular.module('fs-angular-former',['fs-angular-alert'])
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

        this.$get = function (fsAlert) {

            var data = {};

            var service = {
                submit: submit,
                on: on
            };

            return service;

            function submit(path, data, options) {

            	fsAlert.info('Preparing file for download...');

                options = options || {};
                data = data || {};

                var options = angular.extend(provider.options(),options);

                if(options.events.begin) {
                    options.events.begin(data,options);
                }

                var url = provider.option('url') + path;
                var method = options.method ? options.method : 'POST';
                angular.element(document.getElementById('fs-former')).remove();

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
								.attr('name','former-iframe')
								.attr('src','about:blank');

				angular.element(document.body)
					.append(angular.element('<fs-former>')
								.attr('id','fs-former')
								.attr('style','display:none')
								.append(form)
								.append(iframe));

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
