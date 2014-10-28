(function(global){

    var parser = fastparser;
    var JsonEx = {
        parse: function(str, isDebug){
            if(parser.parse(str, isDebug)){
                return parser.$$;
            }else{
                return {};
            }
        },
        stringify: function(){
        }
    };

    global.JsonEx = JsonEx;


})(this);
