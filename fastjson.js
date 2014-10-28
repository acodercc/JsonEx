(function(global){

    var parser = fastparser;
    var JSONFast = {
        parse: function(str){
            if(parser.parse(str)){
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
