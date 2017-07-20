
(function () {
    'use strict';

    angular.module('fs-angular-former',['fs-angular-alert'])
    .directive('fsFormer', function(fsFormer) {
 		return {
 			restrict: 'E',
	        scope: {
	        	path: '@fsPath',
	        	data: '=?fsData'
	        },
	        link: function($scope, element) {
	        	fsFormer.submit($scope.path,$scope.data,{ element: element });
	        }
	    }
    });
})();


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

					var message = 'There was a problem trying to download the file';

					try {
						var doc = document.getElementById('former-iframe').contentWindow.document.body;
						var details = angular.element(doc).text();
						try {
							var data = JSON.parse(details);

							if(data.message) {
								details = data.message;
							} else if(data.error) {
								details = data.error;
							}

						} catch(e) {}

						message += '<a href ng-click="more=true" style="color:#ccc"> Details<a><div ng-show="more" style="padding-top:5px;color:#fff">' + details + '</div>';
					} catch(e) {}

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


angular.module('fs-angular-former').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/namespace.html',
    "<md-tabs md-selected=\"selected\" md-no-pagination md-enable-disconnect md-border-bottom><md-tab ng-repeat=\"item in items\" ng-click=\"redirect(item.path); $event.preventDefault();\">{{item.name}}</md-tab></md-tabs>"
  );

}]);
