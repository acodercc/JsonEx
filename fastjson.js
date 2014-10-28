(function(global){

    var parser = fastparser;
    var JSONFast = {
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

    global.JSONFast = JSONFast;


})(this);
