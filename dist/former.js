

(function () {
    'use strict';

    angular.module('fs-angular-former',['fs-angular-browser'])
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

        this.$get = function (fsBrowser) {

            var data = {};

            var service = {
                submit: submit,
                on: on
            };

            return service;

            function submit(path, data, options) {

                options = options || {};
                data = data || {};

                var options = angular.extend(provider.options(),options);

                if(options.events.begin) {
                    options.events.begin(data,options);
                }

                var url = provider.option('url') + path;

                var former = angular.element(document.querySelector("#former"));

                var target = fsBrowser.ie() || fsBrowser.safari() ? '_self' : '_blank';

                if(!former.length) {
                    former = angular.element("<form>")
                                .attr('action',url)
                                .attr('method','POST')
                                .attr('target','target');
                }

                angular.forEach(data,function(value,key) {

                    if(angular.isObject(value)) {
                        value = value.toString();
                    }

                    var i = document.createElement("input");
                    i.setAttribute('type',"hidden");
                    i.setAttribute('name',key);
                    i.setAttribute('value',value);
                    former.append(i);
                });

                angular.element(document.body).append(former);
                former[0].submit();
                former.remove();
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

